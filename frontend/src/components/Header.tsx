'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';

export function Header() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      {/* Top micro banner */}
      <div className="bg-neutral-900 py-1.5 px-4 text-center text-xs font-medium text-neutral-300">
        <span>Professional Beauty, Barber Supplies &amp; Salon Equipment</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
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

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-700">
            <Link
              href="/"
              className="hover:text-black transition-colors"
            >
              Catalog
            </Link>
            <Link
              href="/categories/hair-care-products"
              className="hover:text-black transition-colors"
            >
              Hair Care
            </Link>
            <Link
              href="/categories/barber-tools-accessories"
              className="hover:text-black transition-colors"
            >
              Barber Tools
            </Link>
            <Link
              href="/categories/shaving-beard-care"
              className="hover:text-black transition-colors"
            >
              Shaving &amp; Beard
            </Link>
            <Link
              href="/categories/electrical-salon-equipment"
              className="hover:text-black transition-colors"
            >
              Salon Equipment
            </Link>
          </nav>
        </div>

        {/* Search UI */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
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

      {/* Mobile navigation drawer / dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-4 shadow-lg animate-in fade-in duration-200">
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

          <nav className="flex flex-col space-y-2 text-sm font-medium text-neutral-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-neutral-100"
            >
              All Categories &amp; Catalog
            </Link>
            <Link
              href="/categories/hair-care-products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-neutral-100"
            >
              Hair Care Products
            </Link>
            <Link
              href="/categories/hair-styling-products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-neutral-100"
            >
              Hair Styling Products
            </Link>
            <Link
              href="/categories/barber-tools-accessories"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-neutral-100"
            >
              Barber Tools &amp; Accessories
            </Link>
            <Link
              href="/categories/shaving-beard-care"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-neutral-100"
            >
              Shaving &amp; Beard Care
            </Link>
            <Link
              href="/categories/electrical-salon-equipment"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-neutral-100"
            >
              Electrical Salon Equipment
            </Link>
            <Link
              href="/categories/skin-care"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-neutral-100"
            >
              Skin Care
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-neutral-100 font-semibold text-neutral-950 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs">{totalItems}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
