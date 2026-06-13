import Link from 'next/link';
import { Clock, Calendar, Tag } from 'lucide-react';
import { Article, CATEGORY_META, formatDate, estimateReadTime, isDealExpired, dealDaysLeft } from '@/lib/articles';

interface Props {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: Props) {
  const meta = CATEGORY_META[article.category];
  const readTime = estimateReadTime(article.body);
  const expired = isDealExpired(article);
  const daysLeft = dealDaysLeft(article);

  return (
    <Link
      href={`/blog/${article.slug}`}
      className={`group flex flex-col bg-cream rounded-2xl overflow-hidden border border-sand shadow-sm hover:shadow-md transition-shadow duration-200 ${featured ? 'sm:col-span-2 lg:col-span-2' : ''}`}
    >
      {/* Cover image area */}
      <div className={`relative ${featured ? 'h-56 sm:h-72' : 'h-44'} bg-gradient-to-br from-[#0d4a3a] to-[#10755A] flex-shrink-0`}>
        {article.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image}
            alt={article.cover_alt ?? article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <CategoryPlaceholder category={article.category} />
        )}

        {/* Category badge */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${meta.bgColor} ${meta.textColor}`}>
          {meta.label}
        </span>

        {/* Deal urgency */}
        {article.category === 'deal' && !expired && daysLeft !== null && daysLeft <= 3 && (
          <span className="absolute top-3 right-3 bg-[#1A2E2A] text-white px-2.5 py-1 rounded-full text-xs font-bold">
            {daysLeft === 0 ? 'Ends today' : `${daysLeft}d left`}
          </span>
        )}
        {article.category === 'deal' && expired && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
            <span className="bg-white/90 text-ink px-4 py-2 rounded-full text-sm font-bold">Deal Expired</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Deal pricing callout */}
        {article.category === 'deal' && article.deal_sale_price && (
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#10755A]">{article.deal_sale_price}</span>
            {article.deal_original_price && (
              <span className="text-stone text-sm line-through">{article.deal_original_price}</span>
            )}
          </div>
        )}

        <h2 className={`font-serif font-semibold text-ink leading-snug group-hover:text-[#10755A] transition-colors duration-150 ${featured ? 'text-2xl' : 'text-lg'}`}>
          {article.title}
        </h2>

        {article.subtitle && (
          <p className="text-stone text-sm">{article.subtitle}</p>
        )}

        <p className="text-ink/80 text-sm leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-0.5 text-xs text-stone bg-sand px-2 py-0.5 rounded-full">
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-stone pt-1 border-t border-sand mt-auto">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.published_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

function CategoryPlaceholder({ category }: { category: Article['category'] }) {
  const icons: Record<Article['category'], string> = {
    'trip-blog': '✈️',
    'cruise-news': '🚢',
    'deal': '💰',
    'shop-announcement': '🛍️',
  };

  const gradients: Record<Article['category'], string> = {
    'trip-blog': 'from-[#0d4a3a] to-[#10755A]',
    'cruise-news': 'from-[#0e1a4a] to-[#1F2D86]',
    'deal': 'from-[#c04060] to-[#F26A75]',
    'shop-announcement': 'from-[#b57a00] to-[#f59e0b]',
  };

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[category]} flex items-center justify-center`}>
      <span className="text-5xl opacity-30 select-none" aria-hidden="true">{icons[category]}</span>
    </div>
  );
}
