import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[0.72rem] font-medium text-stone-400">
      {crumbs.map((crumb, i) => (
        <span key={crumb.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 flex-shrink-0 text-stone-300" />}
          {crumb.href ? (
            <Link href={crumb.href} className="transition-colors hover:text-[#059669]">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-stone-500">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
