'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice, toCents, fromCents } from '@/lib/format';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Review your selected salon and beauty products before checkout.
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-16 text-center shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="mt-6 text-xl font-bold text-neutral-900">
            Your cart is currently empty
          </h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
            You haven&apos;t added any products yet. Browse our curated hair care, barber supplies, and salon equipment.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-neutral-800 transition-colors"
            >
              &larr; Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items list */}
          <div className="lg:col-span-8 rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-900">
                Cart Items ({totalItems})
              </span>
              <span className="text-xs text-neutral-500">
                Prices sourced directly from backend catalog
              </span>
            </div>

            <ul className="divide-y divide-neutral-100">
              {items.map((item) => {
                const lineTotal = fromCents(toCents(item.price) * item.quantity);
                return (
                  <li key={item.variantId} className="p-6 flex flex-col sm:flex-row gap-6 justify-between">
                    <div className="flex-1 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        {item.brand}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 hover:underline">
                        <Link href={`/products/${item.productSlug}`}>
                          {item.productName}
                        </Link>
                      </h3>
                      <p className="text-sm text-neutral-700">
                        Selected Option: <span className="font-semibold">{item.variantName}</span>
                      </p>
                      <p className="text-xs font-mono text-neutral-400">
                        SKU: {item.variantSku}
                      </p>
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1 text-[11px] text-neutral-600">
                          {Object.entries(item.attributes).map(([k, v]) => (
                            <span key={k} className="rounded bg-neutral-100 px-2 py-0.5">
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                      {/* Quantity controls */}
                      <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-3 py-1 text-sm text-neutral-600 hover:text-black transition-colors"
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= item.inventoryQuantity}
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-3 py-1 text-sm text-neutral-600 hover:text-black disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          &#43;
                        </button>
                      </div>

                      {/* Price info */}
                      <div className="text-right">
                        <span className="block text-base font-black text-neutral-900">
                          {formatPrice(lineTotal)}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {formatPrice(item.price)} each
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="text-xs text-neutral-400 hover:text-rose-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
              <Link
                href="/"
                className="text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Order Summary
            </h2>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <dt>Subtotal ({totalItems} items)</dt>
                <dd className="font-semibold text-neutral-900">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-neutral-600">
                <dt>Shipping</dt>
                <dd className="text-emerald-700 font-medium">Free Standard</dd>
              </div>
              <div className="flex justify-between text-neutral-600">
                <dt>Estimated Tax</dt>
                <dd className="text-neutral-500">Calculated at checkout</dd>
              </div>

              <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                <dt className="text-base font-bold text-neutral-900">Estimated Total</dt>
                <dd className="text-2xl font-black text-neutral-900">{formatPrice(subtotal)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => alert(`Order checkout initiated for ${formatPrice(subtotal)}. Thank you!`)}
              className="w-full rounded-xl bg-neutral-900 py-4 text-center text-sm font-bold text-white shadow-md hover:bg-neutral-800 transition-colors"
            >
              Proceed to Checkout &rarr;
            </button>

            <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200 text-xs text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-700">Single-Vendor Assurance</p>
              <p>Every product variant is verified and shipped from the authorized Jackson warehouse.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
