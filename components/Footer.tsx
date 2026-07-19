import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 px-4 pb-28 pt-8 md:px-6 md:pb-32 md:pt-10">
      <div className="flex w-full items-center justify-between gap-6">
        <Link
          href="/"
          data-cursor="view"
          className="shrink-0"
          aria-label="Jayanth Krishna — home"
        >
          <Image
            src="/logo-jk.png"
            alt=""
            width={46}
            height={38}
            className="h-[38px] w-auto object-contain object-left"
          />
        </Link>

        <p className="font-mono-data text-right text-[10px] leading-relaxed tracking-[0.14em] text-ink sm:text-[11px]">
          <span className="block">© {year} JAYANTH KRISHNA.</span>
          <span className="block">ALL RIGHTS RESERVED.</span>
        </p>
      </div>
    </footer>
  );
}
