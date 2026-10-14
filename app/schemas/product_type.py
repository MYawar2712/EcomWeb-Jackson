from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.category import CategorySummary


class ProductTypeBase(BaseModel):
    category_id: int
    name: str = Field(..., max_length=120)
    slug: str = Field(..., max_length=140)
    description: Optional[str] = None


class ProductTypeSummary(ProductTypeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductTypeDetail(ProductTypeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: CategorySummary
    products_count: int = Field(default=0, description="Total active products in this product type")
    brands: List[str] = Field(default_factory=list, description="Unique brands available in this product type")

    model_config = ConfigDict(from_attributes=True)
