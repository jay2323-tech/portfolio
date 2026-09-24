import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperiment, getExperiments } from "@/lib/content/experiments";
import { getCatalog, relatedLinks } from "@/lib/content/catalog";
import { EditorialPage, MarkdownBody, RelatedReading } from "@/components/editorial/EditorialPage";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return (await getExperiments()).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const experiment = await getExperiment((await params).slug);
  return experiment ? { title: `${experiment.title} — Lab`, description: experiment.description } : { title: "Experiment not found" };
}
export default async function ExperimentPage({ params }: Props) {
  const experiment = await getExperiment((await params).slug);
  if (!experiment) notFound();
  const links = relatedLinks(await getCatalog(), { projects: experiment.relatedProjectSlug ? [experiment.relatedProjectSlug] : [], notes: experiment.relatedNoteSlugs });
  return <EditorialPage eyebrow={`Lab / ${experiment.executionMode}`} title={experiment.title} intro={experiment.description} back="/lab" backLabel="All experiments">
    {/* Phase 6 mounts registered executable demos here; YAML holds metadata only. */}
    <MarkdownBody>{experiment.explanation}</MarkdownBody>
    {!!experiment.limitations.length && <MarkdownBody>{`## What this cannot prove\n\n${experiment.limitations.map((limitation) => `- ${limitation}`).join("\n")}`}</MarkdownBody>}
    <RelatedReading links={links} />
  </EditorialPage>;
}
