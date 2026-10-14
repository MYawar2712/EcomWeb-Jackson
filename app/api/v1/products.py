import math
from decimal import Decimal
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.product_service import ProductService
from app.schemas.product import ProductListItem, ProductDetail
from app.schemas.common import PaginatedResponse, PaginationMeta

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=PaginatedResponse[ProductListItem], summary="List products with filtering and pagination")
def list_products(
    category_slug: Optional[str] = Query(None, description="Filter by category slug"),
    product_type_slug: Optional[str] = Query(None, description="Filter by product type slug"),
    brand: Optional[str] = Query(None, description="Filter by brand name (case-insensitive)"),
    min_price: Optional[Decimal] = Query(None, ge=0, description="Minimum price filter across variants"),
    max_price: Optional[Decimal] = Query(None, ge=0, description="Maximum price filter across variants"),
    in_stock: Optional[bool] = Query(None, description="Filter by stock availability"),
    search: Optional[str] = Query(None, description="Search term in product name, brand, or description"),
    sort_by: str = Query("name_asc", description="Sort order: name_asc, name_desc, brand_asc, brand_desc, newest, oldest"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """Retrieve a paginated list of products supporting multifaceted filtering and sorting."""
    items, total_items = ProductService.list_products(
        db=db,
        category_slug=category_slug,
        product_type_slug=product_type_slug,
        brand=brand,
        min_price=min_price,
        max_price=max_price,
        in_stock=in_stock,
        search=search,
        sort_by=sort_by,
        page=page,
        page_size=page_size,
    )

    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 0

    return PaginatedResponse(
        items=items,
        pagination=PaginationMeta(
            page=page,
            page_size=page_size,
            total_items=total_items,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1 and total_pages > 0,
        ),
    )


@router.get("/{slug}", response_model=ProductDetail, summary="Get product details by slug")
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve single product details by slug, including full variant breakdowns and taxonomy."""
    return ProductService.get_product_by_slug(db, slug)
