from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.category import CategorySummary
from app.schemas.product_type import ProductTypeSummary
from app.schemas.product_variant import ProductVariantRead


class ProductBase(BaseModel):
    name: str = Field(..., max_length=200)
    slug: str = Field(..., max_length=220)
    brand: str = Field(..., max_length=100)
    description: Optional[str] = None
    is_active: bool = True


class ProductListItem(BaseModel):
    id: int
    name: str
    slug: str
    brand: str
    description: Optional[str] = None
    is_active: bool
    product_type_id: int
    product_type_name: str
    product_type_slug: str
    category_id: int
    category_name: str
    category_slug: str
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    total_stock: int = 0
    variants_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductDetail(BaseModel):
    id: int
    name: str
    slug: str
    brand: str
    description: Optional[str] = None
    is_active: bool
    product_type: ProductTypeSummary
    category: CategorySummary
    variants: List[ProductVariantRead] = []
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    total_stock: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
