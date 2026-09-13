import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import mermaid from 'astro-mermaid';
import { mathMlPlugin } from './src/lib/mathml.ts';
import { alertsPlugin } from './src/lib/alerts.ts';
import { FONTS } from './src/config.ts';

export default defineConfig({
  site: 'https://snow-viktor.pages.dev',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  prefetch: true,
  markdown: {
    processor: satteri({
      features: { math: true, rawHtml: true },
      mdastPlugins: [mathMlPlugin(), alertsPlugin()],
    })
  },
  integrations: [mermaid({
    // Dark-only site: base theme + paper text on transparent ground.
    // Diagram-specific colors stay in each diagram's classDef/style lines.
    theme: 'base',
    mermaidConfig: {
      themeVariables: {
        background: 'transparent',
        fontFamily: FONTS.sans,
        primaryTextColor: '#ededf0',
        lineColor: '#7e7e8b',
        titleColor: '#aeaeba',
      },
    },
  }), mdx(), sitemap()],
  vite: {
    build: {
      // mermaid is large but already lazy-loaded via dynamic import()
      // (see astro-mermaid hasMermaidDiagrams guard), so raise the
      // warning threshold instead of re-chunking.
      chunkSizeWarningLimit: 1000,
    },
  },
});
