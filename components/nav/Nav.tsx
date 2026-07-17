"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAsk } from "@/components/ask-my-work/AskContext";

/** Mirrors Mauricio Juba nav: 01/WORK · 02/ARTICLES · 03/LAB · 04/ABOUT · 05/CONTACT */
const links = [
  { href: "#work", index: "01", label: "WORK" },
  { href: "#articles", index: "02", label: "ARTICLES" },
  { href: "#lab", index: "03", label: "LAB" },
  { href: "#about", index: "04", label: "ABOUT" },
  { href: "#contact", index: "05", label: "CONTACT" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const { openAsk } = useAsk();

  useEffect(() => {
    function onScroll() {
      setCompressed(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-nav)] w-full border-b border-ink/10 transition-all duration-300",
        compressed
          ? "bg-bg/92 backdrop-blur-xl"
          : "bg-bg/80 backdrop-blur-md",
      )}
    >
      <nav
        className={cn(
          "section-pad mx-auto flex max-w-[var(--content-max)] items-center justify-between gap-3 transition-[height] duration-300",
          compressed ? "h-12" : "h-14",
        )}
        aria-label="Primary"
      >
        <Link
          href="/"
          className="shrink-0 font-mono-data text-[11px] tracking-[0.12em] text-ink"
          onClick={() => setOpen(false)}
        >
          JAYANTH. <span className="text-muted">PORTFOLIO/2026</span>
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="nav-link font-mono-data px-2 py-1 text-[10px] tracking-[0.14em] text-muted hover:text-ink"
              >
                {link.index}/{link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#contact"
            className="nav-link hidden font-mono-data text-[10px] tracking-[0.14em] text-ink sm:inline"
          >
            GET IN TOUCH
          </a>
          <button
            type="button"
            onClick={() => openAsk()}
            className="btn-pill btn-pill-primary motion-press text-[10px] tracking-wide"
          >
            ASK
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-[var(--radius-btn)] border border-ink/15 px-2.5 font-mono-data text-[10px] tracking-wider text-ink xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            MENU
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-[var(--z-modal)] flex flex-col bg-bg xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="section-pad flex h-14 items-center justify-between border-b border-ink/10">
            <span className="font-mono-data text-[11px] tracking-[0.14em] text-ink">
              MENU
            </span>
            <button
              type="button"
              className="font-mono-data text-[10px] tracking-wider text-muted"
              onClick={() => setOpen(false)}
            >
              CLOSE ✕
            </button>
          </div>
          <ul className="section-pad flex flex-1 flex-col justify-center gap-1 py-10">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
            className="flex items-baseline gap-4 py-3 font-display text-[clamp(2rem,10vw,2.5rem)] tracking-tight text-ink"
                  onClick={() => setOpen(false)}
                >
                  <span className="font-mono-data text-sm text-muted">
                    {link.index}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="section-pad flex flex-col gap-3 border-t border-ink/10 py-6">
            <a
              href="#contact"
              className="btn-pill btn-pill-outline w-full text-center"
              onClick={() => setOpen(false)}
            >
              GET IN TOUCH
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openAsk();
              }}
              className="btn-pill btn-pill-primary w-full"
            >
              ASK MY WORK
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
