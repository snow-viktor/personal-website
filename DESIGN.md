---
name: SnowViktor personal website
description: Warm dark notebook — quiet chrome, amber accents, serif CJK voice.
colors:
  bg: "#0f0f11"
  bg-surface: "#131316"
  bg-card: "#17171b"
  text: "#ededf0"
  text-muted: "#aeaeba"
  text-dim: "#7e7e8b"
  accent: "#e48a4a"
  accent-hover: "#ea944e"
  accent-gold: "#d4a060"
  accent-blue: "#7a9ec0"
  accent-green: "#7aaa7a"
  text-code: "#b4d4ac"
  border: "#363640"
  border-subtle: "#2a2a32"
  border-accent: "#42424d"
  mark-text: "#d6e4ef"
  hover-shadow: "rgba(0, 0, 0, 0.3)"
typography:
  display:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "clamp(2.5rem, 1rem + 8vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  display-404:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "6rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Noto Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "'Noto Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
  caption:
    fontFamily: "'Noto Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    letterSpacing: "0.08em"
  badge:
    fontFamily: "'Noto Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.05em"
  meta:
    fontFamily: "'Noto Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
  small:
    fontFamily: "'Noto Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  note:
    fontFamily: "'Noto Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
  base:
    fontFamily: "'Noto Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  quote:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  quote-mark:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1
  section:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
  section-sm:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  headline-sm:
    fontFamily: "'Noto Serif CJK TC', 'Noto Serif TC', serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.3
  mono:
    fontFamily: "'Cascadia Mono', monospace"
    fontSize: "0.875em"
  math:
    fontFamily: "'Latin Modern Math', 'Temml', math"
    fontSize: "1.02em"
rounded:
  sm: "4px"
  md: "8px"
  pill: "100px"
spacing:
  container: "0 1.5rem"
  section: "3rem"
  card: "1.25rem"
components:
  card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.card}"
  tag:
    backgroundColor: "{colors.border}"
    textColor: "{colors.accent-gold}"
    rounded: "{rounded.pill}"
  type-badge:
    backgroundColor: "{colors.accent-green}"
    textColor: "{colors.accent-green}"
    rounded: "{rounded.pill}"
  search-input:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
  skip-link:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
---

# Design System: SnowViktor personal website

<!-- SCAN: extracted from src/styles/global.css, components, and pages after the 2026-09 polish pass. Qualitative names are descriptive, not user-confirmed. -->

## Overview

**Creative North Star: "The Warm Dark Notebook"**

A quiet, warm-dark reading surface where student-notebook writing is the entire point. Chrome recedes: one fixed hairline header, borderless text-first cards, and three amber-family accents used sparingly as metadata color, never as decoration. Serif CJK headings over a neutral sans body give the diary/essay content an editorial voice; monospace is reserved for navigation chrome and code. Playful details (WALL-E robots.txt, footer quote rotation, rickroll 404) are part of the identity — preserve them.

**Key Characteristics:**
- Dark-only, warm neutrals with amber/orange/gold/blue-green accents.
- Text-first cards; depth on hover only (lift + border shift).
- Serif display + sans body + mono chrome.

## Colors

Warm dark neutrals carry the page; three muted accents mark meaning (links/actions, metadata, book/type context).

