'use client';

import { useState } from 'react';
import type { ProductDetail, ProductVariantRead } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';

export interface AddToCartFormProps {
  product: ProductDetail;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addItem, openCart } = useCart();
  const variants = product.variants || [];

  // Default to first variant if available
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants.length > 0 ? variants[0].id : null,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const selectedVariant: ProductVariantRead | undefined = variants.find(
    (v) => v.id === selectedVariantId,
  );

  const isOutOfStock =
    !selectedVariant || selectedVariant.inventory_quantity <= 0 || !selectedVariant.is_active;

  const handleVariantChange = (id: number) => {
    setSelectedVariantId(id);
    setQuantity(1);
    setAddedNotice(null);
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant || isOutOfStock) return;

    addItem(
      {
        variantId: selectedVariant.id,
        variantSku: selectedVariant.sku,
        variantName: selectedVariant.name,
        productName: product.name,
        productSlug: product.slug,
        brand: product.brand,
        price: selectedVariant.price,
        inventoryQuantity: selectedVariant.inventory_quantity,
        attributes: selectedVariant.attributes,
      },
      quantity,
    );

    setAddedNotice(`Added ${quantity} × ${selectedVariant.name} to your cart`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  if (variants.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        No variants currently available for this product.
      </div>
    );
  }

  return (
    <form onSubmit={handleAddToCart} className="space-y-6">
      {/* Variant Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-bold uppercase tracking-wider text-neutral-800">
          Select Option / Variant
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {variants.map((v) => {
            const isSelected = v.id === selectedVariantId;
            const hasStock = v.inventory_quantity > 0 && v.is_active;

            return (
              <button
                type="button"
                key={v.id}
                onClick={() => handleVariantChange(v.id)}
                className={`relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900/5 ring-1 ring-neutral-900 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                } ${!hasStock ? 'opacity-60 bg-neutral-50' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-sm text-neutral-900">
                    {v.name}
                  </span>
                  <span className="font-bold text-sm text-neutral-900">
                    {formatPrice(v.price)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-neutral-500 w-full">
                  <span className="font-mono">SKU: {v.sku}</span>
                  {hasStock ? (
                    <span className="text-emerald-700 font-medium">
                      {v.inventory_quantity} in stock
                    </span>
                  ) : (
                    <span className="text-rose-600 font-medium">Out of stock</span>
                  )}
                </div>

                {v.attributes && Object.keys(v.attributes).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-neutral-600">
                    {Object.entries(v.attributes).map(([k, val]) => (
                      <span
                        key={k}
                        className="rounded bg-neutral-100 px-1.5 py-0.5"
                      >
                        {k}: {String(val)}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Variant Price & Stock Info */}
      {selectedVariant && (
        <div className="flex items-baseline justify-between rounded-xl bg-neutral-50 p-4 border border-neutral-200">
          <div>
            <span className="block text-xs uppercase tracking-wider text-neutral-500">
              Unit Price
            </span>
            <span className="text-2xl font-black text-neutral-900">
              {formatPrice(selectedVariant.price)}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs uppercase tracking-wider text-neutral-500">
              Availability
            </span>
            <span
              className={`text-sm font-semibold ${
                selectedVariant.inventory_quantity > 0
                  ? 'text-emerald-700'
                  : 'text-rose-600'
              }`}
            >
              {selectedVariant.inventory_quantity > 0
                ? `${selectedVariant.inventory_quantity} units ready to ship`
                : 'Currently out of stock'}
            </span>
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center rounded-xl border border-neutral-300 bg-white shadow-xs">
          <button
            type="button"
            disabled={quantity <= 1 || isOutOfStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3.5 py-3 text-neutral-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span className="w-10 text-center font-bold text-sm text-neutral-900 select-none">
            {quantity}
          </span>
          <button
            type="button"
            disabled={
              !selectedVariant ||
              quantity >= selectedVariant.inventory_quantity ||
              isOutOfStock
            }
            onClick={() =>
              setQuantity((q) =>
                selectedVariant
                  ? Math.min(selectedVariant.inventory_quantity, q + 1)
                  : q,
              )
            }
            className="px-3.5 py-3 text-neutral-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            &#43;
          </button>
        </div>

        <button
          type="submit"
          disabled={isOutOfStock}
          className="flex-1 rounded-xl bg-neutral-900 px-6 py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all"
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>

      {/* Notice feedback */}
      {addedNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{addedNotice}</span>
          </div>
          <button
            type="button"
            onClick={openCart}
            className="font-bold underline text-emerald-900 hover:text-emerald-950"
          >
            View Cart
          </button>
        </div>
      )}
    </form>
  );
}
