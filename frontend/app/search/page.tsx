import { listProducts } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import type { ProductSortBy } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    search?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: string;
    sort_by?: string;
    page?: string;
  }>;
}

export const instant = false;

export default async function SearchPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const searchTerm = query.q || query.search || '';

  let productsResponse: Awaited<ReturnType<typeof listProducts>> | null = null;
  let errorMsg: string | null = null;

  try {
    productsResponse = await listProducts({
      search: searchTerm || undefined,
      brand: query.brand,
      min_price: query.min_price ? parseFloat(query.min_price) : undefined,
      max_price: query.max_price ? parseFloat(query.max_price) : undefined,
      in_stock: query.in_stock === 'true' ? true : undefined,
      sort_by: query.sort_by as ProductSortBy,
      page: query.page ? parseInt(query.page, 10) : 1,
      page_size: 12,
    });
  } catch (err) {
    errorMsg = (err as Error).message;
  }

  const availableBrands = Array.from(
    new Set(productsResponse?.items.map((p) => p.brand).filter(Boolean) || []),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      <div className="border-b border-neutral-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Catalog Search
        </span>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-neutral-900">
          {searchTerm ? `Results for “${searchTerm}”` : 'Search All Products'}
        </h1>
        {productsResponse && (
          <p className="mt-1 text-sm text-neutral-500">
            Found {productsResponse.pagination.total_items} items matching your criteria
          </p>
        )}
      </div>

      {errorMsg && (
        <ErrorMessage
          title="Catalog Search Error"
          message={errorMsg}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1">
          <ProductFilters availableBrands={availableBrands} />
        </div>

        <div className="lg:col-span-3 space-y-8">
          {!productsResponse || productsResponse.items.length === 0 ? (
            <EmptyState
              title={searchTerm ? `No results for “${searchTerm}”` : 'No products found'}
              message="Try searching for another term, category, or clearing active filters."
              actionHref="/"
              actionLabel="Return to Catalog"
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
    </div>
  );
}
