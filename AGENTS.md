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
- `src/content/articles/` — MD/MDX with frontmatter (title, date, tags, collection, draft)
- `src/content/projects/` — same schema plus `type` and `links[]`
- `src/pages/articles/[...slug].astro` — article detail; `src/pages/articles/index.astro` — grouped listing
- `src/pages/projects/[...slug].astro` / `index.astro` — same for projects
- `src/pages/api/search-index.json.ts` — pre-rendered JSON endpoint for client-side search
- `src/lib/` — `utils.ts` (CJK-aware truncate, countWords, formatDate, stripMarkdown, `isCjkChar()`, exported constants `CJK_THRESHOLD`, `CJK_READING_SPEED`, `LATIN_READING_SPEED`, `TRUNCATE_CJK`, `TRUNCATE_LATIN`), `search.ts` (buildSearchIndex)
- `src/components/mdx.ts` — exports `{ BookInfo, Note, PullQuote }` for use in MDX content
- `src/layouts/BaseLayout.astro` — zh-Hant-TW, dark-only theme, fixed header, footer with cycling quotes; uses `SITE` from `config.ts` for all metadata output (lang, og tags, JSON-LD, robots, twitter:card)

## Conventions

- Path alias `@/*` → `src/*`
- Dark theme only via CSS custom properties in `global.css`
- Article filenames: `YYYY-MM-DD-slug.md` (date prefix convention)
- `draft: true` excludes from all listings but still built
- `collection` field in article frontmatter groups articles on the listing page
- Reading time: CJK-dominant → `CJK_READING_SPEED` (500 chars/min), else → `LATIN_READING_SPEED` (200 words/min). Constants exported from `utils.ts`.
- Truncation: `TRUNCATE_CJK` (125) for CJK-dominant text, `TRUNCATE_LATIN` (250) otherwise. Constants exported from `utils.ts`.
- CJK detection: `isCjkChar(code)` in `utils.ts` is the single shared function. No inline CJK range checks elsewhere.
- Site metadata (name, lang, author, URL, robots, etc.) lives in `src/config.ts` — not scattered across components or `astro.config.mjs`.
- `astro.config.mjs` is for Astro config only (site URL for sitemap integration, integrations). Application config goes in `src/config.ts`.