### Primary
- **Burnt Orange** (#e48a4a, hover #ea944e): Links, primary actions, hover states, focus rings. The only accent allowed on interactive chrome.

### Secondary
- **Muted Gold** (#d4a060): Dates, bylines, metadata, tags. Secondary information color.
- **Dusty Blue** (#7a9ec0): Book-note context (`BookInfo` background tint), informational `Note` variant.
- **Sage Green** (#7aaa7a): Collection marks, project type badges.

### Neutral
- **Ink** (#0f0f11): Page background (also `theme-color`).
- **Raised Surface** (#131316): Inline code background.
- **Card Surface** (#17171b): Cards, search input, code blocks.
- **Paper Text** (#ededf0): Body text.
- **Muted Text** (#aeaeba): Summaries, descriptions.
- **Dim Text** (#7e7e8b): Tertiary labels, placeholders, footer.
- **Hairlines** (#363640 borders, #2a2a32 subtle, #42424d accent): Structure only, never decoration.

### Named Rules
**The Solid Text Rule.** No gradient text anywhere; emphasis comes from weight or size. (Settled in the 2026-09 de-slop pass.)
**The One Accent Rule.** One accent per element: an orange link never also carries a gold underline; metadata picks gold *or* green, not both.
**The Atmosphere Rule.** Gradients live in ambient surfaces only — currently the homepage hero glow (three layered brand-hue radials: orange 28%, blue 20%, gold 15%, all fading to transparent). The hero stretches under the fixed header so the glow meets the nav's bottom edge through its translucent blur. Never on type, never page-wide, never animated.
**The Marker Rule.** The hero name's tail ("Viktor") carries a hand-marker highlight sweep (accent orange at 32%, hard stop, bottom third only). Highlights sit *behind* type; they never recolor it.

## Typography

**Display Font:** Noto Serif CJK TC (with Noto Serif TC fallback)
**Body Font:** Noto Sans (with Noto Sans CJK TC fallback)
**Label/Mono Font:** Cascadia Mono — navigation, logo-adjacent chrome, code only.

**Character:** Editorial serif for headings and quotes; calm high-legibility sans for body at a relaxed 1.7–1.8 line height suited to long CJK reading.

### Hierarchy
- **Display** (700, 3rem/2.25rem mobile, 1.1): Homepage hero name and 404 code only.
- **Headline** (600, 2.25rem, 1.3): Page/article `h1`.
- **Title** (600, 1.125rem, 1.3): Card titles, `h3`.
- **Body** (400, 1.0625rem, 1.7–1.8): Article and summary text.
- **Label** (600–700, 0.6875–0.8125rem, 0.05–0.08em tracking, uppercase for Latin): Section headers, badges, alert labels, nav active states.

### Named Rules
**The Serif Voice Rule.** Headings, quotes, and result titles are always serif; UI chrome and metadata are never serif.

## Layout

Narrow reading measure: 720px content column (`--max-width`), 960px for listings (`--max-width-wide`), 1.5rem gutters (1rem mobile). Homepage stacks one-column article cards and a two-column project grid collapsing to one column under 640px. Sections separate generously (3rem); related groups sit tight (0.75rem gaps). One breakpoint at 640px. Dates render `YYYY/MM/DD` via `Intl.DateTimeFormat('zh-TW')` with ISO `datetime` attributes.

## Elevation & Depth

Flat by default; depth is a hover response, not a resting state. Cards rest on tonal layering (card surface + 1px subtle border). On hover: border shifts to accent, 2px lift, soft black shadow (`0 4px 20px rgba(0,0,0,0.3)`).

### Named Rules
**The Flat-By-Default Rule.** Shadows appear only on hover/focus. Never a resting shadow under a border.

## Shapes

Gently rounded rects: 8px cards and inputs, 4px code and small elements, pills (100px) reserved for tags, badges, and the 404 home button. Callouts (markdown alerts, `BookInfo`) use a full 1px tinted border on a muted tint background — never a one-sided accent bar.

## Components

### Cards (ArticleCard, ProjectCard)
- **Character:** Quiet containers; content typeset, not decorated.
- **Shape:** 8px radius, 1.25rem padding, 1px subtle border.
- **Hover:** Accent border, translateY(-2px), soft shadow. Title color inherits (no color jump).
- **Motion:** Scroll-linked `card-reveal` (opacity/translate, `animation-timeline: view()`), guarded by `prefers-reduced-motion`.

### Tags / Type badges
- **Tags:** Pill, neutral border-color fill, gold text, 0.75rem. Max 4 per card.
- **Type badges:** Pill, green tint fill, 1px green-mix border, uppercase 0.6875rem.

### Blockquote
- **Character:** Editorial aside, not a callout.
- **Style:** No border; a 2px gold vertical rule left of the content, italic muted text.

### Alerts (NOTE/TIP/IMPORTANT/WARNING/CAUTION)
- **Source:** GitHub-style `> [!NOTE]` blockquotes, transformed at build time by `src/lib/alerts.ts` into semantic `<aside role="note">` (an alert is not a quotation, so never `<blockquote>`).
- **Style:** Full 1px border in the variant color at 35% mix over its muted tint; tiny uppercase label naming the variant. NOTE/IMPORTANT share info-blue, TIP is gold, WARNING/CAUTION share caution-orange.

### BookInfo
- **Style:** Dusty-blue tint panel, full 1px blue-mix border; author in gold, title serif semibold, publisher/date/ISBN as dim `．`-joined detail line.

### Math
- **Character:** Pre-rendered Temml MathML (zero client JS), inherits body text color so the dark theme is free.
- **Style:** Latin Modern Math (`--font-math`) at 1.02em for optical match to body; `Temml.woff2` covers `\mathscr` + prime alignment. Structural correction rules vendored in `src/styles/temml-latin-modern.css` (loaded via `@import` in `global.css`); fonts self-hosted in `public/fonts/`. Display math scrolls horizontally on overflow.

### Diagrams (mermaid)
- **Character:** Client-rendered SVG figures; quiet like everything else.
- **Style:** Global `base` theme from `astro.config.mjs` — transparent ground, body sans (`FONTS.sans` in `src/config.ts`, mirrors `--font`), paper text, dim edges. Per-diagram accent colors stay in that diagram's `classDef`/`style` lines.

### Navigation
- **Header:** Fixed, 2.75rem, 50%-transparent bg blur over hairline bottom border; mono type; muted links, full-text on hover/active. Mobile collapses Search to icon-only (label hidden, icon retained with `aria-label` intact on the link text).
- **Skip link:** Off-canvas until `:focus-visible`, then solid paper-on-ink pill top-left.
- **Footer:** Social icons (labeled, dim → accent on hover), rotating quote (10s, pauses on hover/focus, static under reduced-motion), license line.

### Collection nav (articles index)
- **Character:** Sticky category jump-list; the page's table of contents. Ordered exactly as the sections below (ungrouped first); no "all" entry — it is not a category.
- **Style:** Sticks under the fixed header (`top: 2.75rem`) with blur and a hairline bottom border, mirroring the header bar. Items are quiet text links (muted → paper on hover, collection-green with an underline bar when active — green is the system's collection color, matching `ArticleCard` marks), never pills. Active section tracked by IntersectionObserver scroll-spy; without JS the items are plain anchor links. Anchored groups carry `scroll-margin-top` clearing both bars.

### Search input
- **Style:** Card-surface fill, 1px border, 8px radius; placeholder ends with `…`, `autocomplete="off"`, `spellcheck="false"`, `aria-label` + polite live status line.
- **Focus:** Accent border plus 2px accent `:focus-visible` outline (never `outline: none` alone).

## Do's and Don'ts

### Do:
- **Do** keep new surfaces to the three accents with their fixed meanings (orange = action, gold = metadata, blue/green = context).
- **Do** use `src/lib/content.ts` + `isCjkChar()`-based helpers for any listing, date, or reading-time work.
- **Do** put styles for JS-injected nodes (search results) in `src/styles/global.css`, unscoped.
- **Do** end internal links with `/`, except `public/` static files.

### Don't:
- **Don't** use gradient text, one-sided accent bars, kickers/eyebrows, or hard offset shadows — removed deliberately in 2026-09.
- **Don't** add resting shadows, nested cards, or a second breakpoint without a measured reason.
- **Don't** invent author biography, credentials, or testimonials in copy.
- **Don't** import server-only modules into client `<script>` blocks.
