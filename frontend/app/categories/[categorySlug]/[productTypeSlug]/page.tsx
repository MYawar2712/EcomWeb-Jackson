import { notFound } from 'next/navigation';
import { getProductTypeBySlug, listProducts, ApiClientError } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import type { ProductSortBy } from '@/lib/types';

interface PageProps {
  params: Promise<{
    categorySlug: string;
    productTypeSlug: string;
  }>;
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

export default async function ProductTypePage({ params, searchParams }: PageProps) {
  const { categorySlug, productTypeSlug } = await params;
  const query = await searchParams;

  let productType: Awaited<ReturnType<typeof getProductTypeBySlug>> | null = null;
  let productsResponse: Awaited<ReturnType<typeof listProducts>> | null = null;
  let errorMsg: string | null = null;

  try {
    productType = await getProductTypeBySlug(productTypeSlug);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      notFound();
    }
    errorMsg = (err as Error).message;
  }

  if (productType) {
    try {
      productsResponse = await listProducts({
        product_type_slug: productTypeSlug,
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
      console.error('Failed to load product type items:', err);
    }
  }

  if (errorMsg || !productType) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Categories', href: '/' },
            { label: categorySlug, href: `/categories/${categorySlug}` },
          ]}
        />
        <div className="mt-8">
          <ErrorMessage
            title="Failed to load product collection"
            message={errorMsg || 'Product type not found'}
          />
        </div>
      </div>
    );
  }

  // Brands list from API productType or from loaded products
  const brandsList =
    productType.brands && productType.brands.length > 0
      ? productType.brands
      : Array.from(
          new Set(productsResponse?.items.map((p) => p.brand).filter(Boolean) || []),
        );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          {
            label: productType.category?.name || categorySlug,
            href: `/categories/${categorySlug}`,
          },
          { label: productType.name },
        ]}
      />

      {/* Product Type Header */}
      <div className="rounded-3xl bg-white border border-neutral-200/80 p-8 sm:p-10 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
            {productType.category?.name || 'Category'}
          </span>
          <span className="text-xs text-neutral-400">&bull;</span>
          <span className="text-xs font-medium text-neutral-500">
            {productType.products_count}{' '}
            {productType.products_count === 1 ? 'Product' : 'Products'} available
          </span>
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
          {productType.name}
        </h1>

        {productType.description && (
          <p className="mt-3 text-base text-neutral-600 max-w-2xl leading-relaxed">
            {productType.description}
          </p>
        )}

        {/* Brands pill list */}
        {brandsList.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-neutral-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mr-1">
              Available Brands:
            </span>
            {brandsList.map((brand) => (
              <span
                key={brand}
                className="rounded-lg bg-neutral-50 border border-neutral-200/80 px-2.5 py-1 text-xs font-medium text-neutral-800"
              >
                {brand}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Catalog listing with filters and products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters column */}
        <div className="lg:col-span-1">
          <ProductFilters availableBrands={brandsList} />
        </div>

        {/* Products column */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>
              Showing products across all brands for{' '}
              <strong className="text-neutral-900">{productType.name}</strong>
            </span>
            {productsResponse && (
              <span>{productsResponse.pagination.total_items} items total</span>
            )}
          </div>

          {!productsResponse || productsResponse.items.length === 0 ? (
            <EmptyState
              title={`No ${productType.name} products match`}
              message="Try clearing your filters or selecting a different brand."
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
