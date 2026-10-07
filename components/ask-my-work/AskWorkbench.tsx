"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contextForPath, contextDetails } from "@/lib/rag/page-context";
import { ArrowRight, ArrowUpRight, FileText, ScanSearch, Sparkles, Quote, Paperclip, RotateCcw, X } from "lucide-react";
import { askStream, EXAMPLE_QUESTIONS, type AskResult, type AskTrace, type RetrievedMeta } from "@/lib/rag/client";
import styles from "./ask-workbench.module.css";

type Props = { variant?: "full" | "compact" | "modal"; initialQuestion?: string; onClose?: () => void };
type Phase = "idle" | "retrieving" | "generating" | "done" | "error" | "cancelled";
export function AskWorkbench({ variant = "full", initialQuestion = "", onClose }: Props) {
  const id = useId();
  const pathname = usePathname();
  const pageContext = contextForPath(pathname);
  const pageDetails = pageContext ? contextDetails(pageContext) : null;
  const examples = pageDetails?.questions ?? EXAMPLE_QUESTIONS;
  const [input, setInput] = useState(initialQuestion);
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [sources, setSources] = useState<RetrievedMeta[]>([]);
  const [trace, setTrace] = useState<AskTrace | null>(null);
  const [result, setResult] = useState<AskResult | null>(null);
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const controller = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = phase === "retrieving" || phase === "generating";
  const Heading = variant === "compact" ? "h3" : "h2";
  useEffect(() => {
    const status = new AbortController();
    fetch("/api/ask", { signal: status.signal, cache: "no-store" }).then((res) => res.json()).then((data) => setConfigured(Boolean(data.configured))).catch(() => {});
    return () => { status.abort(); controller.current?.abort(); };
  }, []);
  useEffect(() => { setInput(initialQuestion); }, [initialQuestion]);

  function reset() {
    generation.current++;
    controller.current?.abort();
    setPhase("idle"); setInput(""); setQuestion(""); setSources([]); setTrace(null); setResult(null); setError("");
    inputRef.current?.focus();
  }
  function cancel() {
    generation.current++;
    controller.current?.abort();
    setPhase("cancelled"); setError(""); setResult(null);
  }
  async function submit() {
    const query = input.trim();
    if (!query || busy) return;
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    const run = ++generation.current;
    setQuestion(query); setSources([]); setResult(null); setTrace(null); setError(""); setPhase("retrieving");
    try {
      const answer = await askStream(query, variant === "modal" ? "widget" : "lab", {
        signal: ac.signal,
        pageContext,
        onMeta: (chunks, details) => {
          if (run !== generation.current || ac.signal.aborted) return;
          setSources(chunks); setTrace(details); setPhase("generating");
        },
      });
      if (run !== generation.current || ac.signal.aborted) return;
      setResult(answer); setPhase("done");
    } catch (e) {
      if (run !== generation.current || ac.signal.aborted) return;
      setError(e instanceof Error ? e.message : "The answer could not be completed.");
      setPhase("error");
    }
  }
  const status = phase === "retrieving" ? "Searching the public notes…" : phase === "generating" ? "Writing an answer with Groq…" : phase === "done" ? result?.unsupported ? "The notes do not establish an answer." : "Answer ready. Check its sources below." : phase === "cancelled" ? "Request stopped. You can ask again." : phase === "error" ? error : "";
  return <div className={`${styles.board} ${styles[variant]}`} aria-label="Ask Jayanth's work" data-lenis-prevent={variant === "modal" ? "" : undefined}>
    <Paperclip className={styles.paperclip} size={48} strokeWidth={1.3} aria-hidden="true" />
    {onClose && <button className={styles.close} onClick={onClose} aria-label="Close ask panel"><X size={20} /></button>}
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}>THE OPEN NOTEBOOK / ASK MY WORK</p><Heading>Ask a question.<br /><em>Follow the evidence.</em></Heading><p className={styles.intro}>What I build, how I work, and what I learned along the way. Start with a question; open the notes behind the answer.</p></div>
      <aside className={styles.sticky}><span>A small reminder</span><p>Good answers <br />leave a <br /><u>paper trail.</u></p></aside>
    </div>
    <ol className={styles.pipeline} aria-label="How this answer is made">
      {[{ icon: FileText, label: "My notes", note: "one public document", active: true }, { icon: ScanSearch, label: "Retrieve", note: "find relevant passages", active: !!trace }, { icon: Sparkles, label: "Groq", note: "write with evidence", active: phase === "generating" || !!result?.model }, { icon: Quote, label: "Your answer", note: "sources included", active: phase === "done" }].map((step, index) => <li key={step.label} data-active={step.active}><step.icon size={24} strokeWidth={1.4} aria-hidden="true" /><div><strong>{step.label}</strong><small>{step.note}</small></div>{index < 3 && <ArrowRight className={styles.connector} size={21} strokeWidth={1.2} aria-hidden="true" />}</li>)}
    </ol>
    <div className={styles.desk}>
      <div className={styles.questionPaper}>
        <form onSubmit={(event) => { event.preventDefault(); void submit(); }}>
          <div className={styles.formMeta}><label htmlFor={id}>01 / YOUR QUESTION</label><span>{input.length}/500</span></div>
          <textarea ref={inputRef} id={id} value={input} onChange={(event) => setInput(event.target.value)} placeholder="How do you turn a messy problem into a working system?" maxLength={500} rows={3} disabled={busy} />
          <div className={styles.actions}><button className={styles.primary} disabled={busy || !input.trim()} type="submit">{busy ? "Following the notes…" : "Ask the work"}<ArrowRight size={20} aria-hidden="true" /></button>
            {busy ? <button type="button" className={styles.textButton} onClick={cancel}>Stop</button> : <button type="button" className={styles.textButton} onClick={reset}><RotateCcw size={14} aria-hidden="true" /> Reset</button>}</div>
        </form>
        <p className={styles.tryLabel}>{pageDetails ? `READING WITH YOU / ${pageDetails.title}` : "A FEW THREADS TO PULL"}</p>
        <div className={styles.examples}>{examples.map((example) => <button key={example} disabled={busy} onClick={() => { setInput(example); inputRef.current?.focus(); }}>{example}<ArrowUpRight size={14} aria-hidden="true" /></button>)}</div>
        <p className={styles.privacy}>Questions and selected public passages are sent to Groq to generate a reply. Each question starts fresh.</p>
      </div>
      <aside className={styles.sourceNote}><FileText size={25} strokeWidth={1.3} aria-hidden="true" /><p className={styles.eyebrow}>THE SOURCE MATERIAL</p><h3>Jayanth, <br />in his working notes.</h3><p>Projects. Process. Decisions. The things that worked—and the parts still being built.</p><Link href="/about/source-notes" onClick={onClose}>Read the document <ArrowUpRight size={16} aria-hidden="true" /></Link><span className={styles.connection}>{configured === null ? "Checking live connection…" : configured ? "Groq configured / live generation" : "Live replies awaiting connection"}</span></aside>
    </div>
    <div className={styles.liveStatus} role={phase === "error" ? "alert" : "status"} aria-live="polite">{status}</div>
    {question && <div className={styles.response}>
      <div className={styles.answerPaper}>
        <div className={styles.answerTop}><p className={styles.eyebrow}>02 / THE ANSWER</p><span className={styles.stamp}>{phase === "done" ? result?.model ? "GROQ RESPONSE" : "NO MATCH" : phase === "error" ? "UNAVAILABLE" : phase === "cancelled" ? "STOPPED" : "IN PROGRESS"}</span></div>
        <p className={styles.asked}>{question}</p>
        {result ? <><p className={styles.answerText}>{result.answer}</p>{!!result.sourceIds?.length && <p className={styles.citedLabel}>Cited in this answer: {result.sourceIds.map((sourceId) => { const index = sources.findIndex((source) => source.id === sourceId); return <a key={sourceId} href={`#${id}-source-${sourceId}`}>[{index + 1}]</a>; })}</p>}</> : <p className={styles.waiting}>{busy ? "Finding the right words, with the notes open." : phase === "cancelled" ? "This request was stopped. No answer was saved." : "No generated answer is being shown. You can inspect the notes retrieved for this question."}</p>}
      </div>
      {!!sources.length && <div className={styles.sources}><div className={styles.sourceHeading}><h3>Open the source slips.</h3><span>{sources.length} passages retrieved</span></div>{sources.map((source, index) => <details key={source.id} id={`${id}-source-${source.id}`} className={styles.slip} open={result?.sourceIds?.includes(source.id) || undefined}>
        <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{source.title}</strong><small>{result?.sourceIds?.includes(source.id) ? "CITED" : "RETRIEVED"}</small></summary>
        <p>{source.content}</p><Link href={source.href || "/about/source-notes"} onClick={onClose}>See this passage in the document <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </details>)}</div>}
      {trace && <details className={styles.trace}><summary>Under the paper / inspect this request</summary><dl><div><dt>Document</dt><dd>Jayanth’s working notes · {trace.documentVersion}</dd></div><div><dt>Retrieval</dt><dd>Local text embeddings + keyword ranking · {trace.retrievalMs}ms</dd></div><div><dt>Generation</dt><dd>{result?.model ? `${result.model} via Groq · ${result.generationMs}ms` : phase === "done" ? "No model call: no relevant passage" : phase === "error" ? "Not completed" : phase === "cancelled" ? "Stopped" : "In progress"}</dd></div></dl><p>These are observed request timings. Retrieved passages are candidates; the answer’s cited passages are marked separately. Model answers can still be mistaken.</p></details>}
    </div>}
  </div>;
}
