"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Path = "hiring" | "project";

type Props = {
  path: Path;
};

/** Editorial-style contact form: NAME / EMAIL / MESSAGE rows */
export function ContactForm({ path }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

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
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch {
      setStatus("err");
      setError("Network error. Email hello@jayanthkrishna.dev directly.");
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-ink/10 bg-surface p-6">
        <p className="font-mono-data text-[10px] tracking-[0.16em] text-ok-signal">
          SENT
        </p>
        <p className="mt-3 text-ink">
          Got it — I&apos;ll reply within 48 hours.
        </p>
      </div>
    );
  }

  const field =
    "mt-1 w-full border-0 border-b border-ink/20 bg-transparent px-0 py-2 text-ink placeholder:text-muted focus:border-accent-clay focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <p className="font-mono-data text-[10px] tracking-[0.14em] text-muted">
        {path === "hiring"
          ? "INCLUDE COMPANY, ROLE, AND TIMELINE."
          : "INCLUDE BUDGET, TIMELINE, AND THE PROBLEM."}
      </p>
      <label className="block">
        <span className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
          NAME
        </span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
        />
      </label>
      <label className="block">
        <span className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
          EMAIL
        </span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
      </label>
      <label className="block">
        <span className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
          {path === "hiring" ? "COMPANY / ROLE" : "COMPANY"}
        </span>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={field}
        />
      </label>
      <label className="block">
        <span className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
          MESSAGE
        </span>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(field, "resize-y")}
        />
      </label>
      {error && (
        <p className="font-mono-data text-[11px] text-accent-clay">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "font-mono-data text-[11px] tracking-[0.16em] text-ink underline-offset-4 hover:text-accent-clay hover:underline",
          status === "sending" && "opacity-60",
        )}
      >
        {status === "sending" ? "SENDING…" : "SEND ↗"}
      </button>
    </form>
  );
}
