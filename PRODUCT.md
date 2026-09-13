# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Personal website of SnowViktor (彬彬). Readers are people interested in the author's writing: school diary entries, book notes, and reflections on everyday life, media, and language. _Audience details inferred from content; not confirmed with the author._

## Product Purpose

A long-running personal archive and public notebook. The author writes regularly (73 articles, 2023–2025) in Traditional Chinese (zh-Hant-TW). Success means the writing stays readable, findable (client-side search), and preserved as a coherent body of work — not traffic growth.

## Positioning

A student's homework-diary-turned-personal-site: the core collection「聯絡簿日記」 (contact-book diary) plus book notes with structured bibliographic headers (`BookInfo`) and GitHub-style alert callouts (`> [!NOTE]` … `> [!CAUTION]`). The differentiator is the archive itself — dated, tagged, collection-grouped writing — not tooling.

## Operating Context

- Content is Markdown/MDX in `src/content/articles/` (file name `YYYY-MM-DD-slug`), one project in `src/content/projects/`.
- Readers browse latest → collections → article, or use `/search/` (MiniSearch over a pre-rendered JSON index).
- Deployed as a static build to Cloudflare Pages (`https://snow-viktor.pages.dev`).

## Capabilities and Constraints

- Static Astro 7.x build; no backend, no auth, no comments.
- Dark-only theme; Traditional Chinese primary, some English-quoted material.
- `draft: true` excludes from listings but still builds.
- `trailingSlash: 'always'` — internal links end with `/`, except static files in `public/` which resolve without one.
- Open decisions: whether the author wants an audience-facing bio/about page; whether article images need build-time sizing.

## Brand Commitments

- Name `SnowViktor` + nickname `彬彬`; mono-spaced nav, serif CJK headings, warm dark palette (burnt-orange accent `#e48a4a`, gold `#d4a060`, muted blue `#7a9ec0`).
- Voice: personal, reflective, student-notebook tone. Do not invent testimonials, credentials, or professional claims.
- Footer cycling quotes (`QUOTES` in `src/config.ts`); playful details (WALL-E ASCII in `robots.txt`, rickroll on 404) are intentional — preserve them.

## Evidence on Hand

- 73 published articles (`src/content/articles/`), 1 project (`wall-e`), site copy in `src/pages/` and `src/config.ts`.
- No analytics, no Search Console access, no stated SEO targets.

## Product Principles

1. The archive is the product: every change must keep old entries readable and reachable.
2. Restraint over decoration: the writing carries the page; chrome stays quiet.
3. Honest provenance: dates, tags, and collections are real metadata — never fabricate content about the author.
4. Static-first: prefer build-time solutions over client runtime.

## Accessibility & Inclusion

No author-stated standard. Baseline applied in this repo: keyboard-reachable content with visible focus, skip link, `prefers-reduced-motion` respected for auto-motion, zh-Hant-TW lang tagging.
