import fs from "node:fs";
import path from "node:path";
import { localEmbed, cosineSimilarity } from "./embed";
import type { RetrievedChunk } from "./types";

export const KNOWLEDGE_VERSION = "2026-10-08";
export const KNOWLEDGE_DOWNLOAD = "/documents/jayanth-knowledge.md";
export const KNOWLEDGE_PAGE = "/about/source-notes";
export type KnowledgeSection = { id: string; title: string; content: string };

export function parseKnowledge(markdown: string): KnowledgeSection[] {
  return markdown.split(/^## /m).slice(1).map((section) => {
    const line = section.indexOf("\n");
    const title = section.slice(0, line).trim();
    return { id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), title, content: section.slice(line + 1).trim() };
  });
}

export function getKnowledge(): KnowledgeSection[] {
  return parseKnowledge(fs.readFileSync(path.join(process.cwd(), "public/documents/jayanth-knowledge.md"), "utf8"));
}

const stop = new Set("a an the and or for to of in on with is are was were be been it this that what which who how why when where do does did he she his her him jayanth krishna about me you your i can could would should tell explain please has have anything".split(" "));
export function queryTerms(text: string): string[] {
  return [...new Set(text.toLowerCase().replace(/company\s*brain/g, "companybrain").replace(/work\s*buddy/g, "workbuddy").replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter((word) => word.length > 1 && !stop.has(word)))];
}

/** Fixed local text embeddings plus keyword ranking; scores are not confidence. */
export function retrieveKnowledge(query: string, sections = getKnowledge(), k = 4): RetrievedChunk[] {
  let terms = queryTerms(query);
  if (!terms.length && /\b(who|about|introduce)\b/i.test(query)) terms = ["identity"];
  if (/\bwho (is|are)\b/i.test(query)) terms.push("identity");
  const aliases: Record<string, string[]> = {
    build: ["builds", "projects"], building: ["builds"], things: [],
    work: ["builds", "projects"], works: ["builds", "process"], approach: ["builds", "process"],
    workflow: ["process", "builds"], shipped: ["production"], clients: ["freelance"],
    experience: ["skills", "projects"], background: ["identity", "skills"],
    stack: ["tools"], technologies: ["tools"], skills: ["tools"],
  };
  const expanded = [...new Set(terms.flatMap((word) => [word, ...(aliases[word] ?? [])]))];
  const vector = localEmbed(expanded.join(" "));
  return sections.map((section) => {
    const title = new Set(queryTerms(section.title));
    const body = new Set(queryTerms(section.content));
    const hits = expanded.filter((word) => title.has(word) || body.has(word));
    if (!hits.length) return null;
    const score = hits.length / Math.max(expanded.length, 1)
      + hits.filter((word) => title.has(word)).length * .35
      + Math.max(0, cosineSimilarity(vector, localEmbed(section.title + " " + section.content))) * .25;
    return { ...section, score: Math.round(score * 1000) / 1000, href: KNOWLEDGE_PAGE + "#" + section.id };
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.score - a.score).slice(0, k);
}
