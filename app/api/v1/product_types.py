from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.product_type_service import ProductTypeService
from app.schemas.product_type import ProductTypeDetail

router = APIRouter(prefix="/product-types", tags=["Product Types"])


@router.get("/{slug}", response_model=ProductTypeDetail, summary="Get product type details")
def get_product_type_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve product type details by slug, including category, product count, and available brands."""
    return ProductTypeService.get_product_type_by_slug(db, slug)
