'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice, toCents, fromCents } from '@/lib/format';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-neutral-900">Your Cart</h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
              {totalItems}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-neutral-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-xs">
                Browse our professional salon products and hair care collections to find what you need.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-6 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => {
                const lineTotal = fromCents(toCents(item.price) * item.quantity);
                return (
                  <li key={item.variantId} className="py-4 flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            {item.brand}
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-900 hover:underline">
                            <Link href={`/products/${item.productSlug}`} onClick={closeCart}>
                              {item.productName}
                            </Link>
                          </h4>
                          <p className="text-xs text-neutral-600 mt-0.5">
                            Option: <span className="font-medium text-neutral-900">{item.variantName}</span>
                          </p>
                          <p className="text-[11px] font-mono text-neutral-400">
                            SKU: {item.variantSku}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-neutral-400 hover:text-rose-600 p-1 text-xs transition-colors"
                          aria-label={`Remove ${item.productName}`}
                        >
                          &times; Remove
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity adjuster */}
                        <div className="flex items-center rounded-lg border border-neutral-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="px-2 py-1 text-xs text-neutral-600 hover:text-black"
                            aria-label="Decrease quantity"
                          >
                            &minus;
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= item.inventoryQuantity}
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="px-2 py-1 text-xs text-neutral-600 hover:text-black disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            &#43;
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="block text-xs font-bold text-neutral-900">
                            {formatPrice(lineTotal)}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {formatPrice(item.price)} each
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50 p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-lg font-black text-neutral-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Taxes, shipping, and promotional discounts calculated at checkout.
            </p>

            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full rounded-xl bg-neutral-900 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-colors"
              >
                View Cart &amp; Checkout
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-xs font-medium text-neutral-500 hover:text-rose-600 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
