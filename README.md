# Jackson Backend API

High-performance REST backend service for Jackson's salon, barber, and beauty supplies platform. Built with **FastAPI**, **Python 3**, **PostgreSQL**, **SQLAlchemy 2.x**, **Alembic**, and **Pydantic v2**.

---

## Architecture & Features

- **Strict Taxonomy Seed**: Seeds strictly Jackson's nine confirmed categories and their 78 product types. Never invents mock brands, products, prices, or inventory.
- **Multiple Brands & Variants**: Fully supports multiple brands per product type and multiple variants per product.
- **Variant-Level Economics**: Price and inventory are strictly tracked per sellable variant.
- **Database Integrity & Constraints**:
  - Unique category names and slugs (`categories.name`, `categories.slug`)
  - Unique product type slugs (`product_types.slug`)
  - Composite unique constraint on category and product type name (`uq_category_product_type_name`)
  - Unique product slugs (`products.slug`)
  - Unique SKU per variant (`product_variants.sku`)
  - Database check constraints: `price >= 0` and `inventory_quantity >= 0`
  - Foreign key cascades (`CASCADE` on category -> product types and product -> variants; `RESTRICT` on product type -> products)
- **Alembic Migrations**: Full version-controlled schema migrations with autogenerate and batch mode support.
- **Clean Service Layer**: Decoupled database operations and query logic in `app/services/`.
- **Environment Configuration**: Powered by `pydantic-settings` with `.env` file support and Docker Compose for PostgreSQL.
- **Structured Error Envelope**: Standardized error schema across 404, 409, 422, and 500 responses.
- **Automated Test Suite**: 20 comprehensive unit, integration, constraint, and seed tests with 100% pass rate.

---

## Tech Stack

| Component | Technology |
|---|---|
| Web Framework | FastAPI |
| Language | Python 3.13+ |
| Database | PostgreSQL (with SQLite compatibility for fast local tests) |
| ORM | SQLAlchemy 2.x (Mapped column syntax) |
| Migrations | Alembic |
| Data Validation | Pydantic v2 / Pydantic Settings |
| Testing | Pytest, HTTPX, Pytest-Asyncio |

---

## Directory Structure

```
├── alembic/                    # Database migration scripts & configuration
│   ├── versions/               # Versioned migration scripts
│   └── env.py                  # Alembic environment runner
├── app/
│   ├── api/
│   │   ├── deps.py             # Dependency injection (e.g., get_db)
│   │   └── v1/
│   │       ├── categories.py   # Category endpoints
│   │       ├── health.py       # Health check endpoint
│   │       ├── product_types.py# Product type endpoints
│   │       ├── products.py     # Product listing, filtering, detail endpoints
│   │       └── router.py       # Aggregated v1 router
│   ├── core/
│   │   ├── config.py           # Pydantic Settings
│   │   ├── database.py         # SQLAlchemy engine & session factory
│   │   └── errors.py           # Standardized error classes and handlers
│   ├── models/                 # SQLAlchemy 2.x ORM models
│   │   ├── category.py         # Category model
│   │   ├── product_type.py     # ProductType model
│   │   ├── product.py          # Product model (brand, type relationship)
│   │   └── product_variant.py  # ProductVariant model (price, inventory, SKU)
│   ├── schemas/                # Pydantic schemas (DTo & serialization)
│   │   ├── category.py
│   │   ├── common.py           # PaginationMeta, PaginatedResponse, ErrorEnvelope
│   │   ├── product_type.py
│   │   ├── product.py
│   │   └── product_variant.py
│   ├── seeds/
│   │   ├── seed_data.py        # Jackson's 9 confirmed categories & 78 product types
│   │   └── seed.py             # Idempotent seeding logic
│   ├── services/               # Business and query logic
│   │   ├── category_service.py
│   │   ├── product_type_service.py
│   │   └── product_service.py
│   └── main.py                 # FastAPI application factory
├── tests/                      # Automated test suite
│   ├── conftest.py             # Test database and client fixtures
│   ├── test_categories.py
│   ├── test_constraints.py
│   ├── test_health.py
│   ├── test_product_types.py
│   ├── test_products.py
│   ├── test_seeds.py
│   └── test_validation_and_sorting.py
├── docker-compose.yml          # PostgreSQL container definition
├── alembic.ini                 # Alembic configuration
├── pyproject.toml              # Project metadata & pytest configuration
├── requirements.txt            # Python dependencies
├── openapi.json                # Exported OpenAPI 3.1 specification
└── seed_db.py                  # Seeding execution script
```

---

## Setup & Quickstart

### 1. Clone & Set Up Virtual Environment

```bash
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

To run with PostgreSQL (Docker):

```bash
docker compose up -d
```

Ensure `DATABASE_URL` in `.env` is set to:
```env
DATABASE_URL="postgresql+psycopg://jackson:jackson_pass@localhost:5432/jackson_db"
```

*(Note: SQLite `sqlite:///./jackson.db` is also supported for rapid development and testing without starting Docker).*

