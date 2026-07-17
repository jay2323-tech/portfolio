import { Hero } from "@/components/hero/Hero";
import { LogoMarquee } from "@/components/chrome/LogoMarquee";
import { CaseStudiesSection } from "@/components/case-studies/CaseStudiesSection";
import { ArticlesSection } from "@/components/articles/ArticlesSection";
import { LabSection } from "@/components/lab/LabSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/Footer";
import { getAllCaseStudies } from "@/lib/case-studies";

export default function HomePage() {
  const studies = getAllCaseStudies();

  return (
    <>
      <Hero />
      <LogoMarquee />
      <CaseStudiesSection studies={studies} />
      <ArticlesSection />
      <LabSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
}
