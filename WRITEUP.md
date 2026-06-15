# Page Studio — Design Write-up

## Problem Framing

Marketing teams need to iterate on landing pages without redeploying the entire application. Page Studio provides a constrained editor: users work within a fixed section registry (hero, feature grid, testimonial, CTA) so output stays on-brand, accessible, and schema-valid. Publishing produces immutable, versioned releases rather than overwriting live content.

## Key Decisions and Trade-offs

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| Schema-driven renderer with Zod | Invalid CMS data cannot crash the app; types stay in sync with validation | New section types require schema + registry + component |
| Redux for editor state | Predictable mutations, time-travel debugging, middleware for persistence | More boilerplate than React Context for this scope |
| Filesystem release snapshots | Simple, inspectable, works locally and in CI | Not suitable for Vercel serverless without adapter swap |
| Simulated RBAC via cookie | Demonstrates server-side enforcement without auth vendor lock-in | Not production-secure |
| Preview prefers published release | `/preview` reflects what end users see post-publish | Draft preview in studio only (LivePreview panel) |

## Assumptions

- Contentful `Page` and `Section` content types match the adapter contract.
- One page per slug; releases are append-only.
- Publishers are trusted to publish any valid draft.
- Mock data is acceptable when Contentful credentials are absent.

## What is Not Included

- **CMS write-back:** Drafts are not pushed to Contentful on save.
- **Multi-tenant auth:** Single-role cookie per browser session.
- **Visual drag-and-drop on canvas:** Editing is form-based (WYSIWYG-lite).
- **Real-time collaboration:** Single-editor model with localStorage recovery.

## Architecture Overview

The application has three verticals:

1. **Ingestion** — Contentful adapter fetches and normalises entries.
2. **Editing** — Studio UI dispatches Redux actions; no direct state mutation.
3. **Publishing** — API diffs draft vs latest snapshot, bumps SemVer, writes JSON artefact.

RBAC sits at the edge (`proxy.ts`) and on the publish endpoint.

## Redux Slice Responsibilities

- **draftPage:** Source of truth for page structure during editing. All section mutations flow through reducers. Persisted to `localStorage` when dirty.
- **ui:** Ephemeral studio chrome — selection, dialogs, responsive preview framing.
- **publish:** Async publish lifecycle and result display in `PublishDialog`.

## Contentful Model and Adapter

The adapter (`client.ts` + `adapter.ts`) is the only module that imports the Contentful SDK. It supports:

- Delivery vs preview API hosts
- Reference resolution for nested sections
- Graceful mock fallback

UI and renderer consume plain `Page` / `Section` types.

## Publish and SemVer Logic

`diffPages()` emits a list of changes with severities. `calculateNextVersion()` applies major > minor > patch precedence. Publishing the same content twice returns `status: unchanged` with no new file written.

## Accessibility Approach

Target: WCAG 2.2 AA in automated tests, AAA-oriented patterns where practical (keyboard operability, focus visibility, reduced motion, labelled forms). Axe runs in Playwright against home, preview, and studio routes. Critical violations fail CI.

Manual follow-up for full AAA: enhanced contrast audit, sign-language alternatives, and extended audio description are out of sprint scope.
