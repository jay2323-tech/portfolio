import type { CaseStudy, CaseStudyStatus } from "@/lib/case-studies/types";
import { getReader } from "@/lib/content/reader";

function asCaseStudy(
  slug: string,
  data: NonNullable<
    Awaited<
      ReturnType<ReturnType<typeof getReader>["collections"]["caseStudies"]["read"]>
    >
  >,
): CaseStudy {
  const status = (data.status as CaseStudyStatus) ?? "development";
  return {
    slug,
    title: data.title,
    problem: data.problem ?? "",
    status,
    statusLabel: data.statusLabel || status.toUpperCase(),
    domain: data.domain || "Product",
    year: data.year || "2025",
    coverImage:
      data.coverImage ||
      `/images/work/${slug}.svg`,
    metrics: (data.metrics ?? []).map((m) => ({
      label: m.label ?? "",
      value: m.value ?? "",
    })),
    tags: (data.tags ?? []).filter(Boolean).slice(0, 4),
    eyebrow: data.eyebrow || "CASE STUDY",
    headline: data.headline || data.title,
    who: data.who ?? "",
    constraints: (data.constraints ?? []).filter(Boolean),
    architectureSummary: data.architectureSummary ?? "",
    decisions: (data.decisions ?? []).map((d) => ({
      title: d.title ?? "",
      body: d.body ?? "",
    })),
    whatBroke: data.whatBroke ?? "",
    links: (data.links ?? []).map((l) => ({
      label: l.label ?? "",
      href: l.href || "#",
      external: Boolean(l.external),
    })),
    sectionIds: {
      context: `${slug}-context`,
      architecture: `${slug}-architecture`,
      decisions: `${slug}-decisions`,
      whatBroke: `${slug}-what-broke`,
      metrics: `${slug}-metrics`,
    },
  };
}

export async function getCaseStudySlugs(): Promise<string[]> {
  const reader = getReader();
  return reader.collections.caseStudies.list();
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const reader = getReader();
  const data = await reader.collections.caseStudies.read(slug);
  if (!data) return null;
  return asCaseStudy(slug, data);
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const reader = getReader();
  const settings = await reader.singletons.settings.read();
  const order = settings?.workOrder?.filter(Boolean) ?? [
    "company-brain",
    "factory-attendance",
    "desi-fit",
  ];
  const slugs = await reader.collections.caseStudies.list();
  const studies = (
    await Promise.all(slugs.map((slug) => getCaseStudy(slug)))
  ).filter((s): s is CaseStudy => s !== null);

  return studies.sort((a, b) => {
    const ai = order.indexOf(a.slug);
    const bi = order.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}
