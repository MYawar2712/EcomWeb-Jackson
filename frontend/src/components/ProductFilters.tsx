'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { ProductSortBy } from '@/lib/types';

export interface ProductFiltersProps {
  availableBrands?: string[];
}

export function ProductFilters({ availableBrands = [] }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentBrand = searchParams.get('brand') || '';
  const currentInStock = searchParams.get('in_stock') === 'true';
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentSort = (searchParams.get('sort_by') as ProductSortBy) || 'name_asc';
  const currentSearch = searchParams.get('search') || '';

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // reset page on filter change
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const applyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (minPriceInput) params.set('min_price', minPriceInput);
    else params.delete('min_price');

    if (maxPriceInput) params.set('max_price', maxPriceInput);
    else params.delete('max_price');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim() || null);
  };

  const clearAllFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchInput('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(
    currentBrand || currentInStock || currentMinPrice || currentMaxPrice || currentSearch,
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search within this listing */}
      <form onSubmit={applySearch} className="space-y-2">
        <label htmlFor="filter-search" className="block text-xs font-semibold text-neutral-700">
          Search products
        </label>
        <div className="flex gap-2">
          <input
            id="filter-search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="e.g. Argan, Clipper..."
            className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            Go
          </button>
        </div>
      </form>

      {/* Brand filter */}
      {availableBrands.length > 0 && (
        <div className="space-y-2">
          <label htmlFor="filter-brand" className="block text-xs font-semibold text-neutral-700">
            Brand
          </label>
          <select
            id="filter-brand"
            value={currentBrand}
            onChange={(e) => updateParam('brand', e.target.value || null)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
          >
            <option value="">All Brands</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* In Stock toggle */}
      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) => updateParam('in_stock', e.target.checked ? 'true' : null)}
            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <span className="text-xs font-medium text-neutral-800">In Stock only</span>
        </label>
      </div>

      {/* Price range */}
      <form onSubmit={applyPriceFilter} className="space-y-2 pt-2">
        <span className="block text-xs font-semibold text-neutral-700">Price ($ USD)</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="w-1/2 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
          />
          <span className="text-neutral-400 text-xs">–</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="w-1/2 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg border border-neutral-300 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
        >
          Apply Price
        </button>
      </form>

      {/* Sort order */}
      <div className="space-y-2 pt-2 border-t border-neutral-100">
        <label htmlFor="filter-sort" className="block text-xs font-semibold text-neutral-700">
          Sort by
        </label>
        <select
          id="filter-sort"
          value={currentSort}
          onChange={(e) => updateParam('sort_by', e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
        >
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
          <option value="brand_asc">Brand: A to Z</option>
          <option value="brand_desc">Brand: Z to A</option>
          <option value="newest">Newest Arrivals</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {isPending && (
        <div className="text-center text-xs text-neutral-400 animate-pulse">
          Updating results...
        </div>
      )}
    </div>
  );
}
