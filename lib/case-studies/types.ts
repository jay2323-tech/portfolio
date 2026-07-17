export type CaseStudyStatus = "live" | "development";

export type CaseStudyMetric = {
  label: string;
  value: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  /** One-line problem for cards */
  problem: string;
  status: CaseStudyStatus;
  statusLabel: string;
  metrics: CaseStudyMetric[];
  tags: string[];
  /** Detail page */
  eyebrow: string;
  headline: string;
  who: string;
  constraints: string[];
  architectureSummary: string;
  decisions: { title: string; body: string }[];
  whatBroke: string;
  links: { label: string; href: string; external?: boolean }[];
  /** Anchor id for RAG source deep-links later */
  sectionIds: {
    context: string;
    architecture: string;
    decisions: string;
    whatBroke: string;
    metrics: string;
  };
};
