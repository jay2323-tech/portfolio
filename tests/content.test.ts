import assert from "node:assert/strict";
import test from "node:test";
import { getCatalog, relatedLinks, validateCatalog } from "../lib/content/catalog";
import { getArticle } from "../lib/content/site";
import { getExperiment, isPublicExperiment } from "../lib/content/experiments";

test("migrated content loads, preserves citations, and resolves every relationship", async () => {
  const catalog = await getCatalog(true);
  assert.deepEqual(validateCatalog(catalog), []);
  assert.deepEqual(catalog.projects.map((entry) => entry.slug).sort(), ["company-brain", "desi-fit", "factory-attendance"]);
  assert.equal(catalog.notes.length, 5);
  assert.equal(catalog.experiments.length, 3);
  for (const project of catalog.projects) {
    assert.deepEqual(project.sectionIds, {
      context: `${project.slug}-context`, architecture: `${project.slug}-architecture`,
      decisions: `${project.slug}-decisions`, whatBroke: `${project.slug}-what-broke`, metrics: `${project.slug}-metrics`,
    });
  }
});

test("planned experiments and unknown slugs cannot become public destinations", async () => {
  const catalog = await getCatalog();
  assert.equal(catalog.experiments.length, 0);
  assert.equal(await getExperiment("retrieval-challenge"), null);
  assert.equal(await getExperiment("does-not-exist"), null);
  assert.equal(await getArticle("does-not-exist"), null);
  const all = await getCatalog(true);
  all.notes[0].publication = "draft";
  const links = relatedLinks(all, { notes: all.notes.map((note) => note.slug), experiments: all.experiments.map((entry) => entry.slug) });
  assert.equal(links.length, 4);
  assert.ok(links.every((link) => link.kind === "Note" && link.href !== `/notes/${all.notes[0].slug}`));
});

test("broken content references fail validation before a build", async () => {
  const catalog = await getCatalog(true);
  catalog.projects[0].relatedNoteSlugs.push("missing-note");
  catalog.notes[0].relatedProjectSlugs.push("missing-project");
  catalog.experiments[0].relatedNoteSlugs.push("missing-note");
  assert.equal(validateCatalog(catalog).length, 3);
});

test("changing CMS status cannot publish an unimplemented experiment", async () => {
  const catalog = await getCatalog(true);
  catalog.experiments[0].status = "ready";
  assert.equal(isPublicExperiment(catalog.experiments[0]), false);
  assert.match(validateCatalog(catalog).join("\n"), /registered, verified implementation/);
});
