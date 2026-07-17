"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { ContactForm } from "./ContactForm";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";

type Path = "hiring" | "project";

const LINKS = [
  {
    label: "EMAIL",
    href: "mailto:hello@jayanthkrishna.dev",
    display: "hello@jayanthkrishna.dev",
    external: false,
  },
  {
    label: "LINKEDIN",
    href: "https://linkedin.com",
    display: "linkedin.com/in/…",
    external: true,
  },
  {
    label: "GITHUB",
    href: "https://github.com",
    display: "github.com/…",
    external: true,
  },
] as const;

/**
 * Juba Contact — LETS TALK marquee, link rows with ↗, bottom-border form.
 */
export function ContactSection() {
  const [path, setPath] = useState<Path>("hiring");
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    registerGsap();
    const root = sectionRef.current;

    const ctx = gsap.context(() => {
      const blocks = root.querySelectorAll<HTMLElement>("[data-contact-block]");
      blocks.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="scroll-mt-20 border-b border-ink/8 bg-tint-sky py-[var(--section-gap-mobile)] md:py-[var(--section-gap-desktop)]"
      aria-labelledby="contact-heading"
    >
      <SectionHeader
        index="05"
        meta="OPEN TO ROLES"
        title="Let's talk"
        bgMarquee="LETS TALK"
        headingId="contact-heading"
      />

      <div className="section-pad mx-auto mt-10 max-w-[var(--content-max)] md:mt-14">
        <div data-contact-block>
          <p className="font-mono-data text-[11px] tracking-[0.16em] text-muted">
            OPEN TO INTERNSHIPS · FREELANCE · FULL-TIME
          </p>
          <p className="font-display mt-4 max-w-xl text-[clamp(1.75rem,3vw,2.5rem)] leading-[0.95] tracking-tight text-ink">
            Let&apos;s build something that ships.
          </p>
        </div>

        <ul
          data-contact-block
          className="mt-12 divide-y divide-ink/10 border-y border-ink/10"
        >
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="contact-link group flex flex-wrap items-baseline justify-between gap-2 py-5"
              >
                <span className="font-mono-data text-[10px] tracking-[0.16em] text-muted transition-colors group-hover:text-ink">
                  {link.label}
                </span>
                <span className="font-mono-data text-sm text-ink transition-transform duration-250 ease-out group-hover:translate-x-1 group-hover:text-accent-clay">
                  {link.display}
                  <span className="ml-1 inline-block transition-transform duration-250 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div data-contact-block className="mt-14 md:mt-16">
          <h3 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
            SEND A MESSAGE
          </h3>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPath("hiring")}
              className={cn(
                "font-mono-data border px-3 py-2 text-[10px] tracking-[0.14em] transition-colors",
                path === "hiring"
                  ? "border-ink bg-ink text-bg"
                  : "border-ink/15 text-ink hover:border-ink/40",
              )}
            >
              HIRING
            </button>
            <button
              type="button"
              onClick={() => setPath("project")}
              className={cn(
                "font-mono-data border px-3 py-2 text-[10px] tracking-[0.14em] transition-colors",
                path === "project"
                  ? "border-ink bg-ink text-bg"
                  : "border-ink/15 text-ink hover:border-ink/40",
              )}
            >
              PROJECT
            </button>
          </div>

          <div className="mt-10 max-w-xl">
            <ContactForm path={path} />
          </div>

          <p className="mt-8 font-mono-data text-[10px] tracking-[0.12em] text-muted">
            OR WRITE DIRECT TO HELLO@JAYANTHKRISHNA.DEV
          </p>
        </div>
      </div>
    </section>
  );
}
