from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.categories import router as categories_router
from app.api.v1.product_types import router as product_types_router
from app.api.v1.products import router as products_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(categories_router)
api_router.include_router(product_types_router)
api_router.include_router(products_router)

__all__ = ["api_router"]
