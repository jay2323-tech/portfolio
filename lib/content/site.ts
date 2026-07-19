import { getReader } from "@/lib/content/reader";
import type {
  SiteAbout,
  SiteContact,
  SiteHero,
  SiteLab,
  SiteSettings,
} from "@/lib/content/reader";

export type ArticleEntry = {
  slug: string;
  date: string;
  tag?: string;
  body: string;
  label: string;
};

export type CorpusEntry = {
  id: string;
  source: "resume" | "case-study" | "architecture" | "build-log";
  title: string;
  content: string;
  href?: string;
};

export async function getHero(): Promise<SiteHero | null> {
  return getReader().singletons.hero.read();
}

export async function getAbout(): Promise<SiteAbout | null> {
  return getReader().singletons.about.read();
}

export async function getLab(): Promise<SiteLab | null> {
  return getReader().singletons.lab.read();
}

export async function getContact(): Promise<SiteContact | null> {
  return getReader().singletons.contact.read();
}

export async function getSettings(): Promise<SiteSettings | null> {
  return getReader().singletons.settings.read();
}

export async function getArticles(): Promise<ArticleEntry[]> {
  const reader = getReader();
  const slugs = await reader.collections.articles.list();
  const entries: ArticleEntry[] = [];
  for (const slug of slugs) {
    const data = await reader.collections.articles.read(slug);
    if (!data) continue;
    entries.push({
      slug,
      label: data.title,
      date: data.date,
      tag: data.tag || undefined,
      body: data.body,
    });
  }
  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getCorpusChunks(): Promise<CorpusEntry[]> {
  const reader = getReader();
  const slugs = await reader.collections.corpus.list();
  const chunks: CorpusEntry[] = [];
  for (const slug of slugs) {
    const data = await reader.collections.corpus.read(slug);
    if (!data) continue;
    chunks.push({
      id: slug,
      source: data.source,
      title: data.title,
      content: data.content,
      href: data.href || undefined,
    });
  }
  return chunks;
}

export function portraitSrc(settings: SiteSettings | null): string {
  const raw = settings?.portrait;
  if (!raw) return "/portrait.jpg";
  if (raw.startsWith("http") || raw.startsWith("/")) return raw;
  return `/${raw}`;
}
