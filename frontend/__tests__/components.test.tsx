import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Breadcrumbs } from '../src/components/Breadcrumbs';
import { CategoryCard } from '../src/components/CategoryCard';
import { ProductCard } from '../src/components/ProductCard';
import { EmptyState } from '../src/components/EmptyState';
import { ErrorMessage } from '../src/components/ErrorMessage';
import { AddToCartForm } from '../src/components/AddToCartForm';
import { CartProvider } from '../src/lib/cart';
import type { CategorySummary, ProductListItem, ProductDetail } from '../src/lib/types';

describe('Frontend UI Components', () => {
  describe('Breadcrumbs', () => {
    it('renders breadcrumb links and active page label', () => {
      render(
        <Breadcrumbs
          items={[
            { label: 'Hair Care', href: '/categories/hair-care' },
            { label: 'Hair Oil' },
          ]}
        />,
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Hair Care')).toBeInTheDocument();
      expect(screen.getByText('Hair Oil')).toBeInTheDocument();
    });
  });

  describe('CategoryCard', () => {
    const mockCategory: CategorySummary = {
      id: 1,
      name: 'Hair Care Products',
      slug: 'hair-care-products',
      description: 'Professional formulas for healthy hair',
      product_types_count: 3,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    it('renders category name, description, and link', () => {
      render(<CategoryCard category={mockCategory} />);

      expect(screen.getByText('Hair Care Products')).toBeInTheDocument();
      expect(
        screen.getByText('Professional formulas for healthy hair'),
      ).toBeInTheDocument();
      expect(screen.getByText('3 Product Types')).toBeInTheDocument();
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/categories/hair-care-products');
    });
  });

  describe('ProductCard', () => {
    const mockProduct: ProductListItem = {
      id: 10,
      name: 'Argan Hydrating Oil',
      slug: 'argan-hydrating-oil',
      brand: 'Moroccan Essence',
      description: 'Rich hydrating oil with vitamin E',
      is_active: true,
      product_type_id: 1,
      product_type_name: 'Hair Oil',
      product_type_slug: 'hair-oil',
      category_id: 1,
      category_name: 'Hair Care Products',
      category_slug: 'hair-care-products',
      min_price: '18.00',
      max_price: '28.00',
      total_stock: 15,
      variants_count: 2,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    it('renders product details, brand, price range, and in stock badge', () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText('Argan Hydrating Oil')).toBeInTheDocument();
      expect(screen.getAllByText('Moroccan Essence').length).toBeGreaterThan(0);
      expect(screen.getByText('$18.00 – $28.00')).toBeInTheDocument();
      expect(screen.getByText('In Stock')).toBeInTheDocument();
      expect(screen.getByText('2 variants')).toBeInTheDocument();
    });

    it('renders out of stock badge when total_stock is 0', () => {
      const outOfStock = { ...mockProduct, total_stock: 0 };
      render(<ProductCard product={outOfStock} />);
      expect(screen.getByText('Sold Out')).toBeInTheDocument();
    });
  });

  describe('EmptyState & ErrorMessage', () => {
    it('renders EmptyState with custom title and message', () => {
      render(
        <EmptyState
          title="No Hair Serums Available"
          message="Check back soon for restocks."
        />,
      );
      expect(screen.getByText('No Hair Serums Available')).toBeInTheDocument();
      expect(screen.getByText('Check back soon for restocks.')).toBeInTheDocument();
    });

    it('renders ErrorMessage with retry button trigger', () => {
      const handleRetry = jest.fn();
      render(
        <ErrorMessage
          title="Network Timeout"
          message="Failed to connect"
          statusCode={504}
          onRetry={handleRetry}
        />,
      );
      expect(screen.getByText('Network Timeout (504)')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Try Again'));
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('AddToCartForm', () => {
    const mockDetail: ProductDetail = {
      id: 20,
      name: 'Professional Ceramic Clipper',
      slug: 'pro-ceramic-clipper',
      brand: 'BarberTech',
      description: 'Precision cordless clipper with titanium blade',
      is_active: true,
      product_type: {
        id: 2,
        category_id: 2,
        name: 'Hair Clippers',
        slug: 'hair-clippers',
        description: null,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      category: {
        id: 2,
        name: 'Barber Supplies',
        slug: 'barber-supplies',
        description: null,
        product_types_count: 3,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      min_price: '89.00',
      max_price: '119.00',
      total_stock: 7,
      variants: [
        {
          id: 201,
          product_id: 20,
          sku: 'CLIP-STD-BLK',
          name: 'Standard Black',
          price: '89.00',
          inventory_quantity: 5,
          is_active: true,
          barcode: null,
          attributes: { color: 'Black' },
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
        {
          id: 202,
          product_id: 20,
          sku: 'CLIP-PRO-GLD',
          name: 'Gold Limited Edition',
          price: '119.00',
          inventory_quantity: 2,
          is_active: true,
          barcode: null,
          attributes: { color: 'Gold' },
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    it('renders variants and switches selected price on click', () => {
      render(
        <CartProvider>
          <AddToCartForm product={mockDetail} />
        </CartProvider>,
      );

      // Default variant 1 selected ($89.00)
      expect(screen.getByText('Standard Black')).toBeInTheDocument();
      expect(screen.getByText('Gold Limited Edition')).toBeInTheDocument();
      expect(screen.getByText('5 units ready to ship')).toBeInTheDocument();

      // Click on Gold variant
      fireEvent.click(screen.getByText('Gold Limited Edition'));
      expect(screen.getByText('2 units ready to ship')).toBeInTheDocument();
    });

    it('adjusts quantity and triggers add to cart', () => {
      render(
        <CartProvider>
          <AddToCartForm product={mockDetail} />
        </CartProvider>,
      );

      // Increase quantity to 2
      const plusBtn = screen.getByRole('button', { name: 'Increase quantity' });
      fireEvent.click(plusBtn);
      expect(screen.getByText('2')).toBeInTheDocument();

      // Click Add to Cart
      const submitBtn = screen.getByRole('button', { name: 'Add to Cart' });
      fireEvent.click(submitBtn);

      expect(
        screen.getByText('Added 2 × Standard Black to your cart'),
      ).toBeInTheDocument();
    });
  });
});
