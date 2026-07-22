import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildSearchIndex } from '../../lib/search';

export const prerender = true;

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const projects = await getCollection('projects');
  const index = buildSearchIndex(articles, projects);

  return new Response(JSON.stringify(index), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
