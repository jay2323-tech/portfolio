import { WorkbenchHero } from "@/components/hero/WorkbenchHero";
import { LogoMarquee } from "@/components/chrome/LogoMarquee";
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
  getLab,
  getSettings,
  portraitSrc,
} from "@/lib/content/site";

export default async function HomePage() {
  const [studies, about, lab, contact, settings, articles] =
    await Promise.all([
      getAllCaseStudies(),
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
      <WorkbenchHero studies={studies} portrait={portraitSrc(settings)} />
      <LogoMarquee items={settings?.logoMarquee?.filter(Boolean)} />
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
