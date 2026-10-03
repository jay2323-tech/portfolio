"use client";
import { useEffect, useReducer, useRef } from "react";
import { ArrowRight, Paperclip, RotateCcw } from "lucide-react";
import { approvalReducer, initialState, scenarios } from "@/lib/approval-simulation";
import styles from "./approval.module.css";
export function ApprovalExperiment() {
  const [{ scenario, receipt }, dispatch] = useReducer(approvalReducer, initialState);
  const receiptRef = useRef<HTMLElement>(null);
  useEffect(() => { if (receipt) receiptRef.current?.focus(); }, [receipt]);
  return <section className={styles.board} aria-label="WorkBuddy approval simulation">
    <Paperclip className={styles.clip} size={45} aria-hidden="true" />
    <div className={styles.top}><div><p className={styles.label}>WORKBUDDY / INTERACTIVE SIMULATION</p><h2>Your approval.<br />A visible consequence.</h2><p>Inspect a fictional change. Make the call. Read what actually happened.</p></div><aside className={styles.sticky}>A yes is permission.<br /><u>Not proof.</u></aside></div>
    <p className={styles.disclosure}>Runs entirely on sample data in your browser. No AI call, code execution, or repository changes.</p>
    <fieldset className={styles.scenarios}><legend>01 / Choose a situation</legend>{scenarios.map((item, i) => <label key={item.id} data-selected={item.id === scenario.id}><input type="radio" name="approval-scenario" checked={item.id === scenario.id} onChange={() => dispatch({type:"select",id:item.id})} /><span>0{i + 1}</span>{item.title}</label>)}</fieldset>
    <ol className={styles.pipeline} aria-label="Approval workflow"><li>Proposal</li><li><ArrowRight aria-hidden="true" />Your decision</li><li><ArrowRight aria-hidden="true" />Safety checks</li><li><ArrowRight aria-hidden="true" />Receipt</li></ol>
    <div className={styles.desk}>
      <article className={styles.proposal}><p className={styles.label}>02 / INSPECT THE PROPOSAL</p><h3>{scenario.title}</h3><p>{scenario.reason}</p><dl className={styles.facts}><div><dt>Target</dt><dd><code>{scenario.file}</code></dd></div><div><dt>Workspace</dt><dd>Fictional review worktree</dd></div><div><dt>Baseline check</dt><dd>{scenario.baseline}</dd></div></dl>
        <div className={styles.diff} aria-label="Proposed change"><p>Before</p><pre><code>{scenario.before}</code></pre><p>After</p><pre><code>{scenario.after}</code></pre></div>
        <p className={styles.note}>{scenario.note}</p>
        <div className={styles.actions}><button disabled={!!receipt} onClick={() => dispatch({type:"approve"})}>Approve simulation <ArrowRight size={16} aria-hidden="true" /></button><button disabled={!!receipt} onClick={() => dispatch({type:"reject"})}>Reject proposal</button></div>
      </article>
      <article ref={receiptRef} tabIndex={-1} className={styles.receipt} aria-label="Execution receipt"><p className={styles.label}>03 / THE RECEIPT</p><h3>Permission ≠ proof.</h3><div role="status" aria-live="polite" aria-atomic="true">{receipt ? <><p className={styles.stamp} data-outcome={receipt.verification === "failed" ? "failed" : receipt.outcome}>{receipt.outcome}</p><dl className={styles.results}><div><dt>Change applied</dt><dd>{receipt.outcome === "applied" ? "Yes · sample only" : "No"}</dd></div><div><dt>Verification</dt><dd>{receipt.verification === "not-run" ? "Not run" : receipt.verification === "passed" ? "Passed · fixture" : "Failed · fixture"}</dd></div><div><dt>Real files changed</dt><dd>None</dd></div></dl><p className={styles.resultText}>{receipt.check}</p><p className={styles.boundary}>{receipt.verification === "passed" ? "This fixture passes. It says nothing about production reliability." : receipt.outcome === "applied" ? "The change was applied in the simulation, but the expected behavior failed. Investigate before merging." : "The workflow stops here. No applied change means no verification result."}</p></> : <p className={styles.waiting}>Your decision leaves a paper trail.<br />Approve or reject to print the receipt.</p>}</div>
        <button className={styles.reset} onClick={() => dispatch({type:"reset"})}><RotateCcw size={15} aria-hidden="true" />Reset this situation</button>
      </article>
    </div>
    <details className={styles.explain}><summary>Under the paper / what this teaches</summary><p>Approval grants permission for a specific proposal. Execution checks can still refuse it. An applied change needs separate verification; even a passing fixture proves only what that fixture covers.</p><p>This is a designed simulation of those boundaries. The WorkBuddy case study describes its actual implementation and current verification limits.</p></details>
  </section>;
}
