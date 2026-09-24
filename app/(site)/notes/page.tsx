import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/content/site";
import { EditorialPage, noteDate } from "@/components/editorial/EditorialPage";
import styles from "@/components/editorial/editorial.module.css";

export const metadata: Metadata = { title: "Notes — Jayanth Krishna", description: "Short field notes on retrieval, product decisions, and the work between releases." };

export default async function NotesPage() {
  const notes = await getArticles();
  return <EditorialPage eyebrow="Field notes / From the workbench" title="Work in the margins." intro="Short notes on what changed, what broke, and what I’m figuring out along the way.">
    {notes.length ? <ul className={styles.list}>{notes.map((note) => <li key={note.slug}>
      <Link className={styles.row} href={`/notes/${note.slug}`}>
        <span className={styles.meta}><time dateTime={note.date}>{noteDate(note.date)}</time>{note.tag && ` / ${note.tag}`}</span>
        <h2 className={styles.rowTitle}>{note.label}</h2>
        <p className={styles.rowSummary}>{note.summary}</p>
      </Link>
    </li>)}</ul> : <p className={styles.empty}>The first field note is still on the workbench.</p>}
  </EditorialPage>;
}
