/** Public route context only. Never accept arbitrary page text as evidence. */
const projects = {
  "company-brain": { title: "CompanyBrain", questions: ["Why does this project use graph-aware retrieval?", "What broke while building this project?", "What evidence is available for this project?"] },
  "factory-attendance": { title: "Factory Attendance", questions: ["How does this project handle uncertain matches?", "What changed after testing at the factory?", "How was this project handed over?"] },
  workbuddy: { title: "WorkBuddy", questions: ["Why was this project built this way?", "How does this project handle approvals?", "Does applied mean verified in this project?"] },
} as const;
export type ProjectContext = keyof typeof projects;
export const contextRoutes: Record<string, ProjectContext> = {
  "/work/company-brain": "company-brain", "/work/factory-attendance": "factory-attendance", "/work/workbuddy": "workbuddy",
  "/lab/approval-receipt": "workbuddy", "/lab/shift-simulator": "factory-attendance",
  "/notes/2026-09-24-workbuddy": "workbuddy", "/notes/2026-07-10-companybrain": "company-brain",
  "/notes/2026-05-12-companybrain": "company-brain", "/notes/2026-06-22-freelance": "factory-attendance",
};
export function validatePageContext(value: unknown): ProjectContext | undefined {
  return typeof value === "string" && Object.hasOwn(projects, value) ? value as ProjectContext : undefined;
}
export function contextForPath(path: string) { return contextRoutes[path.replace(/\/$/, "")]; }
export function contextDetails(context: ProjectContext) { return projects[context]; }
export function contextualQuestion(question: string, context?: ProjectContext) {
  // An explicit project reference wins, including cross-project comparisons.
  if (!context || /company\s*brain|work\s*buddy|factory\s*attendance/i.test(question)) return question;
  // Personal and general questions remain global even on a project page.
  if (!/\b(this|it|its|here|project|system|built|build|design|approvals?|verification|retrieval|matches)\b/i.test(question)) return question;
  return `Regarding ${projects[context].title}: ${question}`;
}
