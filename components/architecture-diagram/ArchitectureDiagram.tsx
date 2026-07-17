"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  COMPANY_BRAIN_EDGES,
  COMPANY_BRAIN_NODES,
  type ArchNode,
} from "./data";

function nodeCenter(node: ArchNode) {
  return { cx: node.x, cy: node.y };
}

function edgePath(from: ArchNode, to: ArchNode) {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const mx = (a.cx + b.cx) / 2;
  const my = (a.cy + b.cy) / 2;
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const norm = Math.hypot(dx, dy) || 1;
  const ox = (-dy / norm) * 18;
  const oy = (dx / norm) * 18;
  return `M ${a.cx} ${a.cy} Q ${mx + ox} ${my + oy} ${b.cx} ${b.cy}`;
}

function connectedIds(activeId: string | null): Set<string> {
  if (!activeId) return new Set();
  const ids = new Set<string>([activeId]);
  for (const edge of COMPANY_BRAIN_EDGES) {
    if (edge.from === activeId || edge.to === activeId) {
      ids.add(edge.from);
      ids.add(edge.to);
    }
  }
  return ids;
}

function connectedEdgeIds(activeId: string | null): Set<string> {
  if (!activeId) return new Set();
  return new Set(
    COMPANY_BRAIN_EDGES.filter(
      (e) => e.from === activeId || e.to === activeId,
    ).map((e) => e.id),
  );
}

function DesktopDiagram() {
  const router = useRouter();
  const gradientId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  const active = useMemo(
    () => COMPANY_BRAIN_NODES.find((n) => n.id === (tooltipId ?? activeId)) ?? null,
    [activeId, tooltipId],
  );
  const litNodes = connectedIds(activeId);
  const litEdges = connectedEdgeIds(activeId);
  const nodeById = useMemo(
    () => Object.fromEntries(COMPANY_BRAIN_NODES.map((n) => [n.id, n])),
    [],
  );

  const go = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  return (
    <div className="relative hidden md:block">
      <svg
        viewBox="0 0 860 400"
        className="h-auto w-full"
        role="img"
        aria-labelledby="arch-diagram-title arch-diagram-desc"
      >
        <title id="arch-diagram-title">CompanyBrain system architecture</title>
        <desc id="arch-diagram-desc">
          Interactive diagram. Focus a node to highlight connections. Activate to
          open the related case study section.
        </desc>

        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C77D3C" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#C77D3C" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {COMPANY_BRAIN_EDGES.map((edge) => {
          const from = nodeById[edge.from];
          const to = nodeById[edge.to];
          if (!from || !to) return null;
          const lit = !activeId || litEdges.has(edge.id);
          return (
            <path
              key={edge.id}
              d={edgePath(from, to)}
              fill="none"
              stroke={lit && activeId ? "#C77D3C" : "rgba(20,20,20,0.2)"}
              strokeWidth={lit && activeId ? 2.25 : 1.25}
              strokeOpacity={activeId && !lit ? 0.2 : 1}
              className="transition-[stroke,stroke-opacity,stroke-width] duration-150"
            />
          );
        })}

        {COMPANY_BRAIN_NODES.map((node) => {
          const lit = !activeId || litNodes.has(node.id);
          const isActive = activeId === node.id;
          const x = node.x - node.w / 2;
          const y = node.y - node.h / 2;

          return (
            <g
              key={node.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer outline-none"
              tabIndex={0}
              role="link"
              aria-label={`${node.label}. ${node.blurb}`}
              onMouseEnter={() => {
                setActiveId(node.id);
                setTooltipId(node.id);
              }}
              onMouseLeave={() => {
                setActiveId(null);
                setTooltipId(null);
              }}
              onFocus={() => {
                setActiveId(node.id);
                setTooltipId(node.id);
              }}
              onBlur={() => {
                setActiveId(null);
                setTooltipId(null);
              }}
              onClick={() => go(node.href)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  go(node.href);
                }
              }}
            >
              <rect
                width={node.w}
                height={node.h}
                rx={12}
                ry={12}
                fill={isActive ? "rgba(199,125,60,0.14)" : "#FAFAF8"}
                stroke={isActive ? "#C77D3C" : "rgba(20,20,20,0.12)"}
                strokeWidth={isActive ? 1.75 : 1}
                opacity={lit ? 1 : 0.35}
                className="transition-[fill,stroke,opacity] duration-150"
              />
              <text
                x={node.w / 2}
                y={node.h / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? "#141414" : "rgba(20,20,20,0.75)"}
                fontSize={12}
                fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                opacity={lit ? 1 : 0.4}
                className="pointer-events-none select-none"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        className={cn(
          "pointer-events-none absolute z-[var(--z-tooltip)] max-w-xs rounded-[var(--radius-card)] border border-ink/10 bg-surface p-4 shadow-xl transition-opacity duration-150",
          active ? "opacity-100" : "opacity-0",
        )}
        style={
          active
            ? {
                left: `clamp(0px, calc(${(active.x / 860) * 100}% - 8rem), calc(100% - 18rem))`,
                top: `clamp(0px, calc(${(active.y / 400) * 100}% + 2.5rem), calc(100% - 7rem))`,
              }
            : undefined
        }
        role="tooltip"
        aria-hidden={!active}
      >
        {active && (
          <>
            <p className="font-mono-data text-[10px] uppercase tracking-wider text-accent-clay">
              {active.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">
              {active.blurb}
            </p>
            <p className="font-mono-data mt-3 text-[10px] text-muted">
              Enter / click → case study
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function MobileDiagram() {
  const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter();

  const order = ["org", "api", "rag", "qdrant", "llm"] as const;
  const nodes = order
    .map((id) => COMPANY_BRAIN_NODES.find((n) => n.id === id))
    .filter((n): n is ArchNode => Boolean(n));

  return (
    <ol className="space-y-2 md:hidden">
      {nodes.map((node, i) => {
        const open = openId === node.id;
        return (
          <li key={node.id}>
            <button
              type="button"
              className={cn(
                "paper-card w-full px-4 py-3 text-left transition-colors",
                open && "border-accent-clay/50",
              )}
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : node.id)}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono-data text-[10px] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono-data flex-1 text-xs text-ink">
                  {node.label}
                </span>
                <span className="font-mono-data text-[10px] text-muted">
                  {open ? "−" : "+"}
                </span>
              </span>
            </button>
            {open && (
              <div className="ml-4 mt-1 border-l border-ink/10 px-4 py-3">
                <p className="text-sm leading-relaxed text-ink/85">
                  {node.blurb}
                </p>
                <button
                  type="button"
                  className="mt-3 text-sm text-accent-clay hover:opacity-80"
                  onClick={() => router.push(node.href)}
                >
                  Open in case study →
                </button>
              </div>
            )}
            {i < nodes.length - 1 && (
              <div className="ml-7 h-3 w-px bg-ink/15" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function ArchitectureDiagramCanvas() {
  return (
    <div className="rounded-[var(--radius-hero)] border border-ink/8 bg-bg p-4 md:p-8">
      <DesktopDiagram />
      <MobileDiagram />
    </div>
  );
}
