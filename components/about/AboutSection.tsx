"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteAbout } from "@/lib/content/reader";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import styles from "@/components/home/home.module.css";

type Props = { content: SiteAbout; portrait: string };

const milestones = [
  { year: "2024", project: "Factory Attendance", href: "/work/factory-attendance", label: "Production system" },
  { year: "2025", project: "CompanyBrain", href: "/work/company-brain", label: "Retrieval and sources" },
  { year: "2026", project: "WorkBuddy", href: "/work/workbuddy", label: "Local engineering companion" },
] as const;

export function AboutSection({ content, portrait }: Props) {
  const root = useRef<HTMLElement>(null);
  useScrollReveal(root, "[data-about-story], [data-about-photo], [data-milestone], [data-foundation-card]", { y: 24, stagger: .08 });
  return <section ref={root} id="about" className={`${styles.section} ${styles.about}`} aria-labelledby="about-heading"><div className={styles.inner}>
    <p className={styles.eyebrow}>05 / PERSON BEHIND THE SYSTEMS</p>
    <div className={styles.aboutGrid}><div data-about-story>
      <h2 id="about-heading" className={styles.sectionTitle}>I build where the edge cases live.</h2>
      <div className={styles.aboutStory}><p>{content.statement}</p><p>My work moves from retrieval to factory operations to tools for developers. I care about the handoff: what happens when the first answer is wrong, a camera misses, or an approved change still needs verification.</p></div>
      <div className={styles.aboutFacts}>{content.facts.map((fact) => <span key={fact}>{fact}</span>)}</div>
      <div className={styles.aboutActions}><Link className={styles.textLink} href="#contact">Start a conversation <ArrowUpRight size={17} aria-hidden="true" /></Link>
        <a className={styles.textLink} href={content.resumeHref}>{content.resumeLabel} <ArrowUpRight size={17} aria-hidden="true" /></a></div>
    </div><figure data-about-photo className={styles.photo}><Image src={portrait} alt="Jayanth exploring a temple in Vrindavan" width={420} height={520} /><figcaption>Curiosity looks better in person.</figcaption></figure></div>
    <div className={styles.milestones} aria-label="Project milestones">{milestones.map((item) => <Link key={item.year} data-milestone href={item.href}>
      <span>{item.year}</span><strong>{item.project}</strong><span>{item.label} ↗</span>
    </Link>)}</div>
    <div className={styles.foundations}><h3 className={styles.eyebrow}>FOUR PRINCIPLES I WORK BY</h3><ol className={styles.foundationGrid}>
      {content.foundations.map((foundation) => <li key={foundation.n} data-foundation-card><span>{foundation.n}</span><h4>{foundation.title}</h4><p>{foundation.body}</p></li>)}
    </ol></div>
  </div></section>;
}
