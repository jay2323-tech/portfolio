import { WorkbenchHero } from "@/components/hero/WorkbenchHero";
import { ChallengeSection } from "@/components/home/ChallengeSection";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { ToolsBehindWork } from "@/components/home/ToolsBehindWork";
import { ArticlesSection } from "@/components/articles/ArticlesSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/Footer";
import { getAllCaseStudies } from "@/lib/case-studies";
import {
  getAbout,
  getArticles,
  getContact,
  getSettings,
  portraitSrc,
} from "@/lib/content/site";

export default async function HomePage() {
  const [studies, about, contact, settings, articles] =
    await Promise.all([
      getAllCaseStudies(),
      getAbout(),
      getContact(),
      getSettings(),
      getArticles(),
    ]);

  if (!about || !contact) {
    throw new Error("Missing required site content — check content/site/");
  }

  const notePreviews = ["workbuddy", "company-brain", "factory-attendance"]
    .map((slug) => articles.find((entry) => entry.relatedProjectSlugs.includes(slug)))
    .filter((entry): entry is (typeof articles)[number] => Boolean(entry));

  return (
    <>
      <WorkbenchHero studies={studies} portrait={portraitSrc(settings)} />
      <ChallengeSection />
      <ProcessSteps />
      <ToolsBehindWork />
      <ArticlesSection entries={notePreviews} />
      <AboutSection content={about} portrait={portraitSrc(settings)} />
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
