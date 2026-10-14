'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { toCents, fromCents } from './format';

export interface CartItem {
  variantId: number;
  variantSku: string;
  variantName: string;
  productName: string;
  productSlug: string;
  brand: string;
  /** Decimal string price sourced directly from backend */
  price: string;
  quantity: number;
  inventoryQuantity: number;
  attributes?: Record<string, unknown> | null;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  removeItem: (variantId: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: string;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'jackson_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage parsing errors
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage quota or disabled
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    if (quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        const maxStock = item.inventoryQuantity;
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: newQty } : i,
        );
      }
      const initialQty = Math.min(quantity, item.inventoryQuantity);
      return [...prev, { ...item, quantity: initialQty }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.variantId !== variantId);
      }
      return prev.map((i) => {
        if (i.variantId !== variantId) return i;
        const clamped = Math.min(quantity, i.inventoryQuantity);
        return { ...i, quantity: clamped };
      });
    });
  };

  const removeItem = (variantId: number) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(() => {
    const totalCents = items.reduce((sum, item) => {
      const itemCents = toCents(item.price);
      return sum + itemCents * item.quantity;
    }, 0);
    return fromCents(totalCents);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
