import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "@/components/home/home.module.css";

const steps = [
  { n: "01", title: "Understand", description: "Name the people, real environment, and constraints before choosing an implementation.", artifact: "Factory floor context", href: "/work/factory-attendance#factory-attendance-context" },
  { n: "02", title: "Map", description: "Draw the path from input to decision so handoffs and failure points become visible.", artifact: "CompanyBrain architecture", href: "/work/company-brain#company-brain-architecture" },
  { n: "03", title: "Build", description: "Make tradeoffs explicit and leave a way to inspect what a system actually did.", artifact: "WorkBuddy decisions", href: "/work/workbuddy#workbuddy-decisions" },
  { n: "04", title: "Verify", description: "Record evidence and limits. A completed change is a checkpoint, not proof that every test passed.", artifact: "WorkBuddy evidence & limits", href: "/work/workbuddy#workbuddy-metrics" },
] as const;

export function ProcessSteps() {
  return <section id="process" className={`${styles.section} ${styles.process}`} aria-labelledby="process-heading"><div className={styles.inner}>
    <div className={styles.sectionTop}><div><p className={styles.eyebrow}>02 / METHOD & MATERIAL</p><h2 id="process-heading" className={styles.sectionTitle}>How I build.</h2>
      <p className={styles.sectionIntro}>Four moves I can show through actual project notes, architecture, and decisions.</p></div></div>
    <ol className={styles.stepList}>{steps.map((step) => <li key={step.n} className={styles.step}>
      <span className={styles.stepNumber}>{step.n} / 04</span><h3>{step.title}</h3><p>{step.description}</p>
      <Link className={styles.artifact} href={step.href}>{step.artifact}<ArrowUpRight size={16} aria-hidden="true" /></Link>
    </li>)}</ol>
  </div></section>;
}
