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

- `src/content/articles/` — MD/MDX with frontmatter (title, date, tags, collection, draft)
- `src/content/projects/` — same schema plus `type` and `links[]`
- `src/pages/articles/[...slug].astro` — article detail; `src/pages/articles/index.astro` — grouped listing
- `src/pages/projects/[...slug].astro` / `index.astro` — same for projects
- `src/pages/api/search-index.json.ts` — pre-rendered JSON endpoint for client-side search
- `src/lib/` — `utils.ts` (CJK-aware truncate, countWords, formatDate, stripMarkdown), `search.ts` (buildSearchIndex)
- `src/components/mdx.ts` — exports `{ BookInfo, Note, PullQuote }` for use in MDX content
- `src/layouts/BaseLayout.astro` — zh-Hant-TW, dark-only theme, fixed header, footer with cycling quotes

## Conventions

- Path alias `@/*` → `src/*`
- Dark theme only via CSS custom properties in `global.css`
- Article filenames: `YYYY-MM-DD-slug.md` (date prefix convention)
- `draft: true` excludes from all listings but still built
- `collection` field in article frontmatter groups articles on the listing page
- Reading time: CJK-dominant → 500 chars/min, else → 200 words/min
- Truncation: 125 chars for CJK-dominant text, 250 otherwise

## Skills (`.agents/skills/`)

Installed from remote sources (see `skills-lock.json`). Load via `skill()` tool when relevant to the task.
