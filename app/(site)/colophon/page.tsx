import type { Metadata } from "next";
import Link from "next/link";
import { Paperclip } from "lucide-react";
import { EditorialPage, MarkdownBody } from "@/components/editorial/EditorialPage";
import { Inspector } from "@/components/inspect/Inspector";
import styles from "@/components/editorial/colophon.module.css";

export const metadata: Metadata = { title: "Colophon — Jayanth Krishna", description: "Typography, paper, retrieval and the engineering behind this portfolio." };
export default function ColophonPage() {
 return <EditorialPage eyebrow="Colophon / Open the back cover" title="A workbench, all the way down." intro="The materials, decisions, and boundaries behind the site you’re using.">
  <section className={styles.paper} aria-labelledby="site-map-title"><Paperclip className={styles.clip} size={40} aria-hidden="true"/><p className={styles.label}>01 / THE SITE, UNFOLDED</p><h2 id="site-map-title">A small system with visible seams.</h2><ol className={styles.diagram}><li><span>Source material</span><strong>Projects & notes</strong><p>Repository content, edited with Keystatic.</p></li><li><span>Build & render</span><strong>Next.js + React</strong><p>Typed relationships become readable pages.</p></li><li><span>Explore</span><strong>Read. Ask. Try.</strong><p>Case studies, cited answers and browser simulations.</p></li></ol><p className={styles.hand}>Different experiences. Clear boundaries.</p><Inspector className={styles.inspect} content={{title:"Why the experiments have two paths",summary:"An implementation decision from this portfolio, not a live performance trace.",sections:[{title:"Live answers",body:"Ask searches the public Markdown notes on the server, then sends selected passages and the question to Groq. The key stays server-side. Returned source IDs are checked against retrieved passages."},{title:"Local simulations",body:"Approval and attendance use deterministic React reducers. They change in-memory sample state, without repository writes, biometric inputs or AI calls."},{title:"The tradeoff",body:"The simulations are repeatable and inspectable, but cannot establish production reliability. The live answer depends on provider availability and can still misinterpret a cited source."}],source:{href:"/lab",label:"Explore both paths"}}}/></section>
  <section className={styles.materials} aria-labelledby="type-title"><div><p className={styles.label}>02 / TYPE AS MATERIAL</p><h2 id="type-title">Four voices.<br/>Specific jobs.</h2></div><dl><div><dt className={styles.panchang}>Panchang</dt><dd>The opening statement and major section headings.</dd></div><div><dt className={styles.trench}>Trench Slab</dt><dd>Project titles and editorial reading landmarks.</dd></div><div><dt className={styles.comico}>Comico</dt><dd>Playful diagram labels and small invitations.</dd></div><div><dt className={styles.dancing}>Dancing Script</dt><dd>Personal notes, annotations and photo captions.</dd></div></dl></section>
  <MarkdownBody>{`## The quiet structure

Inter carries reading and interface text. JetBrains Mono marks dates, source details and technical traces. The four expressive fonts are hosted with this site, with their bundled licenses. Paper colours separate kinds of material: blue for retrieval, warm pink for approval, green for attendance and yellow for observations.

## A question follows a paper trail

The source is [Jayanth’s public working notes](/about/source-notes). Local feature-hashed text embeddings and keyword ranking select relevant sections. A server-side Groq request generates the answer. Citation IDs must match the retrieved set; that check does not prove that every sentence is correct.

On a project page or a related note, Ask can resolve references such as “this project.” An explicit project name takes priority, and personal questions still search across the public notes. Each question starts fresh. Missing evidence and provider failures are visible rather than replaced with a pretend model response.

## Motion with a purpose

The homepage project deck moves through three projects. Small entrances and tactile feedback support navigation. Reduced-motion styles remove the new receipt-stamp animation, while layout and controls remain available. A native dialog handles the Ask panel; forms, links and scenario controls use native interactive elements. Physical-device and broader accessibility verification remain part of the release checklist.

## Content has a provenance

Project metadata, field notes and experiment relationships live in repository content. A validation step checks those relationships before builds. Experiment metadata alone cannot publish a demo: its implementation also needs to be registered. The public knowledge document is a separate, readable source used by the active Ask endpoint.

The Lab’s approval and attendance exercises use fictional inputs and deterministic outcomes. They do not run code against a repository, capture faces, connect to payroll or establish the reliability of the projects they explain.

## What the site does not claim

There are no published performance scores here without measurement conditions. Request timings in Ask describe that request only. The current API limit is per server instance, not a durable account-wide quota. A passing simulation check demonstrates one fixture, not a production guarantee.`}</MarkdownBody>
  <div className={styles.links}><Link href="/lab">Try an experiment ↗</Link><Link href="/notes">Read the field notes ↗</Link><Link href="/about/source-notes">Inspect the source document ↗</Link></div>
 </EditorialPage>;
}
