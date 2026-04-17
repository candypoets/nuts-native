# Codex Review Summary — sparkling-migration

## Milestone 1 — Review Iteration 1

**Commit reviewed:** `dbc680a708bce08f9017a30ea0a50e1745e73411`  
**Commit after fixes:** `f33130fda47f80825439d5a9f4d7f6a72e8468dd`  
**Reviewer:** Codex (gpt-5.4, xhigh reasoning) + Review Agent

### Critical Findings from Codex

1. **[P1] App.test.tsx import error** — The test imported `{ App }` but `App.tsx` only has a default export. This caused the Vitest suite to fail immediately.
2. **[P1] Stale starter-template assertions in App.test.tsx** — The test still exercised the old starter-page contract (`onMounted` prop and `"Sparkling Starter"` text), which no longer matches the tab-shell `App`.
3. **[P2] PostFooter zap action routes to unregistered page** — The `⚡` handler called `go('ecash')`, but `ecash` is not registered in `app.config.ts` `source.entry` or `router` tables.

### Fixes Applied by Review Agent

1. **App.test.tsx** — Changed to default import (`import App from '../App.js'`), removed stale `onMounted` assertions, and updated the test to verify the current tab-shell UI (`"Explore"` tab label). Also mocked `src/app.css` and fixed the import in `App.tsx` to use a relative path (`../../app.css`) so Vitest can resolve it.
2. **PostFooter.tsx** — Changed `go('ecash')` to `go('wallet')`, which is a registered route.
3. **PostHeader.tsx** — Fixed the known nip05 checkmark bug: the checkmark in the `oneline=false` branch is now conditionally rendered only when `nip05` is present.

### Verification

- `npx vitest run src/pages/main/__tests__/App.test.tsx` → **passed**
- `npm run build` → **passed** (28 bundles, 2945.6 kB)

### Status

All critical issues resolved. Milestone 1 is ready to proceed.

---

## Milestone 2 — Review Iteration 1

**Commit reviewed:** `09858ee773c7621b0b4c3326cd2a8c6ce2c05505`  
**Commit after fixes:** `59a6586a76c4f78eab9b9f730f566f447a2c52de`  
**Reviewer:** Review Agent (manual review — Codex CLI could not complete due to missing OpenAI API key in environment)

### Critical Findings from Review

1. **[P2] ContentBlocks image regex missed URLs with query parameters** — The regex `https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|avif|bmp|svg)` required the image extension to be the final characters of the URL, so links like `https://cdn.example.com/img.jpg?w=800` were not detected as images.
2. **[P2] PostPicture TypeScript implicit-any error** — The `.filter()` callback on `parsed.images` had parameter `item` inferred as `any` because the upstream array came from `JSON.parse()` (`any`). This introduced a new `TS7006` error.

### Fixes Applied by Review Agent

1. **ContentBlocks.tsx** — Updated `imageRegex` to allow an optional query string: `(?:\?[^\s]*)?`.
2. **PostPicture.tsx** — Updated `extractImageUrlsFromText` regex with the same query-string allowance. Added `as unknown[]` cast on `parsed.images` before mapping so the `.filter()` callback receives a proper inferred type and the `TS7006` error is eliminated.

### Non-Critical Observations (Deferred / Accepted)

- Collapse truncation in `ContentBlocks` slices at a raw character boundary (280), which can split a URL mid-token. This is acceptable for the current milestone; a token-aware truncation can be added later.
- `go('explore')` for hashtags loses the specific tag context (original Svelte navigates to `tags:<tag>`). This is an intentional stub until tag search is wired up.
- `onLink` handler in `PostCard` logs to console — placeholder until deep-linking is implemented.

### Verification

- `npm run build` → **passed** (28 bundles, 2955.5 kB)
- `npx tsc --noEmit` → no *new* errors (pre-existing `@lynx-js/react` type-resolution errors remain across the project)

### Status

Critical issues resolved. Milestone 2 is ready to proceed.
