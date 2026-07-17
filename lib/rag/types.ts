export type CorpusSource =
  | "resume"
  | "case-study"
  | "architecture"
  | "build-log";

export type CorpusChunk = {
  id: string;
  source: CorpusSource;
  title: string;
  content: string;
  href?: string;
  embedding?: number[];
};

export type RetrievedChunk = {
  id: string;
  title: string;
  score: number;
  href?: string;
  content?: string;
};
