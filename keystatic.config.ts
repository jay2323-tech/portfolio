import { config, fields, collection, singleton } from "@keystatic/core";

const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;

export default config({
  storage: githubRepo
    ? {
        kind: "github" as const,
        repo: githubRepo as `${string}/${string}`,
      }
    : { kind: "local" as const },
  ui: {
    brand: { name: "Jayanth CMS" },
  },
  collections: {
    caseStudies: collection({
      label: "Case studies",
      slugField: "title",
      path: "content/case-studies/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        problem: fields.text({ label: "Problem", multiline: true }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Live", value: "live" },
            { label: "Development", value: "development" },
          ],
          defaultValue: "development",
        }),
        statusLabel: fields.text({ label: "Status label" }),
        domain: fields.text({ label: "Domain / category" }),
        year: fields.text({ label: "Year" }),
        role: fields.text({ label: "My role" }),
        timeframe: fields.text({ label: "Timeframe" }),
        summary: fields.text({ label: "Short summary", multiline: true }),
        evidence: fields.array(fields.object({
          title: fields.text({ label: "Title" }),
          kind: fields.select({ label: "Evidence type", options: [
            { label: "Screenshot", value: "screenshot" },
            { label: "Recording", value: "recording" },
            { label: "Diagram", value: "diagram" },
            { label: "Source code", value: "code" },
            { label: "Written account", value: "narrative" },
          ], defaultValue: "narrative" }),
          href: fields.text({ label: "Public path or URL" }),
          caption: fields.text({ label: "Caption / context", multiline: true }),
        }), { label: "Evidence", itemLabel: (props) => props.fields.title.value || "Evidence" }),
        resultContext: fields.text({ label: "Results and measurement context", multiline: true }),
        limitations: fields.array(fields.text({ label: "Limitation", multiline: true }), { label: "Limitations" }),
        demoSlug: fields.text({ label: "Primary experiment slug" }),
        relatedNoteSlugs: fields.array(fields.text({ label: "Note slug" }), { label: "Related notes" }),
        relatedExperimentSlugs: fields.array(fields.text({ label: "Experiment slug" }), { label: "Related experiments" }),
        coverImage: fields.text({
          label: "Cover image path",
          description: "Public path, e.g. /images/work/company-brain.svg",
        }),
        metrics: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            value: fields.text({ label: "Value" }),
          }),
          {
            label: "System facts (legacy metrics)",
            itemLabel: (props) =>
              props.fields.label.value || props.fields.value.value || "Metric",
          },
        ),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value || "Tag",
        }),
        eyebrow: fields.text({ label: "Eyebrow" }),
        headline: fields.text({ label: "Headline", multiline: true }),
        who: fields.text({ label: "Who / context", multiline: true }),
        constraints: fields.array(fields.text({ label: "Constraint", multiline: true }), {
          label: "Constraints",
          itemLabel: (props) =>
            props.value ? props.value.slice(0, 48) : "Constraint",
        }),
        architectureSummary: fields.text({
          label: "Architecture summary",
          multiline: true,
        }),
        decisions: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            body: fields.text({ label: "Body", multiline: true }),
          }),
          {
            label: "Decisions",
            itemLabel: (props) => props.fields.title.value || "Decision",
          },
        ),
        whatBroke: fields.text({ label: "What broke", multiline: true }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            href: fields.text({ label: "Href" }),
            external: fields.checkbox({
              label: "External",
              defaultValue: false,
            }),
          }),
          {
            label: "Links",
            itemLabel: (props) => props.fields.label.value || "Link",
          },
        ),
      },
    }),
    articles: collection({
      label: "Articles / build log",
      slugField: "title",
      path: "content/build-log/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Label" } }),
        date: fields.date({ label: "Date", validation: { isRequired: true } }),
        tag: fields.text({ label: "Tag" }),
        publication: fields.select({ label: "Publication", options: [
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
        ], defaultValue: "draft" }),
        summary: fields.text({ label: "Summary", multiline: true }),
        relatedProjectSlugs: fields.array(fields.text({ label: "Project slug" }), { label: "Related projects" }),
        relatedExperimentSlugs: fields.array(fields.text({ label: "Experiment slug" }), { label: "Related experiments" }),
        media: fields.array(fields.object({
          src: fields.text({ label: "Public media path" }),
          alt: fields.text({ label: "Alternative text" }),
          caption: fields.text({ label: "Caption" }),
        }), { label: "Media", itemLabel: (props) => props.fields.alt.value || "Media" }),
        body: fields.text({
          label: "Body (Markdown)",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
    experiments: collection({
      label: "Experiments",
      slugField: "title",
      path: "content/experiments/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        status: fields.select({ label: "Availability", options: [
          { label: "Planned — hidden", value: "planned" },
          { label: "Ready — public", value: "ready" },
        ], defaultValue: "planned" }),
        executionMode: fields.select({ label: "Execution mode", options: [
          { label: "Simulation", value: "simulation" },
          { label: "Live", value: "live" },
          { label: "Recorded", value: "recorded" },
        ], defaultValue: "simulation" }),
        relatedProjectSlug: fields.text({ label: "Related project slug" }),
        relatedNoteSlugs: fields.array(fields.text({ label: "Note slug" }), { label: "Related notes" }),
        sampleInputs: fields.array(fields.object({
          label: fields.text({ label: "Label" }),
          value: fields.text({ label: "Input", multiline: true }),
        }), { label: "Sample inputs", itemLabel: (props) => props.fields.label.value || "Input" }),
        explanation: fields.text({ label: "Explanation (Markdown)", multiline: true }),
        limitations: fields.array(fields.text({ label: "Limitation", multiline: true }), { label: "Limitations" }),
      },
    }),
    corpus: collection({
      label: "RAG corpus",
      slugField: "title",
      path: "content/corpus/chunks/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        source: fields.select({
          label: "Source",
          options: [
            { label: "Resume", value: "resume" },
            { label: "Case study", value: "case-study" },
            { label: "Architecture", value: "architecture" },
            { label: "Build log", value: "build-log" },
          ],
          defaultValue: "resume",
        }),
        content: fields.text({
          label: "Content",
          multiline: true,
          validation: { isRequired: true },
        }),
        href: fields.text({ label: "Href" }),
      },
    }),
  },
  singletons: {
    hero: singleton({
      label: "Hero",
      path: "content/site/hero",
      format: { data: "yaml" },
      schema: {
        firstName: fields.text({ label: "First name" }),
        lastName: fields.text({ label: "Last name" }),
        roleTitle: fields.text({ label: "Role title" }),
        roleSubtitle: fields.text({ label: "Role subtitle" }),
        metaLines: fields.array(fields.text({ label: "Line" }), {
          label: "Meta chips",
          itemLabel: (props) => props.value || "Line",
        }),
        edgeTabLabel: fields.text({ label: "Edge tab label", defaultValue: "OPEN" }),
      },
    }),
    about: singleton({
      label: "About",
      path: "content/site/about",
      format: { data: "yaml" },
      schema: {
        coordinates: fields.text({ label: "Coordinates line" }),
        statement: fields.text({ label: "Statement", multiline: true }),
        blurb: fields.text({ label: "Blurb", multiline: true }),
        facts: fields.array(fields.text({ label: "Fact" }), {
          label: "Fact lines",
          itemLabel: (props) => props.value || "Fact",
        }),
        resumeHref: fields.text({ label: "Resume / CV href" }),
        resumeLabel: fields.text({
          label: "Resume link label",
          defaultValue: "DOWNLOAD RESUMÉ / CV →",
        }),
        experience: fields.array(
          fields.object({
            org: fields.text({ label: "Org" }),
            role: fields.text({ label: "Role" }),
            years: fields.text({ label: "Years" }),
          }),
          {
            label: "Experience",
            itemLabel: (props) => props.fields.org.value || "Role",
          },
        ),
        study: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            place: fields.text({ label: "Place" }),
            years: fields.text({ label: "Years" }),
          }),
          {
            label: "Study",
            itemLabel: (props) => props.fields.title.value || "Study",
          },
        ),
        foundations: fields.array(
          fields.object({
            n: fields.text({ label: "Index" }),
            title: fields.text({ label: "Title" }),
            body: fields.text({ label: "Body", multiline: true }),
          }),
          {
            label: "Foundations",
            itemLabel: (props) => props.fields.title.value || "Foundation",
          },
        ),
        competencies: fields.array(fields.text({ label: "Competency" }), {
          label: "Competencies",
          itemLabel: (props) => props.value || "Item",
        }),
        toolkit: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            role: fields.text({ label: "Role" }),
            initial: fields.text({ label: "Initial" }),
            tint: fields.text({
              label: "Tint (CSS color)",
              defaultValue: "var(--ink)",
            }),
          }),
          {
            label: "Toolkit",
            itemLabel: (props) => props.fields.name.value || "Tool",
          },
        ),
      },
    }),
    lab: singleton({
      label: "Lab",
      path: "content/site/lab",
      format: { data: "yaml" },
      schema: {
        meta: fields.text({ label: "Section meta", defaultValue: "PROOF OF BUILD" }),
        experiments: fields.array(
          fields.object({
            n: fields.text({ label: "Index" }),
            tags: fields.array(fields.text({ label: "Tag" }), {
              label: "Tags",
              itemLabel: (props) => props.value || "Tag",
            }),
            title: fields.text({ label: "Title" }),
            body: fields.text({ label: "Body", multiline: true }),
            cta: fields.text({ label: "CTA label" }),
            action: fields.select({
              label: "Action",
              options: [
                { label: "Open Ask", value: "ask" },
                { label: "Toggle diagram", value: "diagram" },
                { label: "Link", value: "link" },
              ],
              defaultValue: "link",
            }),
            href: fields.text({ label: "Href (for link action)" }),
          }),
          {
            label: "Experiments",
            itemLabel: (props) => props.fields.title.value || "Experiment",
          },
        ),
      },
    }),
    contact: singleton({
      label: "Contact",
      path: "content/site/contact",
      format: { data: "yaml" },
      schema: {
        links: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            href: fields.text({ label: "Href" }),
            display: fields.text({ label: "Display text" }),
            external: fields.checkbox({
              label: "External",
              defaultValue: true,
            }),
          }),
          {
            label: "Links",
            itemLabel: (props) => props.fields.label.value || "Link",
          },
        ),
      },
    }),
    settings: singleton({
      label: "Settings",
      path: "content/site/settings",
      format: { data: "yaml" },
      schema: {
        portrait: fields.image({
          label: "Portrait",
          directory: "public",
          publicPath: "/",
        }),
        logoMarquee: fields.array(fields.text({ label: "Item" }), {
          label: "Logo marquee items",
          itemLabel: (props) => props.value || "Item",
        }),
        workOrder: fields.array(fields.text({ label: "Slug" }), {
          label: "Work row order (slugs)",
          itemLabel: (props) => props.value || "slug",
        }),
      },
    }),
  },
});
