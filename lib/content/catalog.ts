import { getAllCaseStudies } from "@/lib/case-studies";
import { getArticles, getAllArticles, type ArticleEntry } from "@/lib/content/site";
import { getExperiments, getAllExperiments, isPublicExperiment, type Experiment } from "@/lib/content/experiments";
import type { CaseStudy } from "@/lib/case-studies/types";

export type Catalog = { projects: CaseStudy[]; notes: ArticleEntry[]; experiments: Experiment[] };

export async function getCatalog(includeDrafts = false): Promise<Catalog> {
  const [projects, notes, experiments] = await Promise.all([
    getAllCaseStudies(),
    includeDrafts ? getAllArticles() : getArticles(),
    includeDrafts ? getAllExperiments() : getExperiments(),
  ]);
  return { projects, notes, experiments };
}

/** Resolve against the public catalog so draft destinations never become links. */
export function relatedLinks(catalog: Catalog, references: {
  projects?: readonly string[]; notes?: readonly string[]; experiments?: readonly string[];
}) {
  return [
    ...catalog.projects.filter((item) => references.projects?.includes(item.slug))
      .map((item) => ({ href: `/work/${item.slug}`, label: item.title, kind: "Project" })),
    ...catalog.notes.filter((item) => item.publication === "published" && references.notes?.includes(item.slug))
      .map((item) => ({ href: `/notes/${item.slug}`, label: item.label, kind: "Note" })),
    ...catalog.experiments.filter((item) => isPublicExperiment(item) && references.experiments?.includes(item.slug))
      .map((item) => ({ href: `/lab/${item.slug}`, label: item.title, kind: "Experiment" })),
  ];
}

/** References may point to planned content; missing records are always an error. */
export function validateCatalog(catalog: Catalog): string[] {
  const errors: string[] = [];
  const projects = new Set(catalog.projects.map((entry) => entry.slug));
  const notes = new Set(catalog.notes.map((entry) => entry.slug));
  const experiments = new Set(catalog.experiments.map((entry) => entry.slug));
  function check(owner: string, kind: string, refs: readonly string[], known: Set<string>) {
    for (const slug of refs) {
      if (!known.has(slug)) errors.push(`${owner}: unknown ${kind} "${slug}"`);
    }
  }
  for (const entry of catalog.projects) {
    check(entry.slug, "note", entry.relatedNoteSlugs, notes);
    check(entry.slug, "experiment", [...entry.relatedExperimentSlugs, ...(entry.demoSlug ? [entry.demoSlug] : [])], experiments);
  }
  for (const entry of catalog.notes) {
    check(entry.slug, "project", entry.relatedProjectSlugs, projects);
    check(entry.slug, "experiment", entry.relatedExperimentSlugs, experiments);
    for (const media of entry.media) {
      if (!media.src || !media.alt) errors.push(`${entry.slug}: media requires a source and alt text`);
    }
  }
  for (const entry of catalog.experiments) {
    if (entry.status === "ready" && !isPublicExperiment(entry)) {
      errors.push(`${entry.slug}: ready status requires a registered, verified implementation`);
    }
    check(entry.slug, "project", entry.relatedProjectSlug ? [entry.relatedProjectSlug] : [], projects);
    check(entry.slug, "note", entry.relatedNoteSlugs, notes);
    if (entry.status === "ready" && (!entry.description || !entry.explanation || !entry.sampleInputs.length)) {
      errors.push(`${entry.slug}: a ready experiment needs a description, explanation and sample inputs`);
    }
  }
  return errors;
}
