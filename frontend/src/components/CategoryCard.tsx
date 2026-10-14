import Link from 'next/link';
import type { CategorySummary } from '@/lib/types';

export interface CategoryCardProps {
  category: CategorySummary;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-500"></span>
            {category.product_types_count !== null && category.product_types_count !== undefined
              ? `${category.product_types_count} ${category.product_types_count === 1 ? 'Product Type' : 'Product Types'}`
              : 'Collection'}
          </span>
          <span className="text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 group-hover:text-black">
          {category.name}
        </h3>

        <p className="mt-2 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
          {category.description || 'Professional cosmetics, salon equipment, and beauty essentials.'}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-900">
        <span>Explore catalog</span>
        <span className="text-neutral-500 group-hover:text-neutral-900 transition-colors">
          View all &rarr;
        </span>
      </div>
    </Link>
  );
}
