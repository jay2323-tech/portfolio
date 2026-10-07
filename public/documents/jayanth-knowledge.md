# Jayanth Krishna — the working notes

Prepared on 2 October 2026; portfolio implementation notes updated on 8 October 2026. Based on the portfolio's authored case studies, About page, and process notes. Project status is described as documented, not continuously monitored. This is the public source document used by Ask My Work.

## Identity

Jayanth Krishna is an AI engineer based in Bengaluru, India. He builds practical AI systems and full-stack products, with work spanning retrieval, automation, computer vision, and tools for developers. His portfolio emphasizes inspectable decisions, visible sources, and clear accounts of what broke during a build.

## Skills and tools

Jayanth's documented skills include Python, FastAPI, React, Next.js, TypeScript, hybrid retrieval, graph RAG, Qdrant, Server-Sent Events, and computer vision. His WorkBuddy project also uses LangGraph, SQLite, BM25 document retrieval, Git worktrees, and a native macOS companion. These tools are tied to the project decisions described below; the notes do not assign proficiency scores or claim certifications.

## How he builds

Jayanth's working process is Understand, Map, Build, Verify. He starts with the people, environment, and constraints. He maps the route from input to decision, including handoffs and failure points. He builds with explicit tradeoffs and inspectable behavior. He then records evidence and limits: a completed change is not automatically proof that tests passed. He values documentation and operational handoff.

## Working with clients

For freelance work, Jayanth describes a discovery call to map the problem and constraints, an architecture proposal with written tradeoffs, a build with visible checkpoints, and a handoff with documentation, runbooks, and a support window. He needs access to the relevant system and a decision-maker early. Specific prices, contractual terms, timelines, and immediate availability are not documented; contact him to discuss those.

## CompanyBrain

CompanyBrain is documented as in development, with Jayanth working on the frontend and RAG orchestration in 2025. It helps teams find information across their internal documents and organizational context. A FastAPI orchestration layer uses hybrid search and graph RAG with Qdrant. Answers stream over SSE, and the interface exposes retrieved passages and routing information so a visitor or operator can inspect the sources. The portfolio does not establish production adoption or measured accuracy for CompanyBrain.

## CompanyBrain decisions and failures

CompanyBrain uses graph-aware retrieval because dense search alone missed organizational relationship questions. SSE exposes stages of the response instead of waiting for one completed response. An early failure produced fluent answers citing the wrong passage. The documented response was to make chunk metadata and retrieval provenance visible in the interface and scoring path. Jayanth also learned that administration and observability were a significant part of the product. Public product screenshots and measured outcome data are not attached.

## Factory Attendance

Factory Attendance is documented as live in production for a manufacturing site, with solo delivery and operational handoff by Jayanth in 2024. Capture devices feed a recognition pipeline. Verified punches enter a cloud attendance store, and operations staff use daily reports and exception queues. It demonstrates computer vision, edge-to-cloud integration, and operational tooling. The portfolio does not name the customer or publish employee records, adoption counts, or measured accuracy.

## Factory Attendance decisions and failures

The factory environment introduced changing light, camera angles, and queues at shift changes. The capture loop needed clear retry guidance. Ambiguous punches go to a human exception queue, with supervisor resolution, instead of silently becoming attendance. Reports and anomaly views were designed early because operations and payroll need usable records. Real entrances exposed problems that controlled captures had not; guidance, fallbacks, and early operational support became part of the delivery.

## WorkBuddy

WorkBuddy is Jayanth's local engineering companion prototype from 2026. It helps a developer return to a codebase with project understanding, saved plans, memory, and reviewable AI-proposed changes. Telegram and a native macOS companion share a FastAPI backend. SQLite stores plans, memory, and task events; BM25 retrieves project documents. LangGraph pauses proposals for human approval. A model-free executor applies approved changes in isolated Git review worktrees.

## WorkBuddy approval and verification

WorkBuddy approval binds the proposal hash, canonical project root, target paths, branch, and base commit. Baselines are rechecked around execution. Only approved paths are staged; commit parent and tree are checked. Worktrees are retained for inspection, including failures, and are not automatically merged into the working checkout. Typed receipts distinguish applied, refused, partial, and failed outcomes. Applied does not mean verified: receipts report verified: false until an integrated test-verification gate exists. Failed batches do not become success memories.

## Evidence and current limits

The WorkBuddy status document dated 26 September 2026, reviewed for the portfolio on 27 September, reports 554 core tests passing, 136 desktop tests passing, and 7 GUI tests skipped. It reports a disposable model-free fixture covering an approved edit, a protected-path refusal, and a failed verification check. These are dated source-reported results, not tests rerun by this portfolio. Live model calls, Telegram delivery, real-world reliability, production adoption, and customer outcomes are not established by these counts. Shared Git metadata, concurrent edits, and source freshness remain work. The desktop companion does not provide screen context or voice input. CompanyBrain and Factory Attendance have no attached measured outcome datasets.

## Opportunities and contact

The portfolio lists Jayanth as open to internships, freelance projects, and full-time roles, with global relocation open. He is based in Bengaluru. Contact him at cvjayanth005@gmail.com to confirm availability, discuss a role or build, or request his current résumé. This document does not establish a salary expectation, a university or graduation date, a list of employers, or a current contract rate. If a question requires those details, the answer should say they are not documented and suggest contacting him.

## Portfolio design and architecture

This portfolio uses a Light Lab editorial direction: paper surfaces, annotated diagrams and inspectable engineering decisions. Panchang supplies major headings, Trench Slab editorial titles, Comico playful labels and Dancing Script personal annotations. Inter is the reading/interface face; JetBrains Mono labels technical details. The expressive fonts are self-hosted. Next.js, React and TypeScript render the site. Keystatic edits repository content for projects, notes and experiment metadata. Content relationships are checked before a production build. The colophon at /colophon describes these decisions.

## Portfolio Ask and experiments

Ask retrieves from this public Markdown document using local feature-hashed text embeddings and keyword ranking. A server-side Groq request writes an answer; the default configured model is openai/gpt-oss-20b, overridable through the server environment. Citation IDs are validated against retrieved passages, but a cited answer can still be mistaken. Project pages and related notes supply an allowlisted context to clarify phrases such as this project; explicit project names take priority. Each question starts fresh. Provider errors are shown without a canned generated answer. The API has per-instance request limits. Approval and attendance Lab experiments are deterministic browser-only simulations with fictional data, reset controls and no model calls, real code execution, repository changes, cameras or payroll connection. The attendance simulation illustrates duplicate suppression, human exception handling and offline replay. The approval simulation separates permission, application and verification. These simulations do not establish production reliability.
