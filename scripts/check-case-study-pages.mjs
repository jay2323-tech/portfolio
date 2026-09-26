import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

// Inspect the server-rendered production pages so source citations cannot pass
// validation merely because their IDs still exist in the TypeScript model.
const output = path.resolve(".next/server/app");
assert.ok(existsSync(output), "Run npm run build before checking case-study pages.");
const slugs = readdirSync("content/case-studies").filter((file) => file.endsWith(".yaml")).map((file) => file.slice(0, -5));
const pages = new Map();
for (const slug of slugs) {
  const html = readFileSync(path.join(output, "work", slug + ".html"), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, slug + ": duplicate anchor IDs");
  for (const section of ["context", "architecture", "decisions", "what-broke", "metrics"]) {
    assert.ok(ids.includes(slug + "-" + section), slug + ": missing legacy source anchor " + section);
  }
  assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, slug + ": needs one main heading");
  assert.ok(html.includes("Back to all work"), slug + ": missing return path");
  pages.set("/work/" + slug, { html, ids: new Set(ids) });
}

let checked = 0;
function checkLink(href, owner) {
  const url = new URL(href, "http://portfolio.local" + owner);
  if (url.origin !== "http://portfolio.local") return;
  if (url.pathname.startsWith("/work/")) {
    const target = pages.get(url.pathname);
    assert.ok(target, owner + ": unknown project destination " + href);
    if (url.hash) assert.ok(target.ids.has(decodeURIComponent(url.hash.slice(1))), owner + ": missing source anchor " + href);
    checked++;
  } else if (url.pathname.startsWith("/notes/") || url.pathname.startsWith("/lab/")) {
    assert.ok(existsSync(path.join(output, url.pathname.slice(1) + ".html")), owner + ": unpublished destination " + href);
    checked++;
  }
}
for (const [route, { html }] of pages) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) checkLink(match[1], route);
}
const corpus = JSON.parse(readFileSync("content/corpus/corpus.json", "utf8"));
for (const chunk of corpus) if (chunk.href?.startsWith("/work/")) checkLink(chunk.href, "/");
console.log("Verified " + pages.size + " rendered case studies and " + checked + " project, note, experiment and citation links.");
