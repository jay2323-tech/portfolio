"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useAsk } from "@/components/ask-my-work/AskContext";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import styles from "./home.module.css";

const challenges = [
  { number: "01", project: "CompanyBrain", title: "Where did that answer come from?", description: "The wrong source chunk can make a fluent answer unreliable. Inspect why the retrieval path exposes citations and chunk metadata.", href: "/work/company-brain#company-brain-what-broke", action: "Inspect the failure", type: "RETRIEVAL / SOURCES" },
  { number: "02", project: "Factory Attendance", title: "What happens to a doubtful punch?", description: "Lighting, queues, and ambiguous matches change the design. Follow the retry and human exception decision from the factory floor.", href: "/work/factory-attendance#factory-attendance-decisions", action: "Follow the decision", type: "EDGE / EXCEPTIONS" },
  { number: "03", project: "WorkBuddy", title: "Does applied mean verified?", description: "An approved change can land in a review worktree while tests remain unproven. See how the receipt makes that boundary visible.", href: "/work/workbuddy#workbuddy-decisions", action: "Read the receipt logic", type: "APPROVAL / EXECUTION" },
] as const;

export function ChallengeSection() {
  const { openAsk } = useAsk();
  const root = useRef<HTMLElement>(null);
  useScrollReveal(root, "[data-challenge-card]", { y: 22, stagger: .09 });

  return <section ref={root} id="lab" className={`${styles.section} ${styles.challenge}`} aria-labelledby="challenge-heading"><div className={styles.inner}>
    <div className={styles.sectionTop}><div><p className={styles.eyebrow}>01 / TRY A TOUGHER QUESTION</p><h2 id="challenge-heading" className={styles.sectionTitle}>Break my work.</h2>
      <p className={styles.sectionIntro}>The interesting part of a system is where it might fail. Start with the decision, then inspect the tradeoff behind it.</p></div>
      <p className={styles.asideNote}>Good systems invite difficult questions.</p></div>
    <div className={styles.challengeGrid}>{challenges.map((challenge) => <article key={challenge.project} data-challenge-card className={styles.challengeCard}>
      <div className={styles.cardTop}><span>{challenge.number} / {challenge.project}</span><span>{challenge.type}</span></div>
      <h3>{challenge.project}</h3><p className={styles.question}>{challenge.title}</p><p className={styles.explain}>{challenge.description}</p>
      <Link className={styles.cardAction} href={challenge.href}>{challenge.action}<ArrowUpRight size={17} aria-hidden="true" /></Link>
    </article>)}</div>
    <div className={styles.challengeFoot}><p>Three runnable, resettable challenges are being built for the Lab. These links open the real engineering decisions today.</p>
      <button type="button" className={styles.textLink} onClick={() => openAsk()}>Ask about the work <ArrowUpRight size={17} aria-hidden="true" /></button></div>
  </div></section>;
}
