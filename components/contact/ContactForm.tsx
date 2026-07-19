"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/chrome/Magnetic";
import { ConfettiBurst } from "./ConfettiBurst";

type Path = "hiring" | "project";

type Props = {
  path: Path;
};

/**
 * Contact form — Juba-style dotted underlines + submit morph.
 */
export function ContactForm({ path }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (status !== "ok" || reduce || !btnRef.current) return;
    const el = btnRef.current;
    el.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.06)" },
        { transform: "scale(1)" },
      ],
      { duration: 420, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    );
  }, [status, reduce]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          name,
          email,
          company: company || undefined,
          message,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
      };
      if (!res.ok) {
        setStatus("err");
        setError(data.error ?? "Could not send. Try email instead.");
        return;
      }
      setStatus("ok");
      setShowConfetti(true);
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch {
      setStatus("err");
      setError("Network error. Email cvjayanth005@gmail.com directly.");
    }
  }

  if (status === "ok") {
    return (
      <div className="relative overflow-hidden border border-ink/15 p-6">
        {showConfetti && !reduce && (
          <ConfettiBurst onDone={() => setShowConfetti(false)} />
        )}
        <p className="font-mono-data text-[10px] tracking-[0.16em] text-ok-signal">
          ✓ SENT
        </p>
        <p className="mt-3 text-ink">
          Got it — I&apos;ll reply within 48 hours.
        </p>
        <button
          type="button"
          className="mt-4 font-mono-data text-[10px] tracking-[0.14em] text-muted underline-offset-4 hover:text-ink hover:underline"
          onClick={() => setStatus("idle")}
        >
          SEND ANOTHER
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-10">
      <p className="font-mono-data text-[10px] tracking-[0.14em] text-muted">
        {path === "hiring"
          ? "INCLUDE COMPANY, ROLE, AND TIMELINE."
          : "INCLUDE BUDGET, TIMELINE, AND THE PROBLEM."}
      </p>

      <label className="contact-dot-field">
        <span className="contact-dot-label">NAME</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="contact-dot-input"
        />
      </label>

      <label className="contact-dot-field">
        <span className="contact-dot-label">EMAIL</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="contact-dot-input"
        />
      </label>

      <label className="contact-dot-field">
        <span className="contact-dot-label">
          {path === "hiring" ? "COMPANY / ROLE" : "COMPANY"}
        </span>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="contact-dot-input"
        />
      </label>

      <label className="contact-dot-field contact-dot-message">
        <span className="contact-dot-label">MESSAGE</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="contact-dot-input"
        />
      </label>

      {error && (
        <p className="font-mono-data text-[11px] text-accent-clay">{error}</p>
      )}

      <Magnetic strength={10}>
        <button
          ref={btnRef}
          type="submit"
          disabled={status === "sending"}
          data-cursor="open"
          className={cn(
            "contact-submit inline-flex items-center justify-center overflow-hidden",
            "font-mono-data text-[11px] tracking-[0.16em] text-bg",
            "rounded-[var(--radius-btn)] bg-ink transition-[width,background-color] duration-400 ease-out",
            status === "sending" ? "h-10 w-10" : "h-10 min-w-[7.5rem] px-5",
            status === "sending" && "opacity-90",
          )}
        >
          {status === "sending" ? (
            <span
              className="contact-submit-spinner block h-4 w-4 rounded-full border-2 border-bg/30 border-t-bg"
              aria-hidden
            />
          ) : (
            "SEND ↗"
          )}
          <span className="sr-only">
            {status === "sending" ? "Sending" : "Send message"}
          </span>
        </button>
      </Magnetic>
    </form>
  );
}
