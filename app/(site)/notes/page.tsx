import type { Metadata } from "next";
import { NotesIndex } from "@/components/editorial/NotesIndex";
import { getArticles } from "@/lib/content/site";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import styles from "@/components/editorial/editorial.module.css";

export const metadata: Metadata = { title: "Notes — Jayanth Krishna", description: "Short field notes on retrieval, product decisions, and the work between releases." };

export default async function NotesPage() {
  const notes = await getArticles();
  return <EditorialPage eyebrow="Field notes / From the workbench" title="Work in the margins." intro="Short notes on what changed, what broke, and what I’m figuring out along the way.">
    {notes.length ? <NotesIndex notes={notes} /> : <p className={styles.empty}>The first field note is still on the workbench.</p>}
  </EditorialPage>;
}
