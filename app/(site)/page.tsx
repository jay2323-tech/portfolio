import { Hero } from "@/components/hero/Hero";
import { LogoMarquee } from "@/components/chrome/LogoMarquee";
import { CaseStudiesSection } from "@/components/case-studies/CaseStudiesSection";
import { ArticlesSection } from "@/components/articles/ArticlesSection";
import { LabSection } from "@/components/lab/LabSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/Footer";
import { getAllCaseStudies } from "@/lib/case-studies";
import {
  getAbout,
  getArticles,
  getContact,
  getHero,
  getLab,
  getSettings,
  portraitSrc,
} from "@/lib/content/site";

export default async function HomePage() {
  const [studies, hero, about, lab, contact, settings, articles] =
    await Promise.all([
      getAllCaseStudies(),
      getHero(),
      getAbout(),
      getLab(),
      getContact(),
      getSettings(),
      getArticles(),
    ]);

  if (!about || !lab || !contact) {
    throw new Error("Missing required site content — check content/site/");
  }

  return (
    <>
      <Hero
        firstName={hero?.firstName ?? "JAYANTH"}
        lastName={hero?.lastName ?? "KRISHNA"}
        roleTitle={hero?.roleTitle ?? "AI ENGINEER"}
        roleSubtitle={
          hero?.roleSubtitle ?? "PRODUCTION RAG · SYSTEMS · FULL-STACK"
        }
        metaLines={
          hero?.metaLines?.filter(Boolean)?.length
            ? hero.metaLines.filter(Boolean)
            : [
                "3 SYSTEMS SHIPPED / IN BUILD",
                "BASED IN BENGALURU, INDIA",
                "OPEN TO WORK ALL AROUND",
              ]
        }
        edgeTabLabel={hero?.edgeTabLabel ?? "OPEN"}
        portraitSrc={portraitSrc(settings)}
      />
      <LogoMarquee items={settings?.logoMarquee?.filter(Boolean)} />
      <CaseStudiesSection studies={studies} />
      <ArticlesSection entries={articles} />
      <LabSection content={lab} />
      <AboutSection content={about} />
      <ContactSection
        links={(contact.links ?? []).map((l) => ({
          label: l.label,
          href: l.href,
          display: l.display,
          external: Boolean(l.external),
        }))}
      />
      <Footer />
    </>
  );
}
