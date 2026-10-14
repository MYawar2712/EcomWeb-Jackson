import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-900 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <span className="text-2xl font-black tracking-tight text-white">
              JACKSON
            </span>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              Curated single-vendor storefront for professional cosmetics, premium hair-care,
              barber supplies, and heavy-duty salon equipment. Powered by real catalog inventory.
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Backend Catalog Connected
              </span>
              <span>&bull;</span>
              <span>Live Pricing &amp; Stock</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Product Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/categories/hair-care-products"
                  className="hover:text-white transition-colors"
                >
                  Hair Care Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/barber-tools-accessories"
                  className="hover:text-white transition-colors"
                >
                  Barber Tools &amp; Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/shaving-beard-care"
                  className="hover:text-white transition-colors"
                >
                  Shaving &amp; Beard Care
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/electrical-salon-equipment"
                  className="hover:text-white transition-colors"
                >
                  Electrical Salon Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors text-xs text-neutral-400"
                >
                  &rarr; View all 9 Jackson collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links & support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Store &amp; Support
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  API Documentation
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>&copy; 2026 Jackson. All rights reserved.</p>
          <p>Real catalog data sourced directly from Jackson API.</p>
        </div>
      </div>
    </footer>
  );
}
