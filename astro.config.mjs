import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [mdx(), sitemap()],
  prefetch: true,
  site: 'https://snow-viktor.pages.dev',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
