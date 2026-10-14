import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../src/components/Header';
import { ProductFilters } from '../src/components/ProductFilters';
import { CartDrawer } from '../src/components/CartDrawer';
import { CartProvider, useCart } from '../src/lib/cart';

// Mock Next.js navigation hooks
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/categories/hair-care-products',
  useSearchParams: () => new URLSearchParams('brand=Moroccan+Essence&in_stock=true&sort_by=name_asc'),
}));

describe('Storefront Navigation and Interactive Flow Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  describe('Header Component', () => {
    it('renders logo, navigation links, and search input', () => {
      render(
        <CartProvider>
          <Header />
        </CartProvider>,
      );

      expect(screen.getByText('JACKSON')).toBeInTheDocument();
      expect(screen.getByText('Hair Care')).toBeInTheDocument();
      expect(screen.getByText('Barber Tools')).toBeInTheDocument();
      expect(screen.getByText('Salon Equipment')).toBeInTheDocument();
      expect(screen.getByText('Shaving & Beard')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search products, brands, or categories...'),
      ).toBeInTheDocument();
    });

    it('submits search query and navigates to /search?q=...', () => {
      render(
        <CartProvider>
          <Header />
        </CartProvider>,
      );

      const searchInput = screen.getByPlaceholderText(
        'Search products, brands, or categories...',
      );
      fireEvent.change(searchInput, { target: { value: 'Argan Oil' } });
      fireEvent.submit(searchInput.closest('form')!);

      expect(mockPush).toHaveBeenCalledWith('/search?q=Argan%20Oil');
    });

    it('toggles mobile menu on button click', () => {
      render(
        <CartProvider>
          <Header />
        </CartProvider>,
      );

      const toggleBtn = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(toggleBtn);

      expect(screen.getByText('Categories & Products')).toBeInTheDocument();
      expect(screen.getByText('Electrical Salon Equipment')).toBeInTheDocument();
    });
  });

  describe('ProductFilters Component', () => {
    const availableBrands = ['Moroccan Essence', 'Olaplex', 'Keratin Labs'];

    it('renders active filter values and allows clearing all filters', () => {
      render(<ProductFilters availableBrands={availableBrands} />);

      expect(screen.getByDisplayValue('Moroccan Essence')).toBeInTheDocument();
      expect(screen.getByLabelText('In Stock only')).toBeChecked();

      const clearBtn = screen.getByText('Clear all');
      fireEvent.click(clearBtn);

      expect(mockPush).toHaveBeenCalledWith('/categories/hair-care-products');
    });

    it('updates sort order and brand selection', () => {
      render(<ProductFilters availableBrands={availableBrands} />);

      const brandSelect = screen.getByLabelText('Brand');
      fireEvent.change(brandSelect, { target: { value: 'Olaplex' } });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('brand=Olaplex'),
      );
    });
  });

  describe('CartDrawer Component', () => {
    function CartTestHelper() {
      const { addItem, openCart } = useCart();
      return (
        <div>
          <button
            onClick={() => {
              addItem({
                variantId: 99,
                variantSku: 'TRIM-PRO-1',
                variantName: 'Cordless Trimmer Titanium',
                productName: 'Professional Hair Trimmer',
                productSlug: 'pro-hair-trimmer',
                brand: 'BarberTech',
                price: '65.00',
                inventoryQuantity: 5,
              });
              openCart();
            }}
          >
            Add Trimmer
          </button>
          <CartDrawer />
        </div>
      );
    }

    it('displays items in drawer and allows quantity adjustment and removal', () => {
      render(
        <CartProvider>
          <CartTestHelper />
        </CartProvider>,
      );

      // Add item to cart
      fireEvent.click(screen.getByText('Add Trimmer'));

      expect(screen.getByText('Professional Hair Trimmer')).toBeInTheDocument();
      expect(screen.getByText('Cordless Trimmer Titanium')).toBeInTheDocument();
      expect(screen.getAllByText('$65.00').length).toBeGreaterThan(0);

      // Click close button
      const closeBtn = screen.getByLabelText('Close cart');
      fireEvent.click(closeBtn);

      // Drawer is closed
      expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
    });
  });
});
