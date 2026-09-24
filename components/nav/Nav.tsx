"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAsk } from "@/components/ask-my-work/AskContext";
import { Magnetic } from "@/components/chrome/Magnetic";
import { scrambleText } from "@/lib/motion/scramble";
import { staggerContainer, slideInRight } from "@/lib/motion/variants";
import { editorialTransition } from "@/lib/motion/easing";

/** Two-line playful labels — main word + a chatty subtitle underneath. */
const links = [
  { href: "#work", label: "Work", sub: "Projects" },
  { href: "#lab", label: "Lab", sub: "Experiments" },
  { href: "/notes", label: "Notes", sub: "Writing" },
  { href: "#about", label: "About", sub: "Me stuff" },
  { href: "#contact", label: "Contact", sub: "Say hi" },
] as const;

type NavLinkProps = {
  href: string;
  label: string;
  sub: string;
};

/** Desktop link — main word decodes from scrambled glyphs on hover. */
function NavLink({ href, label, sub }: NavLinkProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => () => cancelRef.current?.(), []);

  function onEnter() {
    if (reduce || !labelRef.current) return;
    cancelRef.current?.();
    cancelRef.current = scrambleText({
      text: label,
      charDuration: 24,
      cycles: 2,
      onUpdate: (display) => {
        if (labelRef.current) labelRef.current.textContent = display;
      },
    });
  }

  function onLeave() {
    cancelRef.current?.();
    if (labelRef.current) labelRef.current.textContent = label;
  }

  return (
    <Link
      href={href}
      aria-label={`${label} — ${sub}`}
      data-cursor="view"
      className="nav-link group/nav flex flex-col items-center leading-none"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span
        ref={labelRef}
        className="font-display text-[15px] font-medium tracking-tight text-ink"
      >
        {label}
      </span>
      <span className="font-mono-data mt-1 text-[9px] tracking-[0.14em] text-muted transition-colors group-hover/nav:text-mint-deep">
        {sub}
      </span>
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const sectionHref = (href: string) => !href.startsWith("#") || pathname === "/" ? href : `/${href}`;
  const [open, setOpen] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { openAsk } = useAsk();

  useEffect(() => {
    function onScroll() {
      setCompressed(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onBreakpoint);
    return () => desktop.removeEventListener("change", onBreakpoint);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(
        document.querySelectorAll<HTMLElement>(
          "#mobile-nav a, #mobile-nav button",
        ),
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[var(--z-nav)] w-full border-b border-ink/10 transition-all duration-300",
          compressed ? "bg-bg/92 backdrop-blur-xl" : "bg-bg/80 backdrop-blur-md",
        )}
      >
        <nav
          className="relative flex h-[72px] w-full items-center px-5 md:px-[3.3%]"
          aria-label="Primary"
        >
          <Link
            href="/"
            data-cursor="view"
            className="relative z-10 flex shrink-0 items-center gap-2"
            onClick={() => setOpen(false)}
            aria-label="Jayanth Krishna — home"
          >
            <Image
              src="/logo-jk.png"
              alt=""
              width={46}
              height={38}
              priority
              className="h-[38px] w-auto object-contain object-left"
            />
            <span className="font-mono-data hidden text-[11px] tracking-[0.02em] text-ink sm:block">
              Jayanth Krishna / AI engineer / Bengaluru
            </span>
          </Link>

          <ul className="pointer-events-none absolute inset-0 hidden items-center justify-center gap-7 xl:flex">
            {links.map((link) => (
              <li key={link.href} className="pointer-events-auto">
                <NavLink href={sectionHref(link.href)} label={link.label} sub={link.sub} />
              </li>
            ))}
          </ul>

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Magnetic strength={10} className="hidden sm:inline-flex">
              <Link
                href={sectionHref("#contact")}
                data-cursor="open"
                className="nav-link font-mono-data text-[10px] tracking-[0.14em] text-ink"
              >
                GET IN TOUCH
              </Link>
            </Magnetic>
            <Magnetic strength={12}>
              <button
                type="button"
                data-cursor="ask"
                onClick={() => openAsk()}
                className="btn-pill btn-pill-primary motion-press text-[10px] tracking-wide"
              >
                ASK
              </button>
            </Magnetic>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-3 font-mono-data text-[10px] tracking-wider text-ink xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              MENU
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="fixed inset-0 z-[var(--z-modal)] flex flex-col bg-bg/97 backdrop-blur-xl xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="section-pad flex h-16 items-center justify-between border-b border-ink/10">
              <span className="font-mono-data text-[11px] tracking-[0.14em] text-ink">
                MENU
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                className="min-h-11 px-3 font-mono-data text-xs tracking-wider text-muted"
                onClick={() => setOpen(false)}
              >
                CLOSE ✕
              </button>
            </div>
            <motion.ul
              variants={reduce ? undefined : staggerContainer(0.06, 0.1)}
              initial={reduce ? false : "hidden"}
              animate={reduce ? undefined : "visible"}
              exit={reduce ? undefined : "hidden"}
              className="section-pad flex flex-1 flex-col justify-center gap-1 py-10"
            >
              {links.map((link) => (
                <motion.li key={link.href} variants={reduce ? undefined : slideInRight}>
                  <Link
                    href={sectionHref(link.href)}
                    className="flex items-baseline gap-4 py-3 font-display text-[clamp(2rem,10vw,2.5rem)] tracking-tight text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <span className="font-mono-data text-sm text-muted">
                      {link.sub}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { ...editorialTransition, delay: 0.3 }}
              className="section-pad flex flex-col gap-3 border-t border-ink/10 py-6"
            >
              <Link
                href={sectionHref("#contact")}
                className="btn-pill btn-pill-outline w-full text-center"
                onClick={() => setOpen(false)}
              >
                GET IN TOUCH
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAsk();
                }}
                className="btn-pill btn-pill-primary w-full"
              >
                ASK MY WORK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
