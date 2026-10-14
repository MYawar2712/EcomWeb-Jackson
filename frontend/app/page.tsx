import Link from 'next/link';
import Image from 'next/image';
import { listProducts } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import type { ProductListItem } from '@/lib/types';

export default async function HomePage() {
  let products: ProductListItem[] = [];
  let loadError: string | null = null;

  try {
    const prodsResponse = await listProducts({ page_size: 24 }).catch((err) => {
      console.error('Failed to fetch products for home:', err);
      return null;
    });
    if (prodsResponse && prodsResponse.items) {
      products = prodsResponse.items;
    }
  } catch (err) {
    loadError = (err as Error).message;
  }

  // Curate dynamic deals & spotlight collections
  const dealsProducts = products.slice(0, 4);
  const trendingProducts = products.slice(4, 12);
  const newArrivals = products.slice(12, 20);

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section with Prominent Jackson Beauty Club Emblem */}
      <section className="relative overflow-hidden bg-neutral-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        {/* Subtle Ambient Golden Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md border border-amber-400/20">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                Official Jackson Beauty Club Storefront
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Master Barber Supplies &amp; Professional Salon Equipment
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Direct single-vendor access to professional barber tools, precision shears, grooming formulas, and heavy-duty salon equipment with live stock inventory.
              </p>

              <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4">
                <a
                  href="#deals-section"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-7 py-4 text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2 group"
                >
                  <span>Explore Exclusive Deals</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </a>
                <Link
                  href="/categories/barber-tools-accessories"
                  className="rounded-xl bg-neutral-900 border border-neutral-700/80 px-6 py-4 text-sm font-bold text-white hover:bg-neutral-800 transition-colors"
                >
                  Barber Tools Collection
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-center lg:text-left text-xs text-neutral-400">
                <div>
                  <span className="block font-bold text-white text-base">100% Genuine</span>
                  <span>Direct Authorized Brands</span>
                </div>
                <div>
                  <span className="block font-bold text-white text-base">Real Inventory</span>
                  <span>Warehouse Stock Sync</span>
                </div>
                <div>
                  <span className="block font-bold text-white text-base">Salon Grade</span>
                  <span>Heavy-Duty Quality</span>
                </div>
              </div>
            </div>

            {/* Right Hero: Big & Best Fit Jackson Beauty Club Logo Emblem */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex items-center justify-center p-4">
                {/* Glow ring backing */}
                <div className="absolute inset-4 bg-amber-500/15 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full drop-shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:scale-105 transition-all duration-300">
                  <Image
                    src="/jackson-logo.png"
                    alt="Jackson Beauty Club Emblem"
                    fill
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 384px, 420px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {loadError && (
          <ErrorMessage
            title="Unable to load store products"
            message={loadError}
          />
        )}

        {/* Section 1: Hot Deals & Promotions */}
        <section id="deals-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-600">
                  Limited Offers &bull; Top Value
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-1">
                Featured Deals &amp; Specials
              </h2>
            </div>
            <p className="text-sm text-neutral-500">
              Curated promotional pricing on professional essentials.
            </p>
          </div>

          {dealsProducts.length === 0 ? (
            <EmptyState
              title="Deals are currently loading"
              message="New promotional items will appear shortly from the inventory."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dealsProducts.map((prod, idx) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  tag={idx % 2 === 0 ? 'Special Deal' : 'Hot Offer'}
                />
              ))}
            </div>
          )}
        </section>

        {/* Banner: Club Member Assurances */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-8 sm:p-10 text-neutral-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-neutral-900/80">
              Jackson Beauty Club Privilege
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Professional Supplies Direct to Your Salon
            </h3>
            <p className="text-sm font-medium text-neutral-900/80 max-w-xl">
              Enjoy verified manufacturer stock, transparent wholesale pricing, and express fulfillment on all catalog orders.
            </p>
          </div>
          <Link
            href="/categories/electrical-salon-equipment"
            className="rounded-2xl bg-neutral-950 px-7 py-3.5 text-sm font-black text-white hover:bg-neutral-800 transition-colors shrink-0 shadow-lg"
          >
            Explore Salon Equipment &rarr;
          </Link>
        </div>

        {/* Section 2: Trending & Popular Products */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Staff Picks &bull; Best In Class
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-1">
                Trending Essentials
              </h2>
            </div>
            {products.length > 0 && (
              <span className="text-xs font-medium text-neutral-500">
                {products.length} catalog items available
              </span>
            )}
          </div>

          {trendingProducts.length === 0 ? (
            <EmptyState
              title="Products are syncing"
              message="Trending catalog inventory is being refreshed."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Just In Store
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-1">
                  New Arrivals
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map((prod) => (
                <ProductCard key={prod.id} product={prod} tag="New" />
              ))}
            </div>
          </section>
        )}

        {/* Store Quality Assurance */}
        <section className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 border border-neutral-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-2">
              <div className="h-10 w-10 mx-auto sm:mx-0 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-base font-bold">100% Genuine Brands</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Single-vendor verified supply chain directly from approved manufacturers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-10 w-10 mx-auto sm:mx-0 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-base font-bold">Live Inventory &amp; Stock</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Variant-level stock visibility ensuring fast shipment and no backorder surprises.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-10 w-10 mx-auto sm:mx-0 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-base font-bold">Transparent Pricing</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Backend-sourced prices per variant without hidden fees or currency markups.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
