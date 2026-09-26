import styles from "./case-study.module.css";

/** Authored teaching exhibits: no data is submitted and no backend execution is simulated. */
export function ProjectExhibit({ slug }: { slug: string }) {
  if (slug === "company-brain") {
    return (
      <figure className={styles.exhibit}>
        <figcaption>ILLUSTRATIVE FIXTURE / CITATION MISMATCH</figcaption>
        <p className={styles.exhibitQuestion}>“Who owns the incident playbook?”</p>
        <div className={styles.answer}>
          <span>ANSWER UNDER INSPECTION</span>
          <p>The Platform team owns the incident playbook. <mark>[B]</mark></p>
        </div>
        <details className={styles.inspection} open>
          <summary>Inspect the cited passage <span aria-hidden="true">+</span></summary>
          <div className={styles.passages}>
            <div><span>PASSAGE A / SUPPORTS THE ANSWER</span><p>“The incident playbook is maintained by the Platform team.”</p></div>
            <div><span>PASSAGE B / CITED BY THE ANSWER</span><p>“Operations manages office access and visitor badges.”</p></div>
          </div>
          <p>The sentence sounds plausible, but B does not support it. Exposing the passage and its identifier makes the mismatch inspectable.</p>
        </details>
        <p className={styles.caption}>Authored sample passages illustrate the failure described below. They are not customer documents or output from a live model.</p>
      </figure>
    );
  }
  if (slug === "factory-attendance") {
    return (
      <figure className={styles.exhibit}>
        <figcaption>SYNTHETIC ARRIVAL / EXCEPTION WALKTHROUGH</figcaption>
        <p className={styles.exhibitQuestion}>A difficult capture reaches the entrance.</p>
        <ol className={styles.eventList}>
          <li><span>01</span><div><strong>Capture needs another attempt</strong><p>Lighting or angle prevents a clean match.</p></div><b>RETRY</b></li>
          <li><span>02</span><div><strong>The result is still ambiguous</strong><p>Keep the punch in an exception queue for a person to resolve.</p></div><b>REVIEW</b></li>
          <li><span>03</span><div><strong>Resolution reaches the report</strong><p>A verified punch can enter the attendance record used by operations.</p></div><b>RECORD</b></li>
        </ol>
        <details className={styles.inspection}>
          <summary>Why the exception path matters <span aria-hidden="true">+</span></summary>
          <p>An uncertain match must remain visible to the operator. Retry guidance and supervisor resolution keep the capture problem from silently becoming a payroll decision.</p>
        </details>
        <p className={styles.caption}>An authored example of the documented workflow. No employee records, recognition scores, or production measurements are shown.</p>
      </figure>
    );
  }
  if (slug === "workbuddy") {
    return (
      <figure className={styles.exhibit}>
        <figcaption>ANNOTATED RECEIPT / ILLUSTRATIVE APPLIED OUTCOME</figcaption>
        <p className={styles.exhibitQuestion}>The files changed. What does that prove?</p>
        <dl className={styles.receipt}>
          <div><dt>Application</dt><dd>Applied</dd></div>
          <div><dt>Destination</dt><dd>Isolated review worktree</dd></div>
          <div><dt>Automatic merge</dt><dd>No</dd></div>
          <div><dt>Verified</dt><dd><mark>false</mark></dd></div>
        </dl>
        <details className={styles.inspection}>
          <summary>Inspect the approval boundary <span aria-hidden="true">+</span></summary>
          <p>Approval binds the proposal hash, canonical project root, target paths, branch, and base commit. The executor checks the baseline around application and retains the review worktree for inspection.</p>
        </details>
        <p className={styles.caption}>A human-readable illustration of documented receipt semantics, not a captured run. The integrated test-verification gate is still outstanding.</p>
      </figure>
    );
  }
  return null;
}
