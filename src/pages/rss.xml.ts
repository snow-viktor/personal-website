import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedArticles } from '../lib/content';
import { truncate } from '../lib/utils';
import { SITE } from '../config';

// Prerendered feed of published articles, newest first (getPublishedArticles
// already sorts by date desc and excludes drafts). Description reuses the same
// stripMarkdown pipeline as the reading-time/search excerpts.
export async function GET(context: APIContext) {
  const articles = await getPublishedArticles();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    // @astrojs/rss emits trailing-slash links by default, matching the site.
    items: articles.map((article) => ({
      title: article.data.title,
      description: truncate(article.body ?? ''),
      pubDate: article.data.date,
      link: `/articles/${article.id}/`,
      categories: article.data.tags,
    })),
    customData: '<language>zh-TW</language>',
  });
}
