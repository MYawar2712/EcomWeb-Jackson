from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.category_service import CategoryService
from app.schemas.category import CategorySummary, CategoryDetail

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategorySummary], summary="List all categories")
def get_categories(db: Session = Depends(get_db)):
    """Retrieve all Jackson confirmed categories with product type counts."""
    return CategoryService.list_categories(db)


@router.get("/{slug}", response_model=CategoryDetail, summary="Get category details")
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve category details and its associated product types by category slug."""
    return CategoryService.get_category_by_slug(db, slug)
