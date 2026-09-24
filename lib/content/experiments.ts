import { getReader } from "@/lib/content/reader";

export type Experiment = {
  slug: string;
  title: string;
  description: string;
  status: "planned" | "ready";
  executionMode: "simulation" | "live" | "recorded";
  relatedProjectSlug: string | null;
  relatedNoteSlugs: string[];
  sampleInputs: { label: string; value: string }[];
  explanation: string;
  limitations: string[];
};

// Add a slug only after its executable UI is wired in /lab/[slug] and verified.
// A CMS status change alone must not expose an unfinished demo.
export const implementedExperimentSlugs: readonly string[] = [];

export function isPublicExperiment(entry: Experiment): boolean {
  return entry.status === "ready" && implementedExperimentSlugs.includes(entry.slug);
}

export async function getAllExperiments(): Promise<Experiment[]> {
  const reader = getReader();
  const entries = await reader.collections.experiments.all();
  return entries.map(({ slug, entry }) => ({
    slug,
    title: entry.title,
    description: entry.description,
    status: entry.status ?? "planned",
    executionMode: entry.executionMode ?? "simulation",
    relatedProjectSlug: entry.relatedProjectSlug || null,
    relatedNoteSlugs: [...(entry.relatedNoteSlugs ?? [])].filter(Boolean),
    sampleInputs: (entry.sampleInputs ?? []).map((input) => ({ ...input })),
    explanation: entry.explanation ?? "",
    limitations: [...(entry.limitations ?? [])].filter(Boolean),
  }));
}

export async function getExperiments(): Promise<Experiment[]> {
  return (await getAllExperiments()).filter(isPublicExperiment);
}

export async function getExperiment(slug: string): Promise<Experiment | null> {
  return (await getExperiments()).find((entry) => entry.slug === slug) ?? null;
}
