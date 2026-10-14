/**
 * TypeScript types exactly matching the Jackson Backend OpenAPI contract.
 * Source: openapi.json exported from the FastAPI backend.
 *
 * NOTE: price, min_price, max_price are returned as decimal strings by the backend.
 */

// ── Pagination ─────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ── Category ───────────────────────────────────────────────────────────────────

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  product_types_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductTypeInSubList {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  product_types: ProductTypeInSubList[];
}

// ── Product Type ───────────────────────────────────────────────────────────────

export interface ProductTypeSummary {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductTypeDetail {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  category: CategorySummary;
  products_count: number;
  brands: string[];
}

// ── Product Variant ────────────────────────────────────────────────────────────

export interface ProductVariantRead {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  /** Decimal string, e.g. "18.50" */
  price: string;
  inventory_quantity: number;
  is_active: boolean;
  barcode: string | null;
  attributes: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ── Product ────────────────────────────────────────────────────────────────────

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  brand: string;
  description: string | null;
  is_active: boolean;
  product_type_id: number;
  product_type_name: string;
  product_type_slug: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  /** Decimal string or null */
  min_price: string | null;
  /** Decimal string or null */
  max_price: string | null;
  total_stock: number;
  variants_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  brand: string;
  description: string | null;
  is_active: boolean;
  product_type: ProductTypeSummary;
  category: CategorySummary;
  variants: ProductVariantRead[];
  /** Decimal string or null */
  min_price: string | null;
  /** Decimal string or null */
  max_price: string | null;
  total_stock: number;
  created_at: string;
  updated_at: string;
}

// ── API error envelope ─────────────────────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  details: unknown | null;
}

export interface ApiErrorResponse {
  error: ApiError;
}

// ── Products list query params ─────────────────────────────────────────────────

export type ProductSortBy =
  | 'name_asc'
  | 'name_desc'
  | 'brand_asc'
  | 'brand_desc'
  | 'newest'
  | 'oldest';

export interface ProductListParams {
  category_slug?: string;
  product_type_slug?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
  sort_by?: ProductSortBy;
  page?: number;
  page_size?: number;
}
