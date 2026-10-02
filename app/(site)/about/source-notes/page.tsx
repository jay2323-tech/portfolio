import Link from "next/link";
import { getKnowledge, KNOWLEDGE_VERSION, KNOWLEDGE_DOWNLOAD } from "@/lib/rag/knowledge";
import { EditorialPage } from "@/components/editorial/EditorialPage";

export const metadata = { title: "Jayanth's source notes", description: "The public document behind Ask My Work." };
export default function SourceNotesPage() {
  return <EditorialPage eyebrow={`SOURCE DOCUMENT / ${KNOWLEDGE_VERSION}`} title="The notes behind the answers." intro="The same passages the site searches before asking Groq to write an answer. Based on Jayanth's portfolio and dated project documentation." back="/lab/retrieval-challenge" backLabel="Ask the work">
    <p><a href={KNOWLEDGE_DOWNLOAD} download className="underline underline-offset-4">Download the Markdown document ↗</a></p>
    <nav aria-label="Document contents" className="my-8 flex flex-wrap gap-x-6 gap-y-3">{getKnowledge().map((section) => <a className="text-sm underline underline-offset-4" key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav>
    {getKnowledge().map((section) => <section id={section.id} key={section.id} className="scroll-mt-28 border-t border-ink/15 py-8"><h2 className="font-display mb-4 text-2xl">{section.title}</h2><p className="max-w-3xl text-base leading-relaxed">{section.content}</p></section>)}
    <p className="mt-8"><Link href="/#contact" className="underline underline-offset-4">Need a detail that is missing? Contact Jayanth.</Link></p>
  </EditorialPage>;
}
