"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ProjectExhibit } from "./ProjectExhibit";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { consumeWorkFlip, playWorkFlip } from "@/lib/motion/flipNav";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import type { CaseStudy } from "@/lib/case-studies/types";
import styles from "./case-study.module.css";

type Props = {
  study: CaseStudy;
  nextStudy: Pick<CaseStudy, "slug" | "title" | "problem"> | null;
  related: { href: string; label: string; kind: string }[];
};
const flows: Record<string, { label: string; detail: string }[]> = {
  "company-brain": [
    { label: "Client + context", detail: "The interface sends the question with organization, team, and user context. This context is part of the retrieval request." },
    { label: "FastAPI", detail: "The orchestration layer routes the request into retrieval and coordinates the response stream." },
    { label: "Hybrid + graph retrieval", detail: "Search uses Qdrant and graph context to find relevant passages and organizational relationships. Retrieved chunk metadata supports inspection of the answer's sources." },
    { label: "SSE + source inspection", detail: "The response streams back to the interface. Retrieved passages and routing information let the operator inspect how the answer was produced." },
  ],
  "factory-attendance": [
    { label: "Entrance capture", detail: "Floor devices feed the recognition pipeline. Lighting, camera angle, and shift-change queues constrain the capture loop." },
    { label: "Recognition + retry", detail: "A clean match can proceed. An unclear capture needs visible retry guidance; ambiguous punches move to the exception path." },
    { label: "Operator resolution", detail: "On-site staff review ambiguous punches. Supervisor resolution provides a fallback when capture alone cannot establish attendance." },
    { label: "Cloud store + reports", detail: "Verified punches enter the attendance store. Daily summaries and anomaly views support operations and payroll reconciliation." },
  ],
  workbuddy: [
    { label: "Channels + context", detail: "Telegram and the macOS companion share a FastAPI backend. SQLite keeps plans, task events, and memory; BM25 retrieves project documents." },
    { label: "Project brief + plan", detail: "An exact configured project can expose approved plan facts, recorded decisions, an unfinished ticket, and bounded Git metadata. Sources and unknowns remain explicit; saved context does not prove source freshness." },
    { label: "Checkpointed approval", detail: "LangGraph pauses the proposal for the owning channel. Approval binds the proposed content, project root, paths, branch, and base commit." },
    { label: "Worktree + receipt", detail: "A model-free executor applies approved paths in an isolated review worktree. Typed receipts retain partial and failed outcomes; application remains distinct from test verification." },
  ],
};

