'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { PaginationMeta } from '@/lib/types';

export interface PaginationProps {
  pagination: PaginationMeta;
}

export function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page, total_pages, total_items, has_next, has_prev } = pagination;

  if (total_pages <= 1) return null;

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Build a smart window of page numbers
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(total_pages, page + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-600"
    >
      <div className="text-xs sm:text-sm">
        Showing page <span className="font-semibold text-neutral-900">{page}</span> of{' '}
        <span className="font-semibold text-neutral-900">{total_pages}</span> ({total_items}{' '}
        total items)
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={!has_prev}
          onClick={() => navigateToPage(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          &larr; Prev
        </button>

        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => navigateToPage(1)}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-neutral-400">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => navigateToPage(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              p === page
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {p}
          </button>
        ))}

        {end < total_pages && (
          <>
            {end < total_pages - 1 && <span className="px-1 text-neutral-400">...</span>}
            <button
              type="button"
              onClick={() => navigateToPage(total_pages)}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
            >
              {total_pages}
            </button>
          </>
        )}

        <button
          type="button"
          disabled={!has_next}
          onClick={() => navigateToPage(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next &rarr;
        </button>
      </div>
    </nav>
  );
}
