import type { CollectionEntry } from 'astro:content';
import { stripMarkdown } from './utils';

export interface SearchDoc {
  id: string;
  title: string;
  body: string;
  type: 'article' | 'project';
  url: string;
  tags: string[];
  date: string;
}

export function buildSearchIndex(
  articles: CollectionEntry<'articles'>[],
  projects: CollectionEntry<'projects'>[]
): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const article of articles) {
    if (article.data.draft) continue;
    docs.push({
      id: `article-${article.id}`,
      title: article.data.title,
      body: stripMarkdown(article.body ?? ''),
      type: 'article',
      url: `/articles/${article.id}/`,
      tags: article.data.tags,
      date: article.data.date.toISOString(),
    });
  }

  for (const project of projects) {
    if (project.data.draft) continue;
    docs.push({
      id: `project-${project.id}`,
      title: project.data.title,
      body: stripMarkdown(project.body ?? ''),
      type: 'project',
      url: `/projects/${project.id}/`,
      tags: project.data.tags,
      date: project.data.date.toISOString(),
    });
  }

  return docs;
}
