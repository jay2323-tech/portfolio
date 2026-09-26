import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyDetail } from "@/components/case-studies/CaseStudyDetail";
import { Footer } from "@/components/Footer";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";
import { getCatalog, relatedLinks } from "@/lib/content/catalog";

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
  const catalog = await getCatalog();
  const study = catalog.projects.find((entry) => entry.slug === slug);
  if (!study) notFound();
  const index = catalog.projects.findIndex((entry) => entry.slug === slug);
  const nextStudy = catalog.projects.length > 1 ? catalog.projects[(index + 1) % catalog.projects.length] : null;
  const related = relatedLinks(catalog, { notes: study.relatedNoteSlugs, experiments: study.relatedExperimentSlugs });

  return (
    <>
      <CaseStudyDetail key={study.slug} study={study} nextStudy={nextStudy} related={related} />
      <Footer />
    </>
  );
}
