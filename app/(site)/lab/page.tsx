import type { Metadata } from "next";
import Link from "next/link";
import { getExperiments } from "@/lib/content/experiments";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import styles from "@/components/editorial/editorial.module.css";

export const metadata: Metadata = { title: "Lab — Jayanth Krishna", description: "Small experiments for inspecting how a system behaves." };
export default async function LabPage() {
  const experiments = await getExperiments();
  return <EditorialPage eyebrow="The lab / A place to test assumptions" title="Try it. Question it." intro="Small, inspectable experiments. Each one will tell you what it runs, where the data comes from, and what it cannot prove.">
    {experiments.length ? <ul className={styles.list}>{experiments.map((entry) => <li key={entry.slug}>
      <Link className={styles.row} href={`/lab/${entry.slug}`}>
        <span className={styles.meta}>{entry.executionMode}</span>
        <h2 className={styles.rowTitle}>{entry.title}</h2>
        <p className={styles.rowSummary}>{entry.description}</p>
      </Link>
    </li>)}</ul> : <section className={styles.empty}>
      <h2>Still on the workbench.</h2>
      <p>The experiments are being built. There are no runnable demos here yet.</p>
      <p>In the meantime, <Link href="/work/company-brain">read the CompanyBrain decisions</Link> or <Link href="/notes">follow the field notes</Link>.</p>
    </section>}
  </EditorialPage>;
}
