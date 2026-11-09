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

export type QuoteItem = CollectionEntry<'quotes'>['data']['categories'][number]['quotes'][number];
export interface QuoteCategory {
  name: string;
  quotes: QuoteItem[];
}

// Single YAML entry; category and quote order come straight from the file.
export async function getQuoteCategories(): Promise<QuoteCategory[]> {
  const entry = (await getCollection('quotes'))[0];
  const categories = entry?.data.categories ?? [];
  return categories.map((category) => ({
    name: category.name,
    quotes: category.quotes.filter((quote) => !quote.draft),
  }));
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
