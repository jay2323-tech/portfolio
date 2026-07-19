/**
 * Build-time embedding script.
 * Reads Keystatic corpus chunks, writes corpus.json + corpus-embeddings.json.
 * Prefer OPENAI_API_KEY (text-embedding-3-small). Falls back to local hash embedder.
 *
 * Usage: npm run embed-corpus
 * Run after editing RAG corpus in /keystatic.
 */
import fs from "fs";
import path from "path";
import { createReader } from "@keystatic/core/reader";
import rawConfig from "../keystatic.config";
import { localEmbed, embedQuery } from "../lib/rag/embed";
import type { CorpusChunk } from "../lib/rag/types";

const keystaticConfig =
  (rawConfig as { default?: typeof rawConfig }).default ?? rawConfig;

const ROOT = process.cwd();
const OUTPUT_CORPUS = path.join(ROOT, "content/corpus/corpus.json");
const OUTPUT_EMBEDDINGS = path.join(ROOT, "content/corpus/corpus-embeddings.json");

async function loadChunks(): Promise<CorpusChunk[]> {
  const reader = createReader(ROOT, keystaticConfig);
  const slugs = await reader.collections.corpus.list();
  const chunks: CorpusChunk[] = [];
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

async function main() {
  const raw = await loadChunks();
  fs.writeFileSync(OUTPUT_CORPUS, JSON.stringify(raw, null, 2));
  console.log(`Synced ${raw.length} chunks → ${OUTPUT_CORPUS}`);

  const useOpenAI = Boolean(process.env.OPENAI_API_KEY);
  console.log(
    `Embedding ${raw.length} chunks via ${useOpenAI ? "OpenAI text-embedding-3-small" : "local hash embedder"}…`,
  );

  const out: CorpusChunk[] = [];
  for (const chunk of raw) {
    const text = `${chunk.title}\n${chunk.content}`;
    const embedding = useOpenAI
      ? await embedQuery(text)
      : localEmbed(text);
    out.push({ ...chunk, embedding });
    console.log(`  ✓ ${chunk.id} (${embedding.length}d)`);
  }

  fs.writeFileSync(OUTPUT_EMBEDDINGS, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUTPUT_EMBEDDINGS}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
