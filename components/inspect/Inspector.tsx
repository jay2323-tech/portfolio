"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import styles from "./inspector.module.css";

export type Inspection = {
  title: string;
  summary: string;
  sections: { title: string; body: string }[];
  source: { href: string; label: string };
};

export function Inspector({ content, className }: { content: Inspection; className?: string }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    return () => { document.body.style.overflow = previousOverflow.current; };
  }, [open]);
  function close() { dialog.current?.close(); }
  function restore() {
    document.body.style.overflow = previousOverflow.current;
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }
  return <>
    <button ref={trigger} className={className} aria-haspopup="dialog" aria-expanded={open} onClick={() => {
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.current?.showModal();
      setOpen(true);
    }}>Inspect the decision <ArrowUpRight size={18} aria-hidden="true" /></button>
    <dialog data-lenis-prevent ref={dialog} className={styles.dialog} aria-labelledby={titleId} onClose={restore} onClick={(event) => { if (event.target === dialog.current) close(); }}>
      <div className={styles.sheet}>
        <header><span>X-RAY / ENGINEERING NOTES</span><button autoFocus aria-label="Close inspection" onClick={close}><X size={24} /></button></header>
        <h2 id={titleId}>{content.title}</h2>
        <p className={styles.summary}>{content.summary}</p>
        {content.sections.map((section, index) => <section key={section.title}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><h3>{section.title}</h3><p>{section.body}</p></section>)}
        <Link href={content.source.href} onClick={close}>{content.source.label} <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
    </dialog>
    <noscript><Link href={content.source.href}>Read the engineering decisions</Link></noscript>
  </>;
}
