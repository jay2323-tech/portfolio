export const scenarios = [
  { id: "clean", title: "The clean change", note: "Everything lines up. Is that enough?", file: "src/greeting.ts", before: 'return "Hello";', after: 'return "Hello, visitor!";', reason: "Make the welcome message more specific.", baseline: "Matches approved revision", outcome: "applied", verification: "passed", check: "Greeting fixture: 1 expected output, 1 matched." },
  { id: "failed-check", title: "Applied ≠ verified", note: "The edit lands. The check disagrees.", file: "src/cart.ts", before: "return subtotal + shipping;", after: "return subtotal;", reason: "Proposed simplification accidentally removes shipping from the total.", baseline: "Matches approved revision", outcome: "applied", verification: "failed", check: "Cart fixture: expected 105, received 100. Shipping was omitted." },
  { id: "stale", title: "The moving baseline", note: "You approved one version. Another arrived.", file: "src/settings.ts", before: "timeout: 3000", after: "timeout: 5000", reason: "Increase the timeout, but the sample branch changed after the proposal was prepared.", baseline: "Changed since proposal", outcome: "refused", verification: "not-run", check: "Baseline mismatch. Prepare a fresh proposal and ask for approval again." },
  { id: "protected", title: "A boundary holds", note: "Approval does not unlock every file.", file: ".env.local", before: "[protected configuration]", after: "[proposed replacement]", reason: "The proposal targets a protected configuration path outside the sample allowlist.", baseline: "Matches approved revision", outcome: "refused", verification: "not-run", check: "Protected path. No simulated write is permitted." },
] as const;
export type Scenario = typeof scenarios[number];
export type Receipt = { outcome: "applied" | "refused" | "rejected"; verification: "passed" | "failed" | "not-run"; check: string };
export type State = { scenario: Scenario; receipt: Receipt | null };
export type Action = { type: "select"; id: string } | { type: "reset" } | { type: "approve" } | { type: "reject" };
export const initialState: State = { scenario: scenarios[0], receipt: null };
export function approvalReducer(state: State, action: Action): State {
  if (action.type === "select") return { scenario: scenarios.find(s => s.id === action.id) ?? state.scenario, receipt: null };
  if (action.type === "reset") return { ...state, receipt: null };
  if (state.receipt) return state;
  if (action.type === "reject") return { ...state, receipt: { outcome: "rejected", verification: "not-run", check: "You declined the proposal. Nothing was applied." } };
  return { ...state, receipt: { outcome: state.scenario.outcome, verification: state.scenario.verification, check: state.scenario.check } };
}
