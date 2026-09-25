"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import type { ArticleEntry } from "@/lib/content/site";
import styles from "@/components/home/home.module.css";

type Props = { entries: ArticleEntry[] };

export function ArticlesSection({ entries }: Props) {
  const root = useRef<HTMLElement>(null);
  useScrollReveal(root, "[data-note-card]", { y: 22, stagger: .09 });
  return <section ref={root} id="articles" className={`${styles.section} ${styles.notes}`} aria-labelledby="articles-heading"><div className={styles.inner}>
    <div className={styles.sectionTop}><div><p className={styles.eyebrow}>04 / FROM THE BUILD LOG</p><h2 id="articles-heading" className={styles.sectionTitle}>Notes from the workbench.</h2>
      <p className={styles.sectionIntro}>Short accounts of what changed, what broke, and what I learned while building.</p></div>
      <Link className={styles.textLink} href="/notes">All notes <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    <ul className={styles.notesGrid}>{entries.map((entry) => <li key={entry.slug} data-note-card className={styles.noteCard}>
      <p className={styles.meta}><time dateTime={entry.date}>{entry.date}</time> / {entry.tag || "BUILD LOG"}</p>
      <h3>{entry.label}</h3><p>{entry.summary}</p>
      <Link href={`/notes/${entry.slug}`}>Read the note <ArrowUpRight size={17} aria-hidden="true" /></Link>
    </li>)}</ul>
  </div></section>;
}
