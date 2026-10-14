/**
 * Jackson API Client
 *
 * All API calls go through this client which reads NEXT_PUBLIC_API_BASE_URL.
 * In tests, set process.env.NEXT_PUBLIC_API_BASE_URL or mock fetchJson directly.
 */
import type {
  CategorySummary,
  CategoryDetail,
  ProductTypeDetail,
  ProductDetail,
  ProductListItem,
  PaginatedResponse,
  ProductListParams,
} from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

// ── Generic fetch helper ──────────────────────────────────────────────────────

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function fetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate: 60 }, // ISR – revalidate every 60s
      ...init,
    });
  } catch (networkErr) {
    throw new ApiClientError(
      0,
      'NETWORK_ERROR',
      `Network error reaching ${url}: ${(networkErr as Error).message}`,
    );
  }

  if (!response.ok) {
    let errorCode = 'HTTP_ERROR';
    let errorMessage = `HTTP ${response.status} from ${url}`;
    let errorDetails: unknown;
    try {
      const body = (await response.json()) as { error?: { code: string; message: string; details?: unknown } };
      if (body?.error) {
        errorCode = body.error.code;
        errorMessage = body.error.message;
        errorDetails = body.error.details;
      }
    } catch {
      // Body was not JSON; use defaults above
    }
    throw new ApiClientError(response.status, errorCode, errorMessage, errorDetails);
  }

  return response.json() as Promise<T>;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** GET /api/categories */
export async function getCategories(): Promise<CategorySummary[]> {
  return fetchJson<CategorySummary[]>('/categories');
}

/** GET /api/categories/:slug */
export async function getCategoryBySlug(slug: string): Promise<CategoryDetail> {
  return fetchJson<CategoryDetail>(`/categories/${encodeURIComponent(slug)}`);
}

/** GET /api/product-types/:slug */
export async function getProductTypeBySlug(slug: string): Promise<ProductTypeDetail> {
  return fetchJson<ProductTypeDetail>(`/product-types/${encodeURIComponent(slug)}`);
}

/** GET /api/products/:slug */
export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  return fetchJson<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
}

/** GET /api/products with filtering / pagination */
export async function listProducts(
  params: ProductListParams = {},
): Promise<PaginatedResponse<ProductListItem>> {
  const qs = new URLSearchParams();
  if (params.category_slug) qs.set('category_slug', params.category_slug);
  if (params.product_type_slug) qs.set('product_type_slug', params.product_type_slug);
  if (params.brand) qs.set('brand', params.brand);
  if (params.min_price !== undefined) qs.set('min_price', String(params.min_price));
  if (params.max_price !== undefined) qs.set('max_price', String(params.max_price));
  if (params.in_stock !== undefined) qs.set('in_stock', String(params.in_stock));
  if (params.search) qs.set('search', params.search);
  if (params.sort_by) qs.set('sort_by', params.sort_by);
  if (params.page !== undefined) qs.set('page', String(params.page));
  if (params.page_size !== undefined) qs.set('page_size', String(params.page_size));

  const query = qs.toString();
  return fetchJson<PaginatedResponse<ProductListItem>>(`/products${query ? `?${query}` : ''}`);
}

/** GET /api/health (for SSR health banner if needed) */
export async function getHealth(): Promise<{ status: string; database: string }> {
  return fetchJson<{ status: string; database: string }>('/health');
}
