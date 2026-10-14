import Link from 'next/link';
import Image from 'next/image';
import { getCategories, listProducts } from '@/lib/api';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let productsResponse: Awaited<ReturnType<typeof listProducts>> | null = null;
  let loadError: string | null = null;

  try {
    const [cats, prods] = await Promise.all([
      getCategories().catch((err) => {
        console.error('Failed to fetch categories:', err);
        return [];
      }),
      listProducts({ page_size: 8 }).catch((err) => {
        console.error('Failed to fetch products:', err);
        return null;
      }),
    ]);
    categories = cats;
    productsResponse = prods;
  } catch (err) {
    loadError = (err as Error).message;
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm border border-amber-500/20 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Jackson Beauty Club &bull; Professional Storefront
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Premium Beauty, Barber &amp; Salon Supplies
              </h1>
              <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
                Curated for professional hair stylists, master barbers, and salon owners. Real-time inventory,
                genuine verified brands, and multi-variant product selections.
              </p>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                <a
                  href="#categories-section"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-amber-500/20"
                >
                  Browse Categories
                </a>
                <Link
                  href="/categories/hair-care-products"
                  className="rounded-xl bg-neutral-800 border border-neutral-700 px-6 py-3.5 text-sm font-semibold text-white hover:bg-neutral-700 transition-colors"
                >
                  Hair Care Collection
                </Link>
              </div>
            </div>

            {/* Emblem Hero Visual */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full"></div>
              <div className="relative w-full h-full drop-shadow-2xl hover:scale-105 transition-transform duration-300">
                <Image
                  src="/jackson-logo.png"
                  alt="Jackson Beauty Club Emblem"
                  fill
                  sizes="(max-width: 640px) 256px, 320px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {loadError && (
          <ErrorMessage
            title="Unable to load catalog"
            message={loadError}
          />
        )}

        {/* Categories Section */}
        <section id="categories-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
                Explore by Category
              </h2>
            </div>
            <p className="text-sm text-neutral-500">
              Select a category to explore product types and formulas.
            </p>
          </div>

          {categories.length === 0 ? (
            <EmptyState
              title="No categories found"
              message="The catalog categories are being synchronized."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </section>

        {/* Featured / Recent Products Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                In Stock &amp; Available
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
                Featured Products
              </h2>
            </div>
            {productsResponse && productsResponse.pagination.total_items > 0 && (
              <span className="text-xs text-neutral-500">
                {productsResponse.pagination.total_items} items in store
              </span>
            )}
          </div>

          {!productsResponse || productsResponse.items.length === 0 ? (
            <EmptyState
              title="No products available"
              message="Products are currently being loaded into the catalog."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsResponse.items.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>

        {/* Brand Promise Section */}
        <section className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-2">
              <div className="h-10 w-10 mx-auto sm:mx-0 rounded-xl bg-white/10 flex items-center justify-center text-white">
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
              <div className="h-10 w-10 mx-auto sm:mx-0 rounded-xl bg-white/10 flex items-center justify-center text-white">
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
              <div className="h-10 w-10 mx-auto sm:mx-0 rounded-xl bg-white/10 flex items-center justify-center text-white">
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
