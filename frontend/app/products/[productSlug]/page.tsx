import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, ApiClientError } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AddToCartForm } from '@/components/AddToCartForm';
import { ErrorMessage } from '@/components/ErrorMessage';

interface PageProps {
  params: Promise<{ productSlug: string }>;
}

export const instant = false;

export default async function ProductDetailPage({ params }: PageProps) {
  const { productSlug } = await params;

  let product: Awaited<ReturnType<typeof getProductBySlug>> | null = null;
  let errorMsg: string | null = null;

  try {
    product = await getProductBySlug(productSlug);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      notFound();
    }
    errorMsg = (err as Error).message;
  }

  if (errorMsg || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Catalog', href: '/' }]} />
        <div className="mt-8">
          <ErrorMessage
            title="Failed to load product"
            message={errorMsg || 'Product not found'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          {
            label: product.category.name,
            href: `/categories/${product.category.slug}`,
          },
          {
            label: product.product_type.name,
            href: `/categories/${product.category.slug}/${product.product_type.slug}`,
          },
          { label: product.name },
        ]}
      />

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Visual Showcase */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-100 via-neutral-150 to-neutral-200 border border-neutral-200 flex flex-col items-center justify-center p-8 shadow-xs">
            {/* Visual Brand Emblem */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-28 w-28 rounded-3xl bg-white shadow-md flex items-center justify-center text-neutral-800 font-black text-3xl tracking-tight mb-4 border border-neutral-100">
                {product.brand ? product.brand.slice(0, 3).toUpperCase() : 'JW'}
              </div>
              <span className="text-sm uppercase font-bold tracking-widest text-neutral-600">
                {product.brand}
              </span>
              <span className="text-xs text-neutral-500 mt-1">
                {product.product_type.name}
              </span>
            </div>

            {/* In stock badge */}
            <div className="absolute top-4 right-4">
              {product.total_stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {product.total_stock} units in stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 border border-neutral-200 shadow-xs">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Category tag */}
            <div className="absolute bottom-4 left-4">
              <span className="rounded-lg bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-xs border border-white">
                {product.category.name}
              </span>
            </div>
          </div>

          {/* Guarantee / Authenticity highlight */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Verified Jackson Catalog Item
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Direct Brand Supply</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Live Inventory Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Salon Grade Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure Packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Variant Selection */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <span className="text-neutral-900 font-bold">{product.brand}</span>
              <span>&bull;</span>
              <Link
                href={`/categories/${product.category.slug}/${product.product_type.slug}`}
                className="hover:underline text-neutral-600"
              >
                {product.product_type.name}
              </Link>
            </div>

            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
              {product.name}
            </h1>

            {product.description && (
              <p className="mt-4 text-base text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Add to Cart Form with Variant Picker */}
          <div className="border-t border-neutral-200 pt-6">
            <AddToCartForm product={product} />
          </div>

          {/* Product Specifications & Warehouse Meta */}
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              Product Specifications
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div className="border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Brand</dt>
                <dd className="font-semibold text-neutral-900 mt-0.5">{product.brand}</dd>
              </div>
              <div className="border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Category</dt>
                <dd className="font-semibold text-neutral-900 mt-0.5">{product.category.name}</dd>
              </div>
              <div className="border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Product Type</dt>
                <dd className="font-semibold text-neutral-900 mt-0.5">{product.product_type.name}</dd>
              </div>
              <div className="border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Variants Available</dt>
                <dd className="font-semibold text-neutral-900 mt-0.5">{product.variants.length}</dd>
              </div>
              <div className="border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Total Stock</dt>
                <dd className="font-semibold text-neutral-900 mt-0.5">{product.total_stock} units</dd>
              </div>
              <div className="border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Catalog Slug</dt>
                <dd className="font-mono text-neutral-700 mt-0.5">{product.slug}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