### 3. Run Database Migrations

Apply the latest Alembic migrations to create tables, indexes, and constraints:

```bash
alembic upgrade head
```

### 4. Seed Jackson's Confirmed Taxonomy

Run the seed script to populate Jackson's nine confirmed categories and 78 product types:

```bash
python seed_db.py
```

*Output:*
```
INFO:seed:Seeding complete: 9 categories and 78 product types verified/created.
```

### 5. Start the API Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API Base URL: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

---

## Confirmed Categories & Product Types Seeded

The seed script idempotently populates strictly the following 9 categories and their confirmed product types:

1. **Hair Care Products**: Hair Oil, Hair Serum, Hair Mask, Hair Tonic, Keratin & Rebonding Creams
2. **Hair Styling Products**: Hair Spray, Hair Wax, Hair Gel, Hair Mousse, Styling Powder, Curl Defining Cream, Hair Clay, Hair Setting Lotion
3. **Barber Tools & Accessories**: Hair-Cutting Scissors, Thinning Scissors, Barber Combs, Cutting Combs, Fade Combs, Hair Brushes, Neck Brushes, Straight Razors, Razor Blades, Manual Clippers, Clipper Guards
4. **Shaving & Beard Care**: Shaving Foam, Shaving Cream, Shaving Gel, Aftershave Lotion, Beard Oil, Beard Balm, Beard Wax, Shaving Brushes
5. **Hair Colors & Dyes**: Permanent Hair Dye, Hair Bleach Powder, Semi-Permanent Hair Color, Temporary Hair Color, Cream Bleach
6. **Skin Care**: Face Wash, Facial Cleanser, Moisturizer, Face Scrub, Face Mask, Sunscreen, Toner, Facial Serum, Blackhead Removal Products, Facial Cleansing Tools, Facial Kits
7. **Electrical Salon Equipment**: Hair Dryer, Hair Straightener, Curling Iron, Hair Trimmer, Professional Hair Clipper, Electric Shaver, Clipper Charging Accessories
8. **Nail & Beauty Accessories**: Nail Clippers, Nail Files, Cuticle Cutters, Tweezers, Pedicure Tools, Manicure Sets, Nail Scissors, Eyelash Curlers, Makeup Brushes, Facial Razors, Beauty Spatulas
9. **Professional Salon Supplies**: Hair-Cutting Aprons, Barber Capes, Salon Towels, Neck Strips, Disposable Gloves, Spray Bottles, Mixing Bowls, Color Application Brushes, Hair Sectioning Clips, Salon Disinfectants, Tool Cleaning Solutions, Disposable Applicators

---

## REST Endpoints Specification

