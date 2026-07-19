import { createReader } from "@keystatic/core/reader";
import rawConfig from "../../keystatic.config";

/** Unwrap CJS/ESM default interop so createReader always gets the real config. */
const keystaticConfig =
  (rawConfig as { default?: typeof rawConfig }).default ?? rawConfig;

export function getReader() {
  return createReader(process.cwd(), keystaticConfig);
}

export type SiteHero = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getReader>["singletons"]["hero"]["read"]>>
>;
export type SiteAbout = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getReader>["singletons"]["about"]["read"]>>
>;
export type SiteLab = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getReader>["singletons"]["lab"]["read"]>>
>;
export type SiteContact = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getReader>["singletons"]["contact"]["read"]>>
>;
export type SiteSettings = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getReader>["singletons"]["settings"]["read"]>>
>;
