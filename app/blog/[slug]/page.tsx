import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Tag, AlertTriangle, ExternalLink } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArticleBody } from '@/components/article-body';
import { ArticleNewsletterCta } from '@/components/article-newsletter-cta';
import { ArticleCard } from '@/components/article-card';
import {
  getArticleBySlug,
  getAllPublishedSlugs,
  getArticles,
  formatDate,
  estimateReadTime,
  isDealExpired,
  dealDaysLeft,
  CATEGORY_META,
  Article,
} from '@/lib/articles';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yotravelholic.com';

  return {
    title: article.meta_title ?? article.title,
    description: article.meta_description ?? article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.meta_title ?? article.title,
      description: article.meta_description ?? article.excerpt,
      url: `${siteUrl}/blog/${article.slug}`,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      authors: [article.author],
      ...(article.cover_image ? { images: [{ url: article.cover_image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title ?? article.title,
      description: article.meta_description ?? article.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // TypeScript: article is Article from here (notFound throws)
  const a = article as Article;

  const meta = CATEGORY_META[a.category];
  const readTime = estimateReadTime(a.body);
  const expired = isDealExpired(a);
  const daysLeft = dealDaysLeft(a);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yotravelholic.com';

  const related = await getArticles({ category: a.category, limit: 4 });
  const relatedArticles = related.filter((r) => r.id !== a.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.excerpt,
    author: { '@type': 'Person', name: a.author, url: siteUrl },
    datePublished: a.published_at,
    dateModified: a.updated_at,
    url: `${siteUrl}/blog/${a.slug}`,
    ...(a.cover_image ? { image: a.cover_image } : {}),
    publisher: { '@type': 'Organization', name: 'Travelholics', url: siteUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-sand">
        {/* Hero */}
        <div className="relative pt-20">
          {a.cover_image ? (
            <div className="relative h-72 sm:h-96 lg:h-[480px] w-full">
              <Image
                src={a.cover_image}
                alt={a.cover_alt ?? a.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <div className="max-w-4xl mx-auto">
                  <ArticleHeroMeta article={a} meta={meta} readTime={readTime} expired={expired} daysLeft={daysLeft} />
                </div>
              </div>
            </div>
          ) : (
            <div className={`${meta.bgColor} px-6 pb-10 pt-8`}>
              <div className="max-w-4xl mx-auto">
                <ArticleHeroMeta article={a} meta={meta} readTime={readTime} expired={expired} daysLeft={daysLeft} />
              </div>
            </div>
          )}
        </div>

        {/* Article content */}
        <div className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
          {/* Back link */}
          <Link
            href={`/blog?category=${a.category}`}
            className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {meta.label}
          </Link>

          {/* Deal callout */}
          {a.category === 'deal' && (
            <DealCallout article={a} expired={expired} daysLeft={daysLeft} />
          )}

          {/* Body */}
          <ArticleBody blocks={a.body} />

          {/* CTA from article data */}
          {a.cta_label && a.cta_url && (
            <div className="mt-10">
              <Link
                href={a.cta_url}
                className="inline-flex items-center gap-2 bg-[#F26A75] text-white px-7 py-4 rounded-xl font-bold text-base hover:bg-[#D9505C] transition-colors"
              >
                {a.cta_label}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Newsletter CTA */}
          <ArticleNewsletterCta />

          {/* Tags */}
          {a.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {a.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs text-stone bg-cream border border-sand px-3 py-1.5 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-sand bg-cream py-14 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-8">
                More {meta.label}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((r) => (
                  <ArticleCard key={r.id} article={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

interface HeroMetaProps {
  article: Article;
  meta: (typeof CATEGORY_META)[keyof typeof CATEGORY_META];
  readTime: number;
  expired: boolean;
  daysLeft: number | null;
}

function ArticleHeroMeta({ article, meta, readTime, expired, daysLeft }: HeroMetaProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${meta.bgColor} ${meta.textColor}`}>
          {meta.label}
        </span>
        {article.category === 'deal' && !expired && daysLeft !== null && daysLeft <= 5 && (
          <span className="bg-white/20 text-white px-2.5 py-1 rounded-full text-xs font-bold">
            {daysLeft === 0 ? 'Ends today' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
          </span>
        )}
        {expired && (
          <span className="bg-stone/40 text-white px-2.5 py-1 rounded-full text-xs font-bold">
            Expired
          </span>
        )}
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-2 text-cream">
        {article.title}
      </h1>

      {article.subtitle && (
        <p className="text-lg sm:text-xl mb-4 text-cream/75">{article.subtitle}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm text-cream/70">
        <span className="font-semibold text-cream">{article.author}</span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(article.published_at)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {readTime} min read
        </span>
      </div>
    </div>
  );
}

function DealCallout({
  article,
  expired,
  daysLeft,
}: {
  article: Article;
  expired: boolean;
  daysLeft: number | null;
}) {
  if (expired) {
    return (
      <div className="flex items-start gap-3 bg-stone/10 border border-stone/20 rounded-xl p-4 mb-8 text-stone">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="text-sm">
          This deal has expired. Contact Yolanda to find current promotions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F26A75]/10 border border-[#F26A75]/30 rounded-xl p-5 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        {article.deal_sale_price && (
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl font-bold text-[#D9505C]">{article.deal_sale_price}</span>
            {article.deal_original_price && (
              <span className="text-stone text-base line-through">{article.deal_original_price}</span>
            )}
          </div>
        )}
        {daysLeft !== null && (
          <span className="bg-[#F26A75] text-white px-3 py-1.5 rounded-lg text-sm font-bold">
            {daysLeft === 0 ? 'Ends today!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
          </span>
        )}
      </div>
    </div>
  );
}
