# personal-website

Astro 7 site deployed to Cloudflare Pages (`snow-viktor.pages.dev`).

## Commands

```
npm run dev       # astro dev
npm run build     # astro build
npm run preview   # astro preview
npm run astro     # passthrough
```

No test/lint/typecheck scripts defined. Relies on `astro/tsconfigs/strict` for type checking via editor/IDE.

## Content

Two collections defined in `src/content.config.ts`:
- `articles` — MD/MDX in `src/content/articles/`
- `projects` — MD/MDX in `src/content/projects/`

Both use `z.coerce.date()` for `date` field. Articles use `astro:content` `glob` loader with pattern `**/*.{md,mdx}`.

## Config

- `tsconfig.json` — path alias `@/*` → `src/*` (not used in current code; all imports are relative)
- `astro.config.mjs` — `trailingSlash: 'never'`, MDX + sitemap integrations
- Site language: `zh-Hant-TW`

## Style

- Dark theme via CSS custom properties in `src/styles/global.css`
- Scoped `<style>` per component (Astro convention)
- CSS nesting used throughout
- Content articles use `ArticleLayout`; projects use `BaseLayout`

## Search

Client-side search using MiniSearch. Pre-built index at `/api/search-index.json` (prerendered JSON endpoint). CJK tokenizer with `Intl.Segmenter` + bigram fallback. Triggered by `Cmd+K`/`Ctrl+K`.

## License

- Code: MIT (see `LICENSE` and `public/MIT`)
- Content: CC BY-NC 4.0 (see `LICENSE-CC-BY-NC-4.0` and `public/CC-BY-NC-4.0`)
