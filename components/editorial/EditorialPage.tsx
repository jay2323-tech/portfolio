import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Footer } from "@/components/Footer";
import type { relatedLinks } from "@/lib/content/catalog";
import styles from "./editorial.module.css";

export function EditorialPage({ eyebrow, title, intro, children, back = "/", backLabel = "Back to the workbench" }: {
  eyebrow: string; title: string; intro?: string; children: ReactNode; back?: string; backLabel?: string;
}) {
  return <>
    <div className={styles.page}>
      <Link className={styles.back} href={back}>{backLabel}</Link>
      <header className={styles.header}>
        <p className={styles.meta}>{eyebrow}</p>
        <h1>{title}</h1>
        {intro && <p className={styles.intro}>{intro}</p>}
      </header>
      {children}
    </div>
    <Footer />
  </>;
}

export function MarkdownBody({ children }: { children: string }) {
  return <div className={styles.prose}><ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown></div>;
}

export function RelatedReading({ links }: { links: ReturnType<typeof relatedLinks> }) {
  if (!links.length) return null;
  return <aside className={styles.related} aria-label="Related reading">
    <h2>Keep following the thread.</h2>
    <ul className={styles.list}>{links.map((link) => <li key={link.href}>
      <Link className={styles.row} href={link.href}>
        <span className={styles.meta}>{link.kind}</span><span className={styles.rowTitle}>{link.label}</span>
      </Link>
    </li>)}</ul>
  </aside>;
}

export function noteDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
