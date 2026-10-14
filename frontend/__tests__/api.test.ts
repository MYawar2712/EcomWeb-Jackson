import {
  getCategories,
  getCategoryBySlug,
  getProductTypeBySlug,
  getProductBySlug,
  listProducts,
  ApiClientError,
} from '../src/lib/api';

describe('Jackson API Client', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('getCategories fetches /categories successfully', async () => {
    const mockCategories = [
      {
        id: 1,
        name: 'Hair Care Products',
        slug: 'hair-care-products',
        description: 'Shampoos, conditioners, and oils',
        product_types_count: 3,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCategories,
    });

    const result = await getCategories();
    expect(result).toEqual(mockCategories);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/categories'),
      expect.any(Object),
    );
  });

  it('getCategoryBySlug fetches /categories/:slug', async () => {
    const mockCategory = {
      id: 1,
      name: 'Hair Care Products',
      slug: 'hair-care-products',
      description: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      product_types: [],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCategory,
    });

    const result = await getCategoryBySlug('hair-care-products');
    expect(result).toEqual(mockCategory);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/categories/hair-care-products'),
      expect.any(Object),
    );
  });

  it('getProductTypeBySlug fetches /product-types/:slug', async () => {
    const mockProductType = {
      id: 10,
      category_id: 1,
      name: 'Hair Oil',
      slug: 'hair-oil',
      description: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      category: {
        id: 1,
        name: 'Hair Care Products',
        slug: 'hair-care-products',
        description: null,
        product_types_count: 3,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      products_count: 5,
      brands: ['Moroccan Essence', 'Olaplex'],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProductType,
    });

    const result = await getProductTypeBySlug('hair-oil');
    expect(result).toEqual(mockProductType);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/product-types/hair-oil'),
      expect.any(Object),
    );
  });

  it('listProducts serializes filter and pagination query params correctly', async () => {
    const mockResponse = {
      items: [],
      pagination: {
        page: 2,
        page_size: 10,
        total_items: 25,
        total_pages: 3,
        has_next: true,
        has_prev: true,
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await listProducts({
      category_slug: 'hair-care-products',
      brand: 'Moroccan Essence',
      min_price: 10,
      max_price: 50,
      in_stock: true,
      page: 2,
      page_size: 10,
      sort_by: 'name_asc',
    });

    expect(result).toEqual(mockResponse);
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain('category_slug=hair-care-products');
    expect(calledUrl).toContain('brand=Moroccan+Essence');
    expect(calledUrl).toContain('min_price=10');
    expect(calledUrl).toContain('max_price=50');
    expect(calledUrl).toContain('in_stock=true');
    expect(calledUrl).toContain('page=2');
    expect(calledUrl).toContain('page_size=10');
    expect(calledUrl).toContain('sort_by=name_asc');
  });

  it('throws ApiClientError with code and message on HTTP failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product with slug test-slug not found',
        },
      }),
    });

    await expect(getProductBySlug('test-slug')).rejects.toThrow(ApiClientError);
    try {
      await getProductBySlug('test-slug');
    } catch (err) {
      const apiErr = err as ApiClientError;
      expect(apiErr.status).toBe(404);
      expect(apiErr.code).toBe('PRODUCT_NOT_FOUND');
      expect(apiErr.message).toBe('Product with slug test-slug not found');
    }
  });

  it('throws ApiClientError on network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Connection refused'));

    await expect(getCategories()).rejects.toThrow(ApiClientError);
    try {
      await getCategories();
    } catch (err) {
      const apiErr = err as ApiClientError;
      expect(apiErr.code).toBe('NETWORK_ERROR');
    }
  });
});
