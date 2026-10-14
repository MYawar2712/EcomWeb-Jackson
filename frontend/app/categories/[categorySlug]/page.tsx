import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, listProducts, ApiClientError } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import type { ProductSortBy } from '@/lib/types';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{
    brand?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: string;
    search?: string;
    sort_by?: string;
    page?: string;
  }>;
}

export const instant = false;

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { categorySlug } = await params;
  const query = await searchParams;

  let category: Awaited<ReturnType<typeof getCategoryBySlug>> | null = null;
  let productsResponse: Awaited<ReturnType<typeof listProducts>> | null = null;
  let errorMsg: string | null = null;

  try {
    category = await getCategoryBySlug(categorySlug);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      notFound();
    }
    errorMsg = (err as Error).message;
  }

  if (category) {
    try {
      productsResponse = await listProducts({
        category_slug: categorySlug,
        brand: query.brand,
        min_price: query.min_price ? parseFloat(query.min_price) : undefined,
        max_price: query.max_price ? parseFloat(query.max_price) : undefined,
        in_stock: query.in_stock === 'true' ? true : undefined,
        search: query.search,
        sort_by: query.sort_by as ProductSortBy,
        page: query.page ? parseInt(query.page, 10) : 1,
        page_size: 12,
      });
    } catch (err) {
      console.error('Failed to load category products:', err);
    }
  }

  if (errorMsg || !category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Categories', href: '/' }]} />
        <div className="mt-8">
          <ErrorMessage
            title="Failed to load category"
            message={errorMsg || 'Category not found'}
          />
        </div>
      </div>
    );
  }

  // Extract distinct brands from products list
  const availableBrands = Array.from(
    new Set(productsResponse?.items.map((p) => p.brand).filter(Boolean) || []),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: category.name }]} />

      {/* Category Header */}
      <div className="rounded-3xl bg-white border border-neutral-200/80 p-8 sm:p-10 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Category Collection
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 text-base text-neutral-600 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Product Types Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Product Types in {category.name}
          </h2>
          <span className="text-xs text-neutral-500">
            {category.product_types.length}{' '}
            {category.product_types.length === 1 ? 'type' : 'types'}
          </span>
        </div>

        {category.product_types.length === 0 ? (
          <EmptyState
            title="No product types found"
            message="There are currently no product types listed under this category."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.product_types.map((pt) => (
              <Link
                key={pt.id}
                href={`/categories/${categorySlug}/${pt.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between text-neutral-400 group-hover:text-neutral-900 transition-colors">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Product Type
                    </span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-neutral-900 group-hover:text-black">
                    {pt.name}
                  </h3>
                  {pt.description && (
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                      {pt.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900">
                  <span>Browse {pt.name}</span>
                  <span className="text-neutral-400 group-hover:text-neutral-900">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Products within Category */}
      <section className="space-y-6 pt-6 border-t border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">
              All Products in {category.name}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Filtered and paginated catalog from backend inventory.
            </p>
          </div>
          {productsResponse && (
            <span className="text-xs font-medium text-neutral-500">
              {productsResponse.pagination.total_items} items found
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters availableBrands={availableBrands} />
          </div>

          {/* Product grid & pagination */}
          <div className="lg:col-span-3">
            {!productsResponse || productsResponse.items.length === 0 ? (
              <EmptyState
                title="No products match your filters"
                message="Try adjusting your brand, price range, or stock filters."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {productsResponse.items.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
                <Pagination pagination={productsResponse.pagination} />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
