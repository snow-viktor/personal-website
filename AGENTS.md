# personal-website

Astro 7.x static site, deployed to Cloudflare Pages (snow-viktor.pages.dev). No lint, typecheck, or test commands — `package.json` scripts are only `dev` / `build` / `preview` / `astro`.

## Skills (check before coding)

Load via the `skill` tool when the task matches — do this before writing code, not after. Skills live in `.agents/skills/` (gitignored; restore with `npx skills experimental_install` from `skills-lock.json`).

| Task | Skill |
|------|-------|
| New page/section, landing, portfolio look, redesign | `design-taste-frontend` (primary), `frontend-design` for visual direction |
| Polish, animation, micro-interactions, "feel" | `emil-design-eng` |
| Critique / audit / improve existing UI | `impeccable` |
| Accessibility / UX compliance review | `web-design-guidelines` |
| SEO, ranking, meta tags, Core Web Vitals | `seo-audit` |

If several match, load the most specific one first (e.g. polish → `emil-design-eng` over `impeccable`).

## Context files (read before UI work)

- `PRODUCT.md` — product truth (audience, archive-first principles, brand commitments). Don't invent bio/credentials/testimonials.
- `DESIGN.md` — normative design tokens + named rules (Solid Text, Atmosphere, Marker, One Accent). Update it when adding tokens/sizes; `impeccable detect` validates code against it (see Commands).

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | dev server with HMR |
| `npm run build` | static build to `dist/` |
| `npm run preview` | preview the build locally (run `build` first) |

Verify UI edits with the mechanical detector (must return `[]`):
`& ".agents\skills\impeccable\scripts\impeccable.cmd" detect --json src public`

## Structure

- `src/config.ts` — single source of truth for `SITE`, `NAV_LINKS`, `SOCIAL_LINKS`, `QUOTES`, `FONTS` (literals mirroring CSS vars for SVG/canvas renderers), `MATH` (Temml renderer options). Never hardcode these elsewhere.
- `src/content.config.ts` — Zod schemas: articles (title, date, tags, collection, draft), projects (+ `type`, `links[]`).
- `src/content/articles/` — MD/MDX with date-only filenames (`YYYY-MM-DD.md`, title from frontmatter); `src/content/projects/` — slug filenames (e.g. `wall-e.md`).
- `src/pages/articles/[...slug].astro` / `index.astro` — detail + listing (grouped by `collection`; index has a sticky category nav with scroll-spy, ordered exactly as the sections, ungrouped first).
- `src/pages/projects/index.astro` — flat ungrouped grid (no collection nav; projects group by nothing — schema has `type`, not `collection`). Detail has prev/next nav mirroring articles (pass `allProjects` through `getStaticPaths` props, same date-desc order).
- `src/pages/index.astro` — hero stretches under the fixed header (negative-margin + padding compensation pair) with ambient glow + staggered wordmark.
- `src/pages/api/search-index.json.ts` — pre-rendered JSON for client-side search (calls `getCollection` directly; draft filtering lives inside `buildSearchIndex`, not at the call site).
- `src/lib/` — `cjk.ts` (`isCjkChar()`), `content.ts` (`getPublishedArticles()`, `getPublishedProjects()`, `groupByCollection()`), `utils.ts` (reading time, truncate, strip), `search.ts` (index build), `search-client.ts` (browser tokenize/snippet/highlight).
- `src/components/mdx.ts` — default-export map `{ BookInfo }` for MDX content.
- Alerts (GitHub-style `> [!NOTE]` … `> [!CAUTION]`): `src/lib/alerts.ts` mdast plugin renders them at build time to semantic `<aside role="note">`; styles (`.markdown-alert*`) live in `src/styles/global.css` (global, unscoped — same reason as `.search-result*` below).
- Math (Temml → native MathML, zero client JS): `src/lib/mathml.ts` mdast plugin renders `$`/`$$` at build time with `MATH` options; styles vendored in `src/styles/temml-latin-modern.css` (loaded via `@import` in `global.css`); fonts self-hosted in `public/fonts/` (`latinmodernmath.woff2`, GUST license + `Temml.woff2`, MIT). To update Temml, re-copy `node_modules/temml/dist/Temml-Latin-Modern.css` and re-apply the two `/fonts/` URL rewrites.
- Diagrams (mermaid, client-rendered/lazy): global dark theme via `mermaid()` options in `astro.config.mjs` (uses `FONTS.sans`); per-diagram accent colors live in that diagram's `classDef`/`style` lines.
- `src/layouts/BaseLayout.astro` — zh-Hant-TW, dark-only, fixed header, cycling footer quotes; metadata (lang, og, JSON-LD, robots, twitter:card) all from `SITE`.

## Conventions

- Path alias `@/*` → `src/*`.
- Dark theme only via CSS custom properties in `global.css`.
- `draft: true` excludes everywhere — listings (`getPublished*`), detail `getStaticPaths`, and search index (`buildSearchIndex` skips drafts). No draft routes are built.
- Content access: always via `src/lib/content.ts`. No inline `getCollection()` draft filters or sort logic (only exception: `search-index.json.ts`, which delegates filtering to `buildSearchIndex`).
- CJK: `isCjkChar()` in `cjk.ts` is the only detector — no inline range checks. Reading time via `computeReadingTime()` (CJK-dominant: 500 chars/min, else 200 words/min). Truncate: 125 chars CJK vs 250 Latin. Plain-text excerpts via `stripMarkdown()` (full strip: frontmatter, fences, math, HTML, links/images, blockquote/alert/heading/list markers, emphasis); `stripForReading()` delegates to it — never strip inline with ad-hoc regexes.
- App config goes in `src/config.ts`, never `astro.config.mjs` (Astro-only: integrations, `site` for sitemap). Exception: `astro.config.mjs` may import literals (e.g. `FONTS`) from `src/config.ts` for integration options — keep the literal in `config.ts`, only wire it in the config.
- Design system (mirrors `DESIGN.md`, enforced by `detect`): no gradient text (emphasis = weight/size); no one-sided accent bars on cards/callouts (full 1px tinted border instead); green = collection, orange = actions/links. Gradients live in ambient surfaces only.
- Collection nav: text links (never pills), scroll-spy via IntersectionObserver (no scroll listeners), anchored groups need `scroll-margin-top` clearing both sticky bars.
- Dates display via `Intl.DateTimeFormat('zh-TW')` (`formatDate()`); keep ISO in `datetime` attributes.

## Gotchas

- `trailingSlash: 'always'` — all internal links must end with `/` (`/articles/slug/`).
- MDX detail pages must render `<Content components={components} />` (import map from `src/components/mdx`) — without it, custom tags (`BookInfo`) throw at render time.
- Search results render via `innerHTML` in `search.astro`, so `.search-result*` styles must live in `src/styles/global.css` (global, unscoped). Astro-scoped `<style>` never applies to injected nodes.
- `search-client.ts` runs in the browser (Vite-bundled, may import `cjk.ts`). Never import server-only modules from client `<script>` blocks.
- `.impeccable/config.json` holds shared detector ignores (e.g. the file-scoped `design-system-font` waiver for vendored Temml CSS) — commit it. Per-developer overrides live in `.impeccable/config.local.json`, already covered by `*.local` in `.gitignore`.
