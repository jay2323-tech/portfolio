/**
 * Build-time embedding script.
 * Prefer OPENAI_API_KEY (text-embedding-3-small). Falls back to local hash embedder.
 *
 * Usage: npm run embed-corpus
 */
import fs from "fs";
import path from "path";
import { localEmbed, embedQuery } from "../lib/rag/embed";
import type { CorpusChunk } from "../lib/rag/types";

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "content/corpus/corpus.json");
const OUTPUT = path.join(ROOT, "content/corpus/corpus-embeddings.json");

async function main() {
  const raw = JSON.parse(fs.readFileSync(INPUT, "utf8")) as CorpusChunk[];
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

  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
