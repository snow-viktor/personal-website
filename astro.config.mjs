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
  integrations: [mdx(), sitemap()],
});
