import fs from "fs";
import path from "path";
import { cosineSimilarity, embedQuery } from "./embed";
import type { CorpusChunk, RetrievedChunk } from "./types";

let cached: CorpusChunk[] | null = null;

function loadCorpus(): CorpusChunk[] {
  if (cached) return cached;
  const filePath = path.join(
    process.cwd(),
    "content/corpus/corpus-embeddings.json",
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(
      "corpus-embeddings.json missing — run `npm run embed-corpus`",
    );
  }
  cached = JSON.parse(fs.readFileSync(filePath, "utf8")) as CorpusChunk[];
  return cached;
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s+#.-]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2),
  );
}

/** Overlap of query tokens with title+content — boosts exact project names. */
function lexicalScore(query: string, chunk: CorpusChunk): number {
  const q = tokenize(query);
  if (q.size === 0) return 0;
  const title = tokenize(chunk.title);
  const body = tokenize(`${chunk.title} ${chunk.content}`);
  let hit = 0;
  let titleHit = 0;
  for (const t of q) {
    if (body.has(t)) hit += 1;
    if (title.has(t)) titleHit += 1;
  }
  return hit / q.size + titleHit * 0.35;
}

export async function retrieve(
  query: string,
  k = 4,
): Promise<RetrievedChunk[]> {
  const corpus = loadCorpus();
  const qVec = await embedQuery(query);

  const scored = corpus
    .map((chunk) => {
      const emb = chunk.embedding;
      if (!emb?.length) return null;
      const dense = cosineSimilarity(qVec, emb);
      const lex = lexicalScore(query, chunk);
      // Hybrid: lexical dominates for named entities; dense helps paraphrase
      const score = dense * 0.45 + lex * 0.55;
      return {
        id: chunk.id,
        title: chunk.title,
        score,
        href: chunk.href,
        content: chunk.content,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored.map(({ id, title, score, href, content }) => ({
    id,
    title,
    score: Math.round(score * 1000) / 1000,
    href,
    content,
  }));
}
