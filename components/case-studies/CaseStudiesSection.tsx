"use client";

import { WorkStage } from "./WorkStage";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  studies: CaseStudy[];
};

/** Featured Work — pinned Juba stage (see WorkStage). */
export function CaseStudiesSection({ studies }: Props) {
  return <WorkStage studies={studies} />;
}
