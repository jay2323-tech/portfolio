import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyDetail } from "@/components/case-studies/CaseStudyDetail";
import { Footer } from "@/components/Footer";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Work" };
  return {
    title: `${study.title} — Jayanth Krishna`,
    description: study.problem,
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <CaseStudyDetail study={study} />
      <Footer />
    </>
  );
}
