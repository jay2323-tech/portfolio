export type ArchNode = {
  id: string;
  label: string;
  /** Short role + why chosen — tooltip */
  blurb: string;
  href: string;
  /** SVG center position */
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ArchEdge = {
  id: string;
  from: string;
  to: string;
};

export const COMPANY_BRAIN_NODES: ArchNode[] = [
  {
    id: "org",
    label: "Org / Team / User",
    blurb:
      "Tenant and identity context — every query is scoped to the org graph before retrieval starts.",
    href: "/work/company-brain#company-brain-context",
    x: 120,
    y: 210,
    w: 160,
    h: 52,
  },
  {
    id: "api",
    label: "FastAPI",
    blurb:
      "Orchestration layer: auth, routing, and SSE streaming. Chose FastAPI for typed contracts and low-latency async I/O.",
    href: "/work/company-brain#company-brain-architecture",
    x: 340,
    y: 210,
    w: 120,
    h: 52,
  },
  {
    id: "rag",
    label: "Hybrid + Graph RAG",
    blurb:
      "Dense + sparse search fused with graph hops so “who owns X?” answers aren’t nearest-neighbor prose.",
    href: "/work/company-brain#company-brain-architecture",
    x: 560,
    y: 120,
    w: 180,
    h: 52,
  },
  {
    id: "qdrant",
    label: "Qdrant",
    blurb:
      "Vector store for embeddings at doc scale — predictable latency without a managed mega-stack.",
    href: "/work/company-brain#company-brain-decisions",
    x: 520,
    y: 280,
    w: 120,
    h: 52,
  },
  {
    id: "llm",
    label: "LLM providers",
    blurb:
      "Generation with retrieved chunks in-context. Provider-agnostic so cost and quality can be swapped without rewriting the pipeline.",
    href: "/work/company-brain#company-brain-architecture",
    x: 720,
    y: 210,
    w: 140,
    h: 52,
  },
];

export const COMPANY_BRAIN_EDGES: ArchEdge[] = [
  { id: "e1", from: "org", to: "api" },
  { id: "e2", from: "api", to: "rag" },
  { id: "e3", from: "rag", to: "qdrant" },
  { id: "e4", from: "rag", to: "llm" },
];
