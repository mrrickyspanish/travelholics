import Link from 'next/link';
import { ArticleCategory, CATEGORY_META } from '@/lib/articles';

const ALL_LABEL = 'All Posts';

interface Props {
  active?: ArticleCategory;
}

export function BlogFilter({ active }: Props) {
  const tabs: { label: string; value?: ArticleCategory }[] = [
    { label: ALL_LABEL },
    { label: 'Trip Blogs', value: 'trip-blog' },
    { label: 'Cruise News', value: 'cruise-news' },
    { label: 'Deals', value: 'deal' },
    { label: 'Shop', value: 'shop-announcement' },
  ];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter articles by category">
      {tabs.map(({ label, value }) => {
        const isActive = value === active || (!value && !active);
        const meta = value ? CATEGORY_META[value] : null;

        return (
          <Link
            key={label}
            href={value ? `/blog?category=${value}` : '/blog'}
            role="tab"
            aria-selected={isActive}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 border
              ${isActive
                ? meta
                  ? `${meta.bgColor} ${meta.textColor} border-transparent`
                  : 'bg-ink text-cream border-transparent'
                : 'bg-cream text-stone border-stone/20 hover:border-stone/50 hover:text-ink'
              }
            `}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
