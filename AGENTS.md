# personal-website

Astro 7.x static site, deployed to Cloudflare Pages (snow-viktor.pages.dev). Scripts are only `dev` / `build` / `preview` / `astro` — no lint, typecheck, or tests.

## Skills (load before coding, most specific first)

Skills live in `.agents/skills/` (gitignored; restore with `npx skills experimental_install` from `skills-lock.json`).

| Task | Skill |
|------|-------|
| New page/section, landing, portfolio look, redesign | `design-taste-frontend` (primary), `frontend-design` for visual direction |
| Polish, animation, micro-interactions, "feel" | `emil-design-eng` |
| Critique / audit / improve existing UI | `impeccable` |
| Accessibility / UX compliance review | `web-design-guidelines` |
| SEO, ranking, meta tags, Core Web Vitals | `seo-audit` |

## Context files (read before UI work)

- `PRODUCT.md` — product truth (audience, archive-first principles). Don't invent bio/credentials/testimonials. Note: its `draft` and filename claims are stale (see below).
- `DESIGN.md` — normative tokens + named rules (Solid Text, Atmosphere, Marker, One Accent, Serif Voice, Flat-By-Default). Update it when adding tokens/sizes.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | dev server with HMR |
| `npm run build` | static build to `dist/` |
| `npm run preview` | preview build locally (run `build` first) |

Verify UI edits with the detector (must return `[]`):
`& ".agents\skills\impeccable\scripts\impeccable.cmd" detect --json src public`

## Structure

- `src/config.ts` — single source of truth for `SITE`, `NAV_LINKS`, `SOCIAL_LINKS`, `QUOTES`, `FONTS`, `MATH`. Never hardcode these elsewhere; `astro.config.mjs` holds Astro-only settings (`site`, plugins, integrations).
- `src/content.config.ts` — Zod schemas: articles (title, date, tags, `collection?`, draft), projects (+ `type`, `links[]` — no `collection`).
- `src/content/articles/` — date-only filenames (`YYYY-MM-DD.md`, title from frontmatter); `src/content/projects/` — slug filenames (e.g. `wall-e.md`).
- Articles index groups by `collection` with a sticky category nav (scroll-spy via IntersectionObserver, text links never pills, ungrouped first, nav order mirrors section order). Projects index is a flat ungrouped grid.
- Detail prev/next: projects pass `allProjects` (date-desc) through `getStaticPaths` props, mirroring articles.
- `src/lib/content.ts` is the only content entrypoint (`getPublishedArticles()`, `getPublishedProjects()`, `groupByCollection()`). Exception: `src/pages/api/search-index.json.ts` calls `getCollection` directly; draft filtering lives inside `buildSearchIndex`.
- `src/lib/utils.ts` + `cjk.ts` — `isCjkChar()` is the only CJK detector; `computeReadingTime()`, `truncate()`, `stripMarkdown()` / `stripForReading()`, `formatDate()` (`Intl.DateTimeFormat('zh-TW')`, ISO in `datetime`). Never strip inline with ad-hoc regexes.
- Alerts (`src/lib/alerts.ts`), math (`src/lib/mathml.ts`) are build-time mdast plugins (wired in `astro.config.mjs`), zero client JS. Alert styles (`.markdown-alert*`) and search-result styles (`.search-result*`, injected via `innerHTML`) must live in `src/styles/global.css` (global, unscoped).
- Math styles vendored in `src/styles/temml-latin-modern.css` (`@import`ed by `global.css`); fonts self-hosted in `public/fonts/`. To update Temml, re-copy `node_modules/temml/dist/Temml-Latin-Modern.css` and re-apply the two `/fonts/` URL rewrites.
- Diagrams are hand-authored `.svg` in `src/assets/`, imported directly in MDX inside `<figure class="diagram">` (`role="img"` + `<title>`, vertical flow only, dependency restated as prose below). No wrapper component, no `mdx.ts` registration. Photos go in the same folder but render via `<Image />` from `astro:assets`.
- `src/components/mdx.ts` default-exports `{ BookInfo }` for MDX; `src/layouts/BaseLayout.astro` owns lang (`zh-Hant-TW`), dark-only chrome, and all metadata from `SITE`.

## Conventions

- Path alias `@/*` → `src/*`. Dark theme only via CSS vars in `global.css`.
- `draft: true` excludes everywhere — listings, detail `getStaticPaths` (no draft routes built), search index.
- Design system mirrors `DESIGN.md` (enforced by `detect`): no gradient text; no one-sided accent bars (full 1px tinted border); orange = actions/links, gold = metadata, green = collection, blue = book-note context; gradients in ambient surfaces only.
- Anchored groups need `scroll-margin-top` clearing both sticky bars (header + collection nav).
- `search-client.ts` runs in the browser (may import `cjk.ts` only). Never import server-only modules from client `<script>` blocks.

## Gotchas

- `trailingSlash: 'always'` — all internal links end with `/` (`/articles/slug/`).
- MDX detail pages must render `<Content components={components} />` — without the map, custom tags (`BookInfo`) throw at render time.
- `.impeccable/config.json` holds shared detector ignores (e.g. file-scoped `design-system-font` waiver for vendored Temml CSS) — commit it. Per-developer overrides live in `.impeccable/config.local.json` (covered by `*.local` in `.gitignore`).
