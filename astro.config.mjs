import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { mathMlPlugin } from './src/lib/mathml.ts';
import { alertsPlugin } from './src/lib/alerts.ts';

export default defineConfig({
  site: 'https://snow-viktor.pages.dev',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  experimental: {
    clientPrerender: true,
  },
  markdown: {
    processor: satteri({
      features: { math: true, rawHtml: true },
      mdastPlugins: [mathMlPlugin(), alertsPlugin()],
    })
  },
  // No `lastmod` option: the schema has no `updated` field yet, so any value
  // would just be build time for every page. Revisit when `updated` exists.
  integrations: [mdx(), sitemap()],
});