### 1. Health Check
- `GET /health` or `GET /api/health`
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "app": "Jackson Backend API",
  "version": "1.0.0",
  "environment": "development",
  "database": "connected"
}
```

### 2. List Categories
- `GET /api/categories`
- **Response `200 OK`**:
```json
[
  {
    "id": 1,
    "name": "Hair Care Products",
    "slug": "hair-care-products",
    "description": "Professional hair care treatments, serums, masks, tonics, and rebonding products.",
    "product_types_count": 5,
    "created_at": "2026-10-14T11:00:00Z",
    "updated_at": "2026-10-14T11:00:00Z"
  }
]
```

### 3. Get Category by Slug
- `GET /api/categories/{slug}`
- **Example**: `GET /api/categories/hair-care-products`
- **Response `200 OK`**:
```json
{
  "id": 1,
  "name": "Hair Care Products",
  "slug": "hair-care-products",
  "description": "Professional hair care treatments, serums, masks, tonics, and rebonding products.",
  "created_at": "2026-10-14T11:00:00Z",
  "updated_at": "2026-10-14T11:00:00Z",
  "product_types": [
    {
      "id": 1,
      "category_id": 1,
      "name": "Hair Oil",
      "slug": "hair-oil",
      "description": "Hair Oil in Hair Care Products",
      "created_at": "2026-10-14T11:00:00Z",
      "updated_at": "2026-10-14T11:00:00Z"
    }
  ]
}
```

### 4. Get Product Type by Slug
- `GET /api/product-types/{slug}`
- **Example**: `GET /api/product-types/hair-oil`
- **Response `200 OK`**:
```json
{
  "id": 1,
  "category_id": 1,
  "name": "Hair Oil",
  "slug": "hair-oil",
  "description": "Hair Oil in Hair Care Products",
  "created_at": "2026-10-14T11:00:00Z",
  "updated_at": "2026-10-14T11:00:00Z",
  "category": {
    "id": 1,
    "name": "Hair Care Products",
    "slug": "hair-care-products",
    "description": "Professional hair care treatments...",
    "created_at": "2026-10-14T11:00:00Z",
    "updated_at": "2026-10-14T11:00:00Z"
  },
  "products_count": 2,
  "brands": [
    "LuxeBarber",
    "PureCare"
  ]
}
```

### 5. List Products (with Pagination & Filters)
- `GET /api/products`
- **Query Parameters**:
  - `category_slug`: Filter by parent category slug
  - `product_type_slug`: Filter by product type slug
  - `brand`: Filter by brand (case-insensitive)
  - `min_price`: Filter products having an active variant with price >= `min_price`
  - `max_price`: Filter products having an active variant with price <= `max_price`
  - `in_stock`: `true` (at least 1 active variant in stock) or `false` (all variants out of stock)
  - `search`: Case-insensitive text search across name, brand, and description
  - `sort_by`: `name_asc` (default), `name_desc`, `brand_asc`, `brand_desc`, `newest`, `oldest`
  - `page`: Page number (default: `1`, min: `1`)
  - `page_size`: Items per page (default: `20`, min: `1`, max: `100`)
- **Response `200 OK`**:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Argan Nourishing Oil",
      "slug": "argan-nourishing-oil",
      "brand": "LuxeBarber",
      "description": "Organic nourishing Moroccan argan oil for barbers.",
      "is_active": true,
      "product_type_id": 1,
      "product_type_name": "Hair Oil",
      "product_type_slug": "hair-oil",
      "category_id": 1,
      "category_name": "Hair Care Products",
      "category_slug": "hair-care-products",
      "min_price": "18.50",
      "max_price": "29.99",
      "total_stock": 35,
      "variants_count": 2,
      "created_at": "2026-10-14T11:00:00Z",
      "updated_at": "2026-10-14T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 1,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

### 6. Get Product by Slug
- `GET /api/products/{slug}`
- **Example**: `GET /api/products/argan-nourishing-oil`
- **Response `200 OK`**:
```json
{
  "id": 1,
  "name": "Argan Nourishing Oil",
  "slug": "argan-nourishing-oil",
  "brand": "LuxeBarber",
  "description": "Organic nourishing Moroccan argan oil for barbers.",
  "is_active": true,
  "product_type": {
    "id": 1,
    "category_id": 1,
    "name": "Hair Oil",
    "slug": "hair-oil",
    "description": "Hair Oil in Hair Care Products",
    "created_at": "2026-10-14T11:00:00Z",
    "updated_at": "2026-10-14T11:00:00Z"
  },
  "category": {
    "id": 1,
    "name": "Hair Care Products",
    "slug": "hair-care-products",
    "description": "Professional hair care treatments...",
    "created_at": "2026-10-14T11:00:00Z",
    "updated_at": "2026-10-14T11:00:00Z"
  },
  "variants": [
    {
      "id": 1,
      "product_id": 1,
      "sku": "ARG-50",
      "name": "50ml",
      "price": "18.50",
      "inventory_quantity": 25,
      "is_active": true,
      "barcode": null,
      "attributes": {"size": "50ml"},
      "created_at": "2026-10-14T11:00:00Z",
      "updated_at": "2026-10-14T11:00:00Z"
    },
    {
      "id": 2,
      "product_id": 1,
      "sku": "ARG-100",
      "name": "100ml",
      "price": "29.99",
      "inventory_quantity": 10,
      "is_active": true,
      "barcode": null,
      "attributes": {"size": "100ml"},
      "created_at": "2026-10-14T11:00:00Z",
      "updated_at": "2026-10-14T11:00:00Z"
    }
  ],
  "min_price": "18.50",
  "max_price": "29.99",
  "total_stock": 35,
  "created_at": "2026-10-14T11:00:00Z",
  "updated_at": "2026-10-14T11:00:00Z"
}
```

### 7. Structured Error Responses
All error conditions return a predictable envelope:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product with slug 'unknown' was not found.",
    "details": null
  }
}
```

---

## Running Automated Tests

Run the full automated test suite with pytest:

```bash
pytest -v
```

### Test Coverage Highlights
- `test_categories.py`: Empty vs seeded listings, retrieval by slug, 404 structured errors.
- `test_product_types.py`: Detail query, parent category resolution, brands list aggregation.
- `test_products.py`: Multi-brand support per product type, multi-variant pricing and stock, filters (`category_slug`, `product_type_slug`, `brand`, `min_price`, `max_price`, `in_stock`, `search`), sorting, pagination.
- `test_constraints.py`: Database-level constraints (negative prices check, negative stock check, unique slugs, unique SKU, composite unique category product type).
- `test_seeds.py`: Verifies only Jackson's 9 confirmed categories and 78 product types are seeded, with zero mock products/brands/prices/stock, and confirms idempotency.
- `test_validation_and_sorting.py`: Request validation errors (422) and multifaceted sorting orders.