export function CaseStudyDetail({ study, nextStudy, related }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef, "[data-case-reveal]", { y: 18, stagger: 0.06 });
  useLayoutEffect(() => {
    if (!titleRef.current) return;
    const payload = consumeWorkFlip(study.slug);
    registerGsap();
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (payload?.rects.title && titleRef.current) {
        void playWorkFlip(titleRef.current, payload.rects.title);
        if (introRef.current) gsap.fromTo(introRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", clearProps: "transform,opacity" });
      } else {
        gsap.fromTo([titleRef.current, introRef.current].filter(Boolean), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out", clearProps: "transform,opacity" });
      }
    }, rootRef);
    return () => media.revert();
  }, [study.slug]);
  const contents = [
    ["Overview", "overview"], ["Walkthrough", "walkthrough"],
    ["Constraints", study.sectionIds.context], ["Architecture", study.sectionIds.architecture],
    ["Decisions", study.sectionIds.decisions], ["What broke", study.sectionIds.whatBroke],
    ["Evidence & limits", study.sectionIds.metrics],
  ];
  return (
    <article ref={rootRef} className={styles.article} data-project={study.slug}>
      <header className={styles.hero}>
        <Link href="/#work" className={styles.back}>← Back to work</Link>
        <div className={styles.heroTop}><span>{study.eyebrow}</span><span>FIELD NOTE / {study.year}</span></div>
        <h1 ref={titleRef} data-flip-title className={styles.title}>{study.title}</h1>
        <div ref={introRef} className={styles.intro}>
          <p className={styles.headline}>{study.headline}</p>
          <dl className={styles.factStrip}>
            <div><dt>ROLE</dt><dd>{study.role}</dd></div>
            <div><dt>WHEN</dt><dd>{study.timeframe}</dd></div>
            <div><dt>STATUS</dt><dd>{study.statusLabel}</dd></div>
          </dl>
        </div>
      </header>
      <div className={styles.layout}>
        <nav className={styles.contents} aria-label="On this page">
          <p>ON THIS PAGE</p>
          {contents.map(([label, id], index) => <a key={id} href={`#${id}`}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>)}
        </nav>
        <div className={styles.body}>
          <section id="overview" className={styles.section}>
            <p className={styles.kicker}>01 / THE SHORT VERSION</p><h2>What it does.</h2>
            <p className={styles.lead}>{study.summary}</p><p>{study.who}</p>
          </section>
          <section id="walkthrough" className={styles.section}>
            <p className={styles.kicker}>02 / INSIDE THE WORK</p><h2 data-case-reveal>{study.slug === "company-brain" ? "Check the source." : study.slug === "factory-attendance" ? "Follow the exception." : "Read the receipt."}</h2>
            <ProjectExhibit slug={study.slug} />
          </section>
          <section id={study.sectionIds.context} className={styles.section}>
            <p className={styles.kicker}>03 / REAL-WORLD CONSTRAINTS</p><h2>What shaped the build.</h2>
            <ul className={styles.ruleList}>{study.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section id={study.sectionIds.architecture} className={styles.section}>
            <p className={styles.kicker}>04 / SYSTEM MAP</p><h2>How the parts connect.</h2>
            <p className={styles.lead}>{study.architectureSummary}</p>
            <p className={styles.note}>Open each stage to inspect its role in the documented workflow.</p>
            <ol className={styles.flow}>
              {(flows[study.slug] ?? []).map((step, index) => (
                <li key={step.label}>
                  <details open={index === 0}>
                    <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{step.label}</strong><span aria-hidden="true">+</span></summary>
                    <p>{step.detail}</p>
                    <a href={`#${study.sectionIds.decisions}`}>Read the decisions ↗</a>
                  </details>
                </li>
              ))}
            </ol>
            <div className={styles.stack}><span>TOOLS IN THIS BUILD</span><p>{study.tags.join(" · ")}</p></div>
          </section>
          <section id={study.sectionIds.decisions} className={styles.section}>
            <p className={styles.kicker}>05 / ENGINEERING DECISIONS</p><h2>Tradeoffs with a reason.</h2>
            <ol className={styles.decisions}>{study.decisions.map((decision, index) => <li data-case-reveal key={decision.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{decision.title}</h3><p>{decision.body}</p></div></li>)}</ol>
          </section>
          <section id={study.sectionIds.whatBroke} className={styles.section}>
            <p className={styles.kicker}>06 / FAILURE NOTE</p><h2>What broke. What changed.</h2>
            <blockquote>{study.whatBroke}</blockquote>
          </section>
          <section id={study.sectionIds.metrics} className={styles.section}>
            <p className={styles.kicker}>07 / EVIDENCE & LIMITS</p><h2>What the record supports.</h2>
            <p className={styles.lead}>{study.resultContext}</p>
            {study.evidence.length > 0 && <div className={styles.evidence}>{study.evidence.map((item) => <div key={item.title}><span>{item.kind.toUpperCase()}</span><strong>{item.title}</strong><p>{item.caption}</p><Link href={item.href}>Read the supporting context ↗</Link></div>)}</div>}
            {study.limitations.length > 0 && <><h3 className={styles.limitTitle}>Still unresolved</h3><ul className={styles.ruleList}>{study.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul></>}
          </section>
          <aside className={styles.outro}>
            <p className={styles.kicker}>KEEP EXPLORING</p><h2>Follow the work.</h2>
            <div className={styles.related}>
              {nextStudy && <Link href={`/work/${nextStudy.slug}`}><span>NEXT PROJECT</span><strong>{nextStudy.title} ↗</strong><small>{nextStudy.problem}</small></Link>}
              {related.map((link) => <Link key={link.href} href={link.href}><span>{link.kind.toUpperCase()}</span><strong>{link.label} ↗</strong></Link>)}
              {study.links.filter((link) => !link.href.startsWith(`/work/${study.slug}`)).map((link) => <a key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}><span>PROJECT LINK</span><strong>{link.label} ↗</strong></a>)}
              <Link href="/#contact"><span>HAVE A PROJECT?</span><strong>Start a conversation ↗</strong></Link>
            </div>
            <Link href="/#work" className={styles.back}>← Back to all work</Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
