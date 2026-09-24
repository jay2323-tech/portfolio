import type { Metadata } from "next";
import { EditorialPage, MarkdownBody } from "@/components/editorial/EditorialPage";

export const metadata: Metadata = { title: "Colophon — Jayanth Krishna", description: "The materials and decisions behind this portfolio." };
export default function ColophonPage() {
  return <EditorialPage eyebrow="Colophon / Behind this page" title="How this place is made." intro="A portfolio should be inspectable, too. These are the materials behind the workbench.">
    <MarkdownBody>{`## Paper, ink, and a little clay

The Light Lab direction uses a warm paper background, strong editorial typography, clay accents, and occasional sky and mint surfaces. The work comes first; the collage gives it a little personality.

## The stack

Next.js and React handle the pages. TypeScript keeps content shapes explicit. Keystatic edits YAML files in the repository, so projects, notes, and experiment metadata share one source. Tailwind and CSS supply the layout; Framer Motion and GSAP support the existing animated surfaces.

## Content with boundaries

Project status is stated alongside the work. Technical stack labels are system facts, not measured outcomes. Experiments are labelled live, simulated, or recorded, and stay unpublished while they are being built. Notes are short entries from the build log.

## A workbench in progress

The redesign is being implemented in phases. The Field Notes homepage now introduces three projects through a reversible paper deck. Next come the remaining homepage sections, deeper case studies, and runnable experiments. You can [read the notes](/notes) or [inspect a project](/work/company-brain) while it takes shape.`}</MarkdownBody>
  </EditorialPage>;
}
