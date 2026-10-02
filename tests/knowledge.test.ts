import assert from "node:assert/strict";
import test from "node:test";
import { getKnowledge, retrieveKnowledge } from "../lib/rag/knowledge";
import { validateAnswer, generateGroqAnswer } from "../lib/rag/groq";
import { askStream } from "../lib/rag/client";

test("public notes have unique anchors and retrieve project and process evidence", () => {
  const notes = getKnowledge();
  assert.equal(new Set(notes.map(n => n.id)).size, notes.length);
  for (const [question, expected] of [
    ["Who is Jayanth?", "identity"],
    ["How does Jayanth approach a new project?", "how-he-builds"],
    ["What broke while building CompanyBrain?", "companybrain-decisions-and-failures"],
    ["How does WorkBuddy handle approval and verification?", "workbuddy-approval-and-verification"],
  ]) assert.ok(retrieveKnowledge(question).some(n => n.id === expected), question);
  assert.deepEqual(retrieveKnowledge("quantum penguins on Neptune"), []);
});

test("citations must refer to retrieved evidence, with no fabricated source IDs", () => {
  const chunks = retrieveKnowledge("CompanyBrain");
  assert.throws(() => validateAnswer({ answer: "An answer", sourceIds: ["invented"], unsupported: false }, chunks));
  assert.throws(() => validateAnswer({ answer: "An answer", sourceIds: [], unsupported: false }, chunks));
  assert.equal(validateAnswer({ answer: "The notes do not establish that.", sourceIds: [], unsupported: true }, chunks).unsupported, true);
});

test("Groq request uses the real endpoint and validates its structured response", async () => {
  const original = globalThis.fetch;
  const key = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = "unit-test-placeholder";
  const chunks = retrieveKnowledge("CompanyBrain");
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
      const body = JSON.parse(String(options?.body));
      assert.equal(body.response_format.type, "json_object");
      assert.ok(JSON.parse(body.messages[1].content).passages.length);
      return Response.json({ choices: [{ finish_reason: "stop", message: { content: JSON.stringify({ answer: "Grounded answer", sourceIds: [chunks[0].id], unsupported: false }) } }] });
    };
    assert.equal((await generateGroqAnswer("CompanyBrain", chunks, new AbortController().signal)).answer, "Grounded answer");
    globalThis.fetch = async () => Response.json({}, {status: 429});
    await assert.rejects(generateGroqAnswer("CompanyBrain", chunks, new AbortController().signal), /provider_busy/);
  } finally {
    globalThis.fetch = original;
    if (key === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = key;
  }
});

test("SSE handles byte boundaries and refuses incomplete or error responses", async () => {
  const original = globalThis.fetch;
  const response = (s: string) => new Response(new ReadableStream({ start(controller) {
    for (const byte of new TextEncoder().encode(s)) controller.enqueue(new Uint8Array([byte]));
    controller.close();
  }}));
  try {
    globalThis.fetch = async () => response('event: token\ndata: {"text":"Jayanth’s work"}\n\nevent: done\ndata: {"sourceIds":["identity"],"model":"test"}\n\n');
    assert.equal((await askStream("Who?", "lab")).answer, "Jayanth’s work");
    globalThis.fetch = async () => response('event: token\ndata: {"text":"Partial"}\n\n');
    await assert.rejects(askStream("Who?", "lab"), /before the answer finished/);
    globalThis.fetch = async () => response('event: error\ndata: {"message":"Provider unavailable"}\n\n');
    await assert.rejects(askStream("Who?", "lab"), /Provider unavailable/);
  } finally { globalThis.fetch = original; }
});

test("API rejects invalid input and exposes retrieval without pretending a missing key worked", async () => {
  const { POST } = await import("../app/api/ask/route");
  const key = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  const req = (query: unknown) => new Request("http://localhost/api/ask", { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": "test-api" }, body: JSON.stringify({query}) });
  try {
    assert.equal((await POST(req(""))).status, 400);
    assert.equal((await POST(req(42))).status, 400);
    const missing = await (await POST(req("CompanyBrain"))).text();
    assert.match(missing, /event: meta/);
    assert.match(missing, /not_configured/);
    assert.doesNotMatch(missing, /event: done/);
    const unsupported = await (await POST(req("quantum penguins Neptune"))).text();
    assert.match(unsupported, /"unsupported":true/);
    assert.match(unsupported, /"model":null/);
  } finally { if (key !== undefined) process.env.GROQ_API_KEY = key; }
});
