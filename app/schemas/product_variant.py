from datetime import datetime
from decimal import Decimal
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class ProductVariantBase(BaseModel):
    sku: str = Field(..., max_length=100, description="Unique stock keeping unit")
    name: str = Field(..., max_length=150, description="Variant name (e.g., 100ml, Matte Black)")
    price: Decimal = Field(..., ge=0, description="Selling price of the variant")
    inventory_quantity: int = Field(default=0, ge=0, description="Available stock level")
    is_active: bool = Field(default=True, description="Whether variant is active for sale")
    barcode: Optional[str] = Field(None, max_length=100, description="UPC/EAN barcode")
    attributes: Optional[Dict[str, Any]] = Field(None, description="Dynamic attributes (size, color, etc.)")


class ProductVariantCreate(ProductVariantBase):
    pass


class ProductVariantRead(ProductVariantBase):
    id: int
    product_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
