# personal-website

Astro 7.x site deployed to Cloudflare Pages (snow-viktor.pages.dev).

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | dev server with HMR |
| `npm run build` | static build to `dist/` |
| `npm run preview` | preview the build locally |

No lint, typecheck, or test commands exist. Build before preview.

## Structure

- `src/config.ts` — single source of truth for site metadata (`SITE`), nav links (`NAV_LINKS`), social links (`SOCIAL_LINKS`), and footer quotes (`QUOTES`). Import from here in any component or layout instead of hardcoding strings.
- `src/content.config.ts` — Zod schemas for both collections (article fields: title, date, tags, collection, draft; project fields: title, date, type, tags, links, draft)
- `src/content/articles/` — MD/MDX with frontmatter (title, date, tags, collection, draft)
- `src/content/projects/` — same schema plus `type` and `links[]`
- `src/pages/articles/[...slug].astro` — article detail; `src/pages/articles/index.astro` — grouped listing
- `src/pages/projects/[...slug].astro` / `index.astro` — same for projects
- `src/pages/api/search-index.json.ts` — pre-rendered JSON endpoint for client-side search
- `src/lib/` — `cjk.ts` (shared `isCjkChar()`), `content.ts` (`getPublishedArticles()`, `getPublishedProjects()`, `groupByCollection()`), `utils.ts` (truncate, countWords, computeReadingTime, stripMarkdown, stripForReading, formatDate), `search.ts` (buildSearchIndex), `search-client.ts` (tokenize, extractSnippet, highlightMatches, escapeHtml)
- `src/components/mdx.ts` — exports `{ BookInfo, Note, PullQuote }` for use in MDX content
- `src/layouts/BaseLayout.astro` — zh-Hant-TW, dark-only theme, fixed header, footer with cycling quotes; uses `SITE` from `config.ts` for all metadata output (lang, og tags, JSON-LD, robots, twitter:card)

## Conventions

- Path alias `@/*` → `src/*`
- Dark theme only via CSS custom properties in `global.css`
- Article filenames: `YYYY-MM-DD-slug.md` (date prefix convention)
- `draft: true` excludes from all listings but still built
- `collection` field in article frontmatter groups articles on the listing page
- Reading time: `computeReadingTime(body)` in `utils.ts` — CJK-dominant → `CJK_READING_SPEED` (500 chars/min), else → `LATIN_READING_SPEED` (200 words/min)
- Truncation: `TRUNCATE_CJK` (125) for CJK-dominant text, `TRUNCATE_LATIN` (250) otherwise. Constants exported from `utils.ts`.
- CJK detection: `isCjkChar(code)` in `src/lib/cjk.ts` is the single shared function. No inline CJK range checks elsewhere. Imported by both `utils.ts` (server) and `search-client.ts` (client).
- Text stripping: `stripMarkdown()` strips frontmatter + HTML only. `stripForReading()` strips everything (images, links, markdown syntax, newlines). Use `stripForReading` when computing reading time or CJK dominance.
- Site metadata (name, lang, author, URL, robots, etc.) lives in `src/config.ts` — not scattered across components or `astro.config.mjs`.
- `astro.config.mjs` is for Astro config only (site URL for sitemap integration, integrations). Application config goes in `src/config.ts`.
- Content collection access: always go through `src/lib/content.ts` (`getPublishedArticles()`, `getPublishedProjects()`). Don't call `getCollection()` with draft filters or sort logic inline.

## Gotchas

- Search results are rendered client-side via `innerHTML` in `src/pages/search.astro`, so the `.search-result*` classes live in `src/styles/global.css` (unscoped). Astro-scoped `<style>` blocks only match static template nodes — styles for injected search results never apply unless they're global.
- `astro.config.mjs` sets `trailingSlash: 'always'`; all internal links must end with `/` (e.g. `/articles/slug/`, `/projects/slug/`).
- `search-client.ts` is a client-side module (runs in browser). It imports `isCjkChar` from `cjk.ts`, which works because Vite bundles it. Don't import server-only modules from client-side `<script>` blocks.

## Agent skills

Skills are gitignored (`.agents/skills/`). Restore via:

```sh
npx skills experimental_install
```

### Issue tracker

No active issue tracker configured. This is a personal repo. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout. See `docs/agents/domain.md`.
