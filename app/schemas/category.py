from datetime import datetime
from typing import Optional, List, ForwardRef
from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=120)
    description: Optional[str] = None


class CategorySummary(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    product_types_count: Optional[int] = Field(default=None, description="Number of product types in this category")

    model_config = ConfigDict(from_attributes=True)


class ProductTypeInSubList(BaseModel):
    id: int
    category_id: int
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CategoryDetail(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    product_types: List[ProductTypeInSubList] = []

    model_config = ConfigDict(from_attributes=True)
