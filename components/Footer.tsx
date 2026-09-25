import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#lab", label: "Lab" },
  { href: "/notes", label: "Notes" },
  { href: "/colophon", label: "Colophon" },
  { href: "/#contact", label: "Contact" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return <footer className="border-t border-ink/10 bg-[#fffefb] px-6 py-12 md:px-[4%] md:py-16"><div className="mx-auto max-w-[1450px]">
    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start"><div><Link href="/" aria-label="Jayanth Krishna — home" className="inline-flex"><Image src="/logo-jk.png" alt="" width={46} height={38} className="h-[38px] w-auto object-contain object-left" /></Link><p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-muted">Practical systems. Inspectable decisions. Better questions.</p></div>
      <nav aria-label="Footer"><ul className="flex flex-wrap gap-x-6 gap-y-3">{links.map((link) => <li key={link.label}><Link className="inline-flex min-h-11 items-center font-mono-data text-xs underline-offset-4 hover:underline" href={link.href}>{link.label}</Link></li>)}</ul></nav></div>
    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6 font-mono-data text-[10px] tracking-[.12em] text-muted"><span>© {year} JAYANTH KRISHNA</span><Link href="/#top" className="min-h-11 content-center text-ink">BACK TO TOP ↑</Link></div>
  </div></footer>;
}
