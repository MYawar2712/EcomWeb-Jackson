'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { STORE_CATEGORIES } from '@/lib/categories';

export function Header() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownSlug, setOpenDropdownSlug] = useState<string | null>(null);
  const [openMobileCategorySlug, setOpenMobileCategorySlug] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownSlug(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
    setOpenDropdownSlug(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      {/* Top micro banner */}
      <div className="bg-neutral-900 py-1.5 px-4 text-center text-xs font-medium text-neutral-300">
        <span>Professional Beauty, Barber Supplies &amp; Salon Equipment</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-14 w-20 overflow-hidden shrink-0">
              <Image
                src="/jackson-logo.png"
                alt="Jackson Beauty Club Logo"
                fill
                sizes="80px"
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-neutral-950 group-hover:text-amber-800 transition-colors leading-tight">
                JACKSON
              </span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 -mt-0.5">
                Beauty Club
              </span>
            </div>
          </Link>
        </div>

        {/* Search UI */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-neutral-300 bg-neutral-50/70 py-2 pl-10 pr-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              aria-label="Submit search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart button */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50/60 px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Open cart"
          >
            <svg
              className="h-5 w-5 text-neutral-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar with Dropdown Menus (NO Catalogues link) */}
      <div ref={navRef} className="hidden md:block border-t border-neutral-100 bg-neutral-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-1 py-1 overflow-x-auto text-xs font-semibold text-neutral-700">
            {STORE_CATEGORIES.map((cat) => {
              const isOpen = openDropdownSlug === cat.slug;
              return (
                <div
                  key={cat.slug}
                  className="relative group shrink-0"
                  onMouseEnter={() => setOpenDropdownSlug(cat.slug)}
                  onMouseLeave={() => setOpenDropdownSlug(null)}
                >
                  <Link
                    href={`/categories/${cat.slug}`}
                    className={`inline-flex items-center gap-1 px-3 py-2.5 rounded-lg transition-colors ${
                      isOpen
                        ? 'text-neutral-950 bg-white shadow-xs font-bold'
                        : 'hover:text-black hover:bg-white/80'
                    }`}
                  >
                    <span>{cat.shortName}</span>
                    <svg
                      className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-neutral-900' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {/* Dropdown Menu showing Products / Product Types in this Category */}
                  {isOpen && (
                    <div className="absolute left-0 top-full pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl space-y-1">
                        <div className="px-3 py-1.5 border-b border-neutral-100 mb-1 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                            {cat.category}
                          </span>
                          <Link
                            href={`/categories/${cat.slug}`}
                            onClick={() => setOpenDropdownSlug(null)}
                            className="text-[10px] text-neutral-500 hover:text-black font-medium"
                          >
                            View All &rarr;
                          </Link>
                        </div>

                        <div className="max-h-72 overflow-y-auto space-y-0.5">
                          {cat.product_types.map((pt) => (
                            <Link
                              key={pt.slug}
                              href={`/categories/${cat.slug}/${pt.slug}`}
                              onClick={() => setOpenDropdownSlug(null)}
                              className="group/item flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
                            >
                              <span>{pt.name}</span>
                              <svg
                                className="w-3.5 h-3.5 text-neutral-300 group-hover/item:text-neutral-700 group-hover/item:translate-x-0.5 transition-all"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile navigation drawer with accordion dropdowns */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-4 shadow-lg animate-in fade-in duration-200 max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              aria-label="Submit search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Categories &amp; Products
            </span>
            <nav className="flex flex-col space-y-1 pt-1">
              {STORE_CATEGORIES.map((cat) => {
                const isExpanded = openMobileCategorySlug === cat.slug;
                return (
                  <div key={cat.slug} className="rounded-xl border border-neutral-100 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-neutral-50/60">
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-semibold text-neutral-900 hover:text-black flex-1"
                      >
                        {cat.category}
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileCategorySlug(isExpanded ? null : cat.slug)
                        }
                        className="p-1 text-neutral-400 hover:text-neutral-700"
                        aria-label={`Toggle ${cat.category} options`}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="bg-white px-3 py-2 space-y-1 border-t border-neutral-100">
                        {cat.product_types.map((pt) => (
                          <Link
                            key={pt.slug}
                            href={`/categories/${cat.slug}/${pt.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-2 py-1.5 text-xs text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-lg"
                          >
                            &bull; {pt.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 rounded-xl bg-neutral-900 text-white px-4 py-3 font-semibold text-sm flex items-center justify-between shadow-md"
              >
                <span>Shopping Cart</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{totalItems}</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
