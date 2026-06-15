# Page Studio

A production-quality WYSIWYG-lite studio for managing and publishing landing pages. Built with Next.js App Router, TypeScript, Redux Toolkit, Contentful, and shadcn/ui.

## Architecture Overview

Page Studio separates the editing experience (`/studio/[slug]`) from the rendering experience (`/preview/[slug]`).

```
Contentful ──► adapter.ts ──► Zod validation ──► PageRenderer
                                    ▲
Studio UI ──► Redux (draftPage) ────┘
                    │
                    ▼ publish
            releases/[slug]/[version].json
                    │
                    ▼
              /preview/[slug]
```

- **Data layer:** Contentful SDK is isolated in `src/lib/contentful/`. Pages are validated with Zod before rendering.
- **State layer:** Redux Toolkit manages draft page structure, studio UI, and publish flow state.
- **Publish pipeline:** Deterministic diffing produces SemVer bumps and immutable JSON snapshots.
- **Security:** RBAC is enforced in `src/proxy.ts` (route access) and `/api/publish` (action access).

## Redux Slice Responsibilities

| Slice | Responsibility |
|-------|----------------|
| `draftPageSlice` | Page structure in the studio: load, add/remove/reorder sections, update props, dirty tracking, localStorage persistence |
| `uiSlice` | Selected section, panel state, add-section dialog, preview device mode (desktop/tablet/mobile) |
| `publishSlice` | Publish state machine (idle → publishing → success/error), last version, changelog |

## Contentful Model & Adapter

Expected Contentful content types:

- **Page:** `title`, `slug`, `sections` (references)
- **Section:** `type`, `props` (JSON object)

`src/lib/contentful/adapter.ts` maps Contentful entries to internal `Page` / `Section` types. When `CONTENTFUL_SPACE_ID` is unset, the app falls back to mock data for slug `home`.

Draft vs published content is controlled by the `preview` flag passed to `getContentfulClient()` (preview API vs delivery API). No Contentful logic lives in UI components.

## Publish + SemVer Logic

`src/lib/publish/diff.ts` compares the draft against the latest release snapshot:

| Change | SemVer bump |
|--------|-------------|
| Text/prop change, reorder | Patch |
| Add section | Minor |
| Remove section, change type | Major |

On publish, `releases/[slug]/[version].json` is written. Identical drafts produce no new version (idempotent).

`/preview/[slug]` serves the latest published release when available; otherwise it falls back to Contentful.

## Accessibility Evidence

- Skip links on home and studio routes
- Visible `:focus-visible` outlines globally
- `prefers-reduced-motion` respected in CSS and live preview transitions
- Logical heading hierarchy in section components (`h1` in hero, `h2` in subsections)
- Forms use associated `<label>` elements and `aria-*` attributes
- Keyboard-operable section reordering via `@dnd-kit` keyboard sensor
- Dialogs use shadcn/base-ui focus management
- Playwright + axe-core scans in CI; `a11y-report/a11y-report.json` artefact generated
- CI fails on critical or serious axe violations

## Setup & Local Development

### Windows (PowerShell)

If `npm` fails with *"running scripts is disabled"*, use the `.cmd` wrapper:

```powershell
npm.cmd install
npm.cmd run dev
```

Or fix it once (PowerShell as Administrator):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Install & run

1. Install dependencies:

   ```bash
   npm install
   ```

   If you see `adapterFn is not a function` after switching between `dev` and `build`, clear the cache and restart:

   ```bash
   npm run dev:clean
   ```

2. Environment variables — copy `.env.example` to `.env.local`:

   ```env
   CONTENTFUL_SPACE_ID=
   CONTENTFUL_DELIVERY_TOKEN=
   CONTENTFUL_PREVIEW_TOKEN=
   CONTENTFUL_ENVIRONMENT=master
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Role simulation (sets `user_role` cookie):

   | Role | URL |
   |------|-----|
   | Viewer | `/api/auth?role=viewer` |
   | Editor | `/api/auth?role=editor` |
   | Publisher | `/api/auth?role=publisher` |

## Testing

```bash
npm run test:run      # Vitest unit tests
npm run test:e2e      # Playwright e2e + a11y
npm run test:a11y     # A11y subset only
```

## Deployment (Vercel)

1. Connect the GitHub repository to Vercel.
2. Set environment variables in the Vercel dashboard.
3. `vercel.json` is included for framework defaults.
4. **Note:** Release snapshots currently write to the local filesystem. For production on Vercel, swap `snapshot.ts` to S3/KV — the publish API is already decoupled.

## What is Incomplete and Why

| Item | Reason |
|------|--------|
| Real auth provider | RBAC uses a simulated cookie for the sprint demo; swap to NextAuth/Clerk for production |
| External release storage | Snapshots use `releases/` on disk; Vercel serverless needs S3 or a database |
| Contentful write-back | Studio edits live in Redux/localStorage; publishing writes to release snapshots, not Contentful |
| Full AAA conformance | Automated checks target WCAG 2.2 AA; AAA requires manual audit for contrast/enhanced criteria |

See `WRITEUP.md` for the short design write-up.
