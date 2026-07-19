import { Magnetic } from "@/components/chrome/Magnetic";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-pad border-t border-ink/10 pb-14 pt-8 md:pb-16">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono-data text-[11px] tracking-[0.14em] text-muted">
          © {year} JAYANTH KRISHNA
        </p>
        <Magnetic strength={14}>
          <a
            href="#top"
            className="font-mono-data text-[11px] tracking-[0.14em] text-ink transition-colors hover:text-accent-clay"
          >
            BACK TO TOP ↑
          </a>
        </Magnetic>
      </div>
    </footer>
  );
}
