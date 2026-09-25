import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./home.module.css";

const systems = [
  { project: "CompanyBrain", tools: "Qdrant · FastAPI · Graph RAG", decision: "Hybrid search and graph context make answers traceable to their sources.", href: "/work/company-brain#company-brain-architecture" },
  { project: "Factory Attendance", tools: "Computer vision · Edge capture · Reports", decision: "The capture loop, exception queue, and reports matter as much as a match.", href: "/work/factory-attendance#factory-attendance-architecture" },
  { project: "WorkBuddy", tools: "LangGraph · SQLite · Git worktrees", decision: "Plans and memory lead into approval-bound, isolated code changes.", href: "/work/workbuddy#workbuddy-architecture" },
] as const;

export function ToolsBehindWork() {
  return <section id="tools" className={`${styles.section} ${styles.tools}`} aria-labelledby="tools-heading"><div className={styles.inner}>
    <div className={styles.sectionTop}><div><p className={styles.eyebrow}>03 / TOOLS IN CONTEXT</p><h2 id="tools-heading" className={styles.sectionTitle}>What each tool is doing.</h2>
      <p className={styles.sectionIntro}>A stack becomes useful when you can explain the decision it supports.</p></div></div>
    <div className={styles.toolGrid}>{systems.map((system) => <article className={styles.toolRow} key={system.project}>
      <h3>{system.project}</h3><p className={styles.tag}>{system.tools}</p><p>{system.decision}</p>
      <Link href={system.href}>See the architecture <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </article>)}</div>
  </div></section>;
}
