"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import styles from "@/components/home/home.module.css";

type Props = { links: { label: string; href: string; display: string; external: boolean }[] };

export function ContactSection({ links }: Props) {
  const root = useRef<HTMLElement>(null);
  const [path, setPath] = useState<"hiring" | "project">("hiring");
  const email = links.find((link) => link.href.startsWith("mailto:"));
  useScrollReveal(root, "[data-contact-intro], [data-contact-form]", { y: 20 });

  return <section ref={root} id="contact" className="scroll-mt-20 border-t border-ink/10 bg-tint-sky px-6 py-20 md:px-[4%] md:py-32" aria-labelledby="contact-heading">
    <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.8fr)] lg:gap-[8%]">
      <div data-contact-intro><p className={styles.eyebrow}>06 / YOUR TURN</p><h2 id="contact-heading" className={styles.sectionTitle}>Have a problem worth building?</h2>
        <p className={styles.sectionIntro}>Tell me where the system is stuck, what success would look like, and who needs to use it. I’m open to roles and focused projects.</p>
        <div className="mt-8 flex flex-wrap gap-3"><span className="rounded-full border border-ink/20 px-4 py-2 font-mono-data text-[11px]">HIRING</span><span className="rounded-full border border-ink/20 px-4 py-2 font-mono-data text-[11px]">FREELANCE</span><span className="rounded-full border border-ink/20 px-4 py-2 font-mono-data text-[11px]">BENGALURU / OPEN GLOBAL</span></div>
        {email && <a className={`${styles.textLink} mt-9`} href={email.href}>Say hello directly: {email.display} <ArrowUpRight size={17} aria-hidden="true" /></a>}
      </div>
      <div data-contact-form className="border border-ink/15 bg-white/70 p-6 shadow-[0_12px_25px_#29241b0c] md:p-9">
        <p className={styles.eyebrow}>WRITE A NOTE / 01—02</p>
        <div role="group" aria-label="Message type" className="mt-5 mb-9 flex gap-3">
          {(["hiring", "project"] as const).map((value) => <button key={value} type="button" onClick={() => setPath(value)} aria-pressed={path === value}
            className={`min-h-11 rounded-full border px-5 font-mono-data text-[11px] uppercase transition-colors ${path === value ? "border-ink bg-ink text-bg" : "border-ink/25 hover:border-ink"}`}>{value}</button>)}
        </div>
        <ContactForm path={path} />
        {email && <p className="mt-8 text-sm text-muted">Prefer email? <a className="text-ink underline underline-offset-4" href={email.href}>{email.display}</a></p>}
      </div>
    </div>
  </section>;
}
