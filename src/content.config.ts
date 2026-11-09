import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    collection: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.string(),
    tags: z.array(z.string()).optional().default([]),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        })
      )
      .optional()
      .default([]),
    draft: z.boolean().optional().default(false),
  }),
});

const quoteItem = z.object({
  text: z.string(),
  source: z.string().optional(),
  lang: z.enum(['zh', 'en']).optional().default('zh'),
  footer: z.boolean().optional().default(false),
  draft: z.boolean().optional().default(false),
});

const quotes = defineCollection({
  loader: file('./src/content/quotes.yaml'),
  schema: z.object({
    // Category order = display order; quote order = authoring order. No ids.
    categories: z.array(
      z.object({
        name: z.string(),
        quotes: z.array(quoteItem).optional().default([]),
      })
    ),
  }),
});

export const collections = { articles, projects, quotes };
