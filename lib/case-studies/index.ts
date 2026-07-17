import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { CaseStudy, CaseStudyMetric, CaseStudyStatus } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content/case-studies");

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
      return Object.entries(item as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(", ");
    }
    return String(item);
  });
}

function asMetrics(value: unknown): CaseStudyMetric[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = item as { label?: string; value?: string };
    return { label: String(row.label ?? ""), value: String(row.value ?? "") };
  });
}

function asDecisions(value: unknown): CaseStudy["decisions"] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = item as { title?: string; body?: string };
    return { title: String(row.title ?? ""), body: String(row.body ?? "") };
  });
}

function asLinks(value: unknown): CaseStudy["links"] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = item as { label?: string; href?: string; external?: boolean };
    return {
      label: String(row.label ?? ""),
      href: String(row.href ?? "#"),
      external: Boolean(row.external),
    };
  });
}

function parseCaseStudy(slug: string, raw: string): CaseStudy {
  const { data } = matter(raw);
  const status = (data.status as CaseStudyStatus) ?? "development";

  return {
    slug: String(data.slug ?? slug),
    title: String(data.title ?? slug),
    problem: String(data.problem ?? ""),
    status,
    statusLabel: String(data.statusLabel ?? status.toUpperCase()),
    metrics: asMetrics(data.metrics),
    tags: asStringArray(data.tags).slice(0, 4),
    eyebrow: String(data.eyebrow ?? "CASE STUDY"),
    headline: String(data.headline ?? data.title ?? ""),
    who: String(data.who ?? ""),
    constraints: asStringArray(data.constraints),
    architectureSummary: String(data.architectureSummary ?? ""),
    decisions: asDecisions(data.decisions),
    whatBroke: String(data.whatBroke ?? ""),
    links: asLinks(data.links),
    sectionIds: {
      context: `${slug}-context`,
      architecture: `${slug}-architecture`,
      decisions: `${slug}-decisions`,
      whatBroke: `${slug}-what-broke`,
      metrics: `${slug}-metrics`,
    },
  };
}

export function getCaseStudySlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseCaseStudy(slug, fs.readFileSync(filePath, "utf8"));
}

export function getAllCaseStudies(): CaseStudy[] {
  const order = ["company-brain", "factory-attendance", "desi-fit"];
  const studies = getCaseStudySlugs()
    .map((slug) => getCaseStudy(slug))
    .filter((study): study is CaseStudy => study !== null);

  return studies.sort((a, b) => {
    const ai = order.indexOf(a.slug);
    const bi = order.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}
