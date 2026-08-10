import { getCollection, type CollectionEntry } from 'astro:content';

type ArticleEntry = CollectionEntry<'articles'>;
type ProjectEntry = CollectionEntry<'projects'>;

export async function getPublishedArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return articles;
}

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  projects.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return projects;
}

export function groupByCollection(articles: ArticleEntry[]) {
  const grouped = new Map<string, ArticleEntry[]>();
  const ungrouped: ArticleEntry[] = [];

  for (const article of articles) {
    if (article.data.collection) {
      const col = article.data.collection;
      if (!grouped.has(col)) grouped.set(col, []);
      grouped.get(col)!.push(article);
    } else {
      ungrouped.push(article);
    }
  }

  return { grouped, ungrouped };
}
