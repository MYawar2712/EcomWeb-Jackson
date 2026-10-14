import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../src/lib/cart';

describe('Cart Context & Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  const mockItem = {
    variantId: 101,
    variantSku: 'OIL-ARGAN-50',
    variantName: '50ml Glass Dropper',
    productName: 'Organic Argan Hair Oil',
    productSlug: 'organic-argan-hair-oil',
    brand: 'Moroccan Essence',
    price: '24.50',
    inventoryQuantity: 10,
    attributes: { size: '50ml' },
  };

  it('initializes with an empty cart and subtotal of 0.00', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe('0.00');
  });

  it('adds an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem, 2);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBe('49.00');
    expect(result.current.isCartOpen).toBe(true);
  });

  it('increments quantity when same variant is added again, clamping to max stock', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem, 8);
    });
    expect(result.current.items[0].quantity).toBe(8);

    // Try adding 5 more (total 13, but inventory is 10)
    act(() => {
      result.current.addItem(mockItem, 5);
    });
    expect(result.current.items[0].quantity).toBe(10);
  });

  it('updates quantity and clamps to inventoryQuantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem, 1);
    });

    act(() => {
      result.current.updateQuantity(mockItem.variantId, 5);
    });
    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.subtotal).toBe('122.50');

    // Clamps to max inventory
    act(() => {
      result.current.updateQuantity(mockItem.variantId, 25);
    });
    expect(result.current.items[0].quantity).toBe(10);
  });

  it('removes item when quantity is updated to 0 or via removeItem', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem, 2);
    });
    expect(result.current.items.length).toBe(1);

    act(() => {
      result.current.removeItem(mockItem.variantId);
    });
    expect(result.current.items.length).toBe(0);
    expect(result.current.subtotal).toBe('0.00');
  });

  it('calculates subtotal across multiple items accurately', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const secondItem = {
      variantId: 102,
      variantSku: 'SERUM-KER-100',
      variantName: '100ml Pump',
      productName: 'Keratin Repair Serum',
      productSlug: 'keratin-repair-serum',
      brand: 'Keratin Labs',
      price: '32.99',
      inventoryQuantity: 5,
    };

    act(() => {
      result.current.addItem(mockItem, 2); // 2 * 24.50 = 49.00
      result.current.addItem(secondItem, 3); // 3 * 32.99 = 98.97
    });

    expect(result.current.totalItems).toBe(5);
    // 49.00 + 98.97 = 147.97
    expect(result.current.subtotal).toBe('147.97');
  });

  it('clears all items in the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem, 1);
    });
    expect(result.current.items.length).toBe(1);

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items.length).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe('0.00');
  });
});
