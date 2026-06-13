import { createClient } from '@supabase/supabase-js';

export type ArticleCategory = 'trip-blog' | 'cruise-news' | 'deal' | 'shop-announcement';

export const CATEGORY_META: Record<ArticleCategory, { label: string; textColor: string; bgColor: string; description: string }> = {
  'trip-blog': {
    label: 'Trip Blog',
    textColor: 'text-white',
    bgColor: 'bg-[#10755A]',
    description: 'Personal stories and first-hand experiences from Yolanda\'s sailings.',
  },
  'cruise-news': {
    label: 'Cruise News',
    textColor: 'text-white',
    bgColor: 'bg-[#1F2D86]',
    description: 'Industry updates, new ships, itinerary changes, and what\'s trending.',
  },
  'deal': {
    label: 'Deal',
    textColor: 'text-white',
    bgColor: 'bg-[#F26A75]',
    description: 'Time-sensitive cruise deals, flash sales, and promotions worth knowing about.',
  },
  'shop-announcement': {
    label: 'Shop',
    textColor: 'text-[#1A2E2A]',
    bgColor: 'bg-[#f59e0b]',
    description: 'New merch drops, restocks, and Travelholics shop updates.',
  },
};

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] }
  | { type: 'img'; src: string; alt: string; caption?: string }
  | { type: 'divider' };

export interface Article {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  body: Block[];
  category: ArticleCategory;
  author: string;
  cover_image: string | null;
  cover_alt: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  deal_expires_at: string | null;
  deal_original_price: string | null;
  deal_sale_price: string | null;
  cta_label: string | null;
  cta_url: string | null;
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function getArticles(options?: {
  category?: ArticleCategory;
  limit?: number;
  featured?: boolean;
}): Promise<Article[]> {
  const client = getClient();
  if (!client) return [];

  let query = client
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (options?.category) query = query.eq('category', options.category);
  if (options?.featured !== undefined) query = query.eq('featured', options.featured);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;
  return data as Article;
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('articles')
    .select('slug')
    .eq('published', true);

  if (error || !data) return [];
  return data.map((row: { slug: string }) => row.slug);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function estimateReadTime(body: Block[]): number {
  const words = body.reduce((acc, block) => {
    if ('text' in block) return acc + block.text.split(/\s+/).length;
    if ('items' in block) return acc + block.items.join(' ').split(/\s+/).length;
    return acc;
  }, 0);
  return Math.max(1, Math.ceil(words / 200));
}

export function isDealExpired(article: Article): boolean {
  if (!article.deal_expires_at) return false;
  return new Date(article.deal_expires_at) < new Date();
}

export function dealDaysLeft(article: Article): number | null {
  if (!article.deal_expires_at) return null;
  const diff = new Date(article.deal_expires_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
