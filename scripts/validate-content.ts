import { getCatalog, validateCatalog } from "../lib/content/catalog";

async function main() {
  const catalog = await getCatalog(true);
  const errors = validateCatalog(catalog);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log(`Content valid: ${catalog.projects.length} projects, ${catalog.notes.length} notes, ${catalog.experiments.length} experiments. All references resolve.`);
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
