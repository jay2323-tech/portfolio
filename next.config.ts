import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/ask": ["./public/documents/jayanth-knowledge.md"],
    "/about/source-notes": ["./public/documents/jayanth-knowledge.md"],
  },
};

export default function config(phase: string): NextConfig {
  return {
    ...nextConfig,
    // Production builds must not replace a running preview's manifests.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  };
}
