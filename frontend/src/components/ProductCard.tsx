import Link from 'next/link';
import type { ProductListItem } from '@/lib/types';
import { formatPriceRange } from '@/lib/format';

export interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const isInStock = product.total_stock > 0;
  const priceDisplay = formatPriceRange(product.min_price, product.max_price);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md">
      {/* Product Image placeholder showcase */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center p-6 text-neutral-400 group-hover:from-neutral-200 group-hover:to-neutral-300 transition-colors"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-white/80 backdrop-blur shadow-xs flex items-center justify-center text-neutral-700 font-bold text-lg mb-2 group-hover:scale-105 transition-transform">
            {product.brand ? product.brand.slice(0, 2).toUpperCase() : 'JW'}
          </div>
          <span className="text-xs uppercase font-medium tracking-widest text-neutral-500">
            {product.brand}
          </span>
        </div>

        {/* Stock status pill */}
        <div className="absolute top-3 right-3">
          {isInStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 border border-neutral-200 shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Variant count pill */}
        {product.variants_count > 1 && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center rounded-md bg-white/90 backdrop-blur px-2 py-0.5 text-[11px] font-medium text-neutral-700 shadow-xs">
              {product.variants_count} variants
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-semibold uppercase tracking-wider text-neutral-800">
            {product.brand}
          </span>
          <span>&bull;</span>
          <span className="truncate">{product.product_type_name}</span>
        </div>

        <h3 className="mt-2 text-base font-semibold text-neutral-900 group-hover:text-black line-clamp-1">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {product.description && (
          <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-neutral-600 block font-medium">
              Price
            </span>
            <span className="text-base font-bold text-neutral-900">
              {priceDisplay}
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-neutral-800 transition-colors"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
