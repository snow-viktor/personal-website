# personal-website

Astro 7.x static site (`format: 'directory'`, no adapter), deployed to Cloudflare Pages (snow-viktor.pages.dev). Node is pinned via `.node-version` (24). Scripts are only `dev` / `build` / `preview` / `astro` — no lint, typecheck, or tests (`astro check` would prompt to install `@astrojs/check` + `typescript`, neither is a dependency). No CI workflows, no `opencode.json`.

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

- `PRODUCT.md` — product truth (audience, archive-first principles). Don't invent bio/credentials/testimonials.
- `DESIGN.md` — normative tokens + named rules (Solid Text, Atmosphere, Marker, One Accent, Serif Voice, Flat-By-Default). Update it when adding tokens/sizes.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | dev server with HMR |
| `npm run build` | static build to `dist/` |
| `npm run preview` | preview build locally (run `build` first) |

Verify UI edits with the detector (must return `[]`):
`& ".agents\skills\impeccable\scripts\impeccable.cmd" detect --json src public`

No test suite exists — a clean `npm run build` is the only correctness check, and it is where MDX custom-tag errors and content-schema mistakes surface (the dev server won't catch them).

## Commits

- Subject: imperative, capitalized, no period, ≤ 72 chars, names the primary change only. No version bump in the subject.
- Blank line, then one `- ` bullet per change group (also ≤ 72 chars per line), imperative mood.
- Version bumps land in the body (e.g. `- Bump version to 1.2.3`); `version` in `package.json` is the only place (no changelog).
- Prefer specific verbs (`Add`, `Fix`, `Replace`, `Refactor`, `Remove`) over vague ones (`update`, `misc fixes`); name the object.

## Structure

### Config & content

- `src/config.ts` — single source of truth for `SITE`, `NAV_LINKS`, `SOCIAL_LINKS`, `QUOTES`, `MATH`. `FONTS` only mirrors the `--font-*` vars in `global.css` (nothing imports it — CSS is authoritative, keep both in sync). `astro.config.mjs` holds Astro-only settings (`site`, integrations, markdown processor).
- `src/content.config.ts` — Zod schemas: articles (title, date, tags, `collection?`, draft), projects (+ `type`, `links[]` — no `collection`).
- `src/content/articles/` — flat files, mostly `YYYY-MM-DD.md` plus slug-named `.md`/`.mdx`; filename minus extension is the route slug (`article.id` in `[...slug].astro`). `src/content/projects/` — slug filenames (e.g. `wall-e.md`).

### Pages

- Articles index groups by `collection` with a sticky category nav (scroll-spy via IntersectionObserver, text links never pills, ungrouped first, nav order mirrors section order). Projects index is a flat ungrouped grid.
- Detail prev/next: both `[...slug].astro` routes build only published entries via `getPublished*()` and pass the full date-desc list (`allArticles` / `allProjects`) through `getStaticPaths` props.
- Search is fully client-side: `/search/` fetches the prerendered `/api/search-index.json` and lazy-imports MiniSearch in a `<script>`.

### Lib

- `src/lib/content.ts` is the only content entrypoint (`getPublishedArticles()`, `getPublishedProjects()`, `groupByCollection()`). Exception: `src/pages/api/search-index.json.ts` calls `getCollection` directly; draft filtering lives inside `buildSearchIndex` (`src/lib/search.ts`).
- `src/lib/utils.ts` + `cjk.ts` — `isCjkChar()` is the only CJK detector; `computeReadingTime()`, `truncate()`, `stripMarkdown()` / `stripForReading()`, `formatDate()` (`Intl.DateTimeFormat('zh-TW')`, ISO in `datetime`). Never strip markdown inline with ad-hoc regexes.
- `src/lib/search-client.ts` runs in the browser (may import `cjk.ts` only). Never import server-only modules from client `<script>` blocks — `search.astro`'s `import type { SearchDoc } from '../lib/search'` is type-only (erased at build), not a violation.

### Markdown pipeline (build-time, zero client JS)

- Alerts (`src/lib/alerts.ts`) and math (`src/lib/mathml.ts`) are mdast plugins wired in `astro.config.mjs` via satteri `mdastPlugins`. Alert styles (`.markdown-alert*`) and search-result styles (`.search-result*`, injected via `innerHTML`) must live in `src/styles/global.css` (global, unscoped).

### Fonts & math

- Self-hosted via Fontsource npm packages (variable where available; `unicode-range` slices; never hand-write `@font-face`). CSS imports scope font CSS to the pages that use them — keep it that way:
  - `BaseLayout.astro`: `@fontsource-variable/noto-sans`, `noto-serif`, `noto-sans-tc`, `noto-serif-tc`, `@fontsource/cascadia-mono` 400+700.
  - `ArticleLayout.astro`: `@fontsource/iansui` (`free verse` bodies only; headings/metadata keep their faces).
  - Any page/MDX using `<div lang="ja">` must import `@fontsource-variable/noto-sans-jp` (currently only the HSNU anthem project MDX). Japanese passages use `<div lang="ja">` + `<ruby>` furigana; `:lang(ja)` applies `--font-ja` (mirrors `--font` with TC → JP, no non-Noto platform JP fonts).
- Math: pre-rendered Temml → MathML; fonts (Latin Modern Math + Temml) live in `public/fonts/`, loading lazily only on pages that render `<math>`. Styles vendored in `src/styles/temml-latin-modern.css` (`@import`ed by `global.css`, currently temml@0.14.0); it contains no font URLs — the math `@font-face` declarations live in `global.css` — so updating Temml is a plain re-copy of `node_modules/temml/dist/Temml-Latin-Modern.css`, then bump the version in the header comment.
- Font stack order matters and is intentional (see `DESIGN.md` Typography): Latin Noto Sans/Serif (system name, then its Fontsource Variable) precede the CJK entries — the Latin webfont's `unicode-range` keeps it scoped to Latin codepoints, and the CJK TC/JP slices also contain Latin glyphs, so a Latin entry placed after the CJK ones is dead code. Keep `global.css`, `FONTS` in `config.ts`, and `DESIGN.md` tokens in sync (three copies).

### Assets & MDX

- Diagrams are hand-authored `.svg` in `src/assets/`, imported directly in MDX inside `<figure class="diagram">` (vertical flow only; the dependency is restated as prose below the figure). Accessibility (`role="img"` + `<title>` via `aria-labelledby`) lives inside the SVG source itself, not on the figure — new diagrams must set it there. No wrapper component, no `mdx.ts` registration. Photos go in the same folder but render via `<Image />` from `astro:assets`.
- `src/components/mdx.ts` default-exports `{ BookInfo, MidiPlayer }` for MDX; `src/layouts/BaseLayout.astro` owns lang (`zh-Hant-TW`), dark-only chrome, and all metadata from `SITE`.

## Conventions

- Path alias `@/*` → `src/*`. Dark theme only, via CSS vars in `global.css`.
- `draft: true` excludes everywhere — listings, detail `getStaticPaths` (no draft routes built), search index.
- Design system mirrors `DESIGN.md` (enforced by `detect`): no gradient text; no one-sided accent bars (full 1px tinted border); orange = actions/links, gold = metadata, green = collection, blue = book-note context; gradients in ambient surfaces only.
- Anchored groups need `scroll-margin-top` clearing both sticky bars (header + collection nav).
- Astro prefetch is on for all internal links (hover strategy) plus `experimental.clientPrerender`; nav links carry `data-astro-prefetch`. Don't hand-roll prefetching or strip these settings when editing `astro.config.mjs`.

## Gotchas

- `trailingSlash: 'always'` — all internal links end with `/` (`/articles/slug/`).
- MDX detail pages must render `<Content components={components} />` — without the map, custom tags (`BookInfo`) throw at render time.
- `.impeccable/config.json` holds shared detector ignores (e.g. file-scoped `design-system-font` waiver for vendored Temml CSS) — commit it. Per-developer overrides live in `.impeccable/config.local.json` (covered by `*.local` in `.gitignore`).
- `astro.config.mjs` imports `@astrojs/markdown-satteri`, which is absent from `package.json` — a phantom dep that resolves only via npm hoisting from `astro`'s own dependencies. If the import breaks after an Astro upgrade, install `@astrojs/markdown-satteri` explicitly.
- `package.json` has no `allowScripts` field (npm's official install-script allowlist — no deps currently carry install scripts). If `npm install` warns about one, audit it and approve with `npm approve-scripts <pkg> --no-allow-scripts-pin` (never version-pinned entries) or clean stale entries with `npm install-scripts prune`.
