import type { RetrievedChunk } from "./types";

export function buildSystemPrompt(): string {
  return `You are answering questions about Jayanth Krishna's work for visitors on his portfolio site.

Rules:
- Only answer using the provided retrieved context about Jayanth's projects, process, and skills.
- If the question is off-topic (general knowledge, coding homework, unrelated chat), politely refuse and suggest asking about his case studies (CompanyBrain, Factory Attendance, DesiFit) or process.
- Be concise, concrete, and engineer-honest. Prefer specifics over adjectives.
- Cite sources by chunk title in parentheses when you use them, e.g. (CompanyBrain — architecture).
- Speak in third person about Jayanth ("he built…") unless the visitor clearly addresses him; then second person is fine.
- Do not invent metrics, employers, or links that are not in the context.`;
}

export function buildUserPrompt(
  query: string,
  chunks: RetrievedChunk[],
): string {
  const context = chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.title} (score=${c.score})\n${c.content ?? ""}`,
    )
    .join("\n\n");

  return `Retrieved context:\n${context}\n\nVisitor question: ${query}\n\nAnswer:`;
}

/** Offline / no-LLM fallback: stitch top chunks into a short cited answer. */
export function extractiveAnswer(
  query: string,
  chunks: RetrievedChunk[],
): string {
  if (chunks.length === 0) {
    return "I don't have enough of Jayanth's work indexed for that yet. Try asking about CompanyBrain, Factory Attendance, DesiFit, or how he works with clients.";
  }

  const top = chunks.slice(0, 3);
  const lead = top[0];
  const lines = [
    `Based on Jayanth's portfolio corpus, here's what matches “${query.trim()}”:`,
    "",
    lead.content,
    "",
    `Sources: ${top.map((c) => `${c.title} (${c.score})`).join("; ")}.`,
  ];
  return lines.join("\n");
}
