import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/content/site";
import { getCatalog, relatedLinks } from "@/lib/content/catalog";
import { EditorialPage, MarkdownBody, RelatedReading, noteDate } from "@/components/editorial/EditorialPage";
import styles from "@/components/editorial/editorial.module.css";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return (await getArticles()).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getArticle((await params).slug);
  return note ? { title: `${note.label} — Field notes`, description: note.summary } : { title: "Note not found" };
}
export default async function NotePage({ params }: Props) {
  const note = await getArticle((await params).slug);
  if (!note) notFound();
  const links = relatedLinks(await getCatalog(), { projects: note.relatedProjectSlugs, experiments: note.relatedExperimentSlugs });
  return <EditorialPage eyebrow={`${noteDate(note.date)} / ${note.tag || "Field note"}`} title={note.label} back="/notes" backLabel="All field notes">
    <MarkdownBody>{note.body}</MarkdownBody>
    {note.media.map((media) => <figure className={styles.media} key={media.src}>
      <Image src={media.src} alt={media.alt} width={1200} height={800} unoptimized />
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>)}
    <RelatedReading links={links} />
  </EditorialPage>;
}
