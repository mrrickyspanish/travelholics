import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArticleCard } from '@/components/article-card';
import { BlogFilter } from '@/components/blog-filter';
import { getArticles, ArticleCategory, CATEGORY_META } from '@/lib/articles';

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const cat = category as ArticleCategory | undefined;
  const meta = cat ? CATEGORY_META[cat] : null;

  return {
    title: meta ? `${meta.label} | Yolanda's Journal` : "Yolanda's Journal",
    description: meta
      ? meta.description
      : "Trip blogs, cruise news, deals, and shop updates from Yolanda at Travelholics.",
    alternates: { canonical: cat ? `/blog?category=${cat}` : '/blog' },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category as ArticleCategory | undefined;

  const [allArticles, featuredArticles] = await Promise.all([
    getArticles({ category: activeCategory }),
    activeCategory ? Promise.resolve([]) : getArticles({ featured: true, limit: 1 }),
  ]);

  const featured = featuredArticles[0] ?? null;
  const rest = featured
    ? allArticles.filter((a) => a.id !== featured.id)
    : allArticles;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand">
        {/* Hero */}
        <section className="bg-[#1F2D86] text-cream pt-32 pb-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="font-script text-2xl sm:text-3xl text-[#F4C4CC] mb-2">by Yolanda</p>
            <h1 className="font-serif text-5xl sm:text-6xl font-semibold mb-4 leading-tight">
              The Journal
            </h1>
            <p className="text-cream/75 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
              Trip stories, cruise industry news, deals worth knowing about, and what&apos;s new in the shop.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <BlogFilter active={activeCategory} />

          {allArticles.length === 0 ? (
            <div className="text-center py-24 text-stone">
              <p className="font-serif text-3xl mb-3 text-ink">Nothing here yet</p>
              <p className="text-lg">New posts are on the way — check back soon.</p>
            </div>
          ) : (
            <>
              {/* Featured article — only on unfiltered view */}
              {featured && (
                <div className="mt-10 mb-4">
                  <p className="type-kicker text-stone mb-4">Featured</p>
                  <ArticleCard article={featured} featured />
                </div>
              )}

              {/* Article grid */}
              {rest.length > 0 && (
                <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${featured ? 'mt-10' : 'mt-8'}`}>
                  {rest.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
