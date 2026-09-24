import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Paperclip } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies/types";
import { Inspector } from "@/components/inspect/Inspector";
import { ScrollWorkbench } from "./ScrollWorkbench";
import styles from "./workbench.module.css";

export function WorkbenchHero({ studies, portrait }: { studies: CaseStudy[]; portrait: string }) {
  const featured = studies.find((study) => study.slug === "company-brain") ?? studies[0];
  if (!featured) return null;
  return <section id="top" className={styles.hero} aria-labelledby="workbench-title">
    <header className={styles.intro}>
      <h1 id="workbench-title">SYSTEMS,<br />WITH <span>RECEIPTS.</span></h1>
      <p>Open a project. Inspect a decision. Try an experiment.</p>
      <div className={styles.scribble} aria-hidden="true"><Image src="/images/collage/stickers/sparkle-clay.svg" alt="" width={42} height={48} /><span>Curiosity<br />compiles<br />well.</span></div>
    </header>
    <ScrollWorkbench>
      <aside className={styles.personal}>
        <figure className={styles.photo}>
          <div className={styles.photoWindow}><Image src={portrait} alt="Jayanth exploring a temple in Vrindavan" width={420} height={520} priority className={styles.portrait} /></div>
          <figcaption>Some problems are<br />better seen in person.</figcaption>
        </figure>
        <p>I build practical AI systems that work in the real world — from retrieval and automation to full-stack products.</p>
        <Link href="#about" className={styles.about}>About Jayanth <ArrowUpRight size={19} aria-hidden="true" /></Link>
      </aside>
      <div id="work" className={styles.projects}>
        <div data-deck-stage className={styles.deckStage}>
        {studies.map((featured, projectIndex) => <article key={featured.slug} id={`sheet-${featured.slug}`} data-deck-card className={styles.folio} data-project={featured.slug}>
          <span className={styles.index}>{String(projectIndex + 1).padStart(2, "0")}</span>
          <Paperclip className={styles.clip} size={43} strokeWidth={1} aria-hidden="true" />
          <div className={styles.folioContent}>
            <div className={styles.projectIntro}>
              <h2>{featured.title}</h2>
              <span className={styles.status}>{featured.status === "live" ? "Production" : "In development"}</span>
              <p>{featured.summary}</p>
            </div>
            {projectIndex === 0 ? <Image className={styles.note} src="/images/workbench/debug-note.png" alt="What broke: the answer cited the wrong chunk." width={280} height={210} /> : <aside className={styles.textNote}><span>WHAT BROKE</span><p>{projectIndex === 1 ? "Real entrances broke the lab assumptions." : "Collecting data was easier than justifying it."}</p></aside>}
            <figure className={styles.diagram}>
              {projectIndex === 0 ? <Image src="/images/workbench/retrieval-diagram.png?v=2" alt="Documents, retrieval, sources, and an answer with citations." width={2172} height={724} /> : <div className={styles.systemFacts}><p>{featured.architectureSummary}</p><dl>{featured.metrics.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></div>}
              <figcaption>{projectIndex === 0 ? "System illustration (not a product screenshot)" : "Architecture notes / system facts, not measured outcomes"}</figcaption>
            </figure>
            {projectIndex === 0 && <details className={styles.diagramText}><summary>Read the diagram</summary><ol><li>Company documents provide the source material.</li><li>Retrieval embeds, searches, and reranks relevant chunks.</li><li>Selected sources ground the answer and its citations.</li></ol></details>}
            <div className={styles.actions}>
              <Link className={styles.primary} href={`/work/${featured.slug}`}>Open the case study <ArrowRight size={26} strokeWidth={1.5} aria-hidden="true" /></Link>
              <Inspector className={styles.inspect} content={{ title: featured.decisions[0]?.title ?? featured.title, summary: `${featured.title} / authored engineering notes. This explains the design decision; it is not a live request trace.`, sections: [{title: "The tradeoff", body: featured.decisions[0]?.body ?? featured.architectureSummary}, {title: "What broke", body: featured.whatBroke}, {title: "The boundary", body: featured.slug === "company-brain" ? "The diagram simplifies the retrieval path. It does not show a live run, measured accuracy, or private documents." : featured.resultContext}], source: {href: `/work/${featured.slug}#${featured.sectionIds.decisions}`,label: "Read the full decision"} }} />
            </div>
          </div>
        </article>)}
        </div>
        <nav className={styles.deckNav} aria-label="Project chapters"><p>THREE SYSTEMS / SCROLL TO EXPLORE</p><ol>{studies.map((study, index) => <li key={study.slug}><a href={`#sheet-${study.slug}`} data-deck-jump={index}><span>{String(index + 1).padStart(2, "0")}</span>{study.title}<ArrowUpRight size={16} aria-hidden="true" /></a></li>)}</ol></nav>
      </div>
    </ScrollWorkbench>
    <Link className={styles.buildNote} href="/notes/2026-07-10-companybrain">FROM THE BUILD LOG / 10 JUL 2026 — CompanyBrain chat hardening <ArrowUpRight size={15} aria-hidden="true" /></Link>
  </section>;
}
