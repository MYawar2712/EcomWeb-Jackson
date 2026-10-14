from typing import List, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import distinct
from app.models.product_type import ProductType
from app.models.product import Product
from app.core.errors import NotFoundError


class ProductTypeService:
    @staticmethod
    def get_product_type_by_slug(db: Session, slug: str) -> dict:
        """Fetch a single product type by slug with category, count of products, and available brands."""
        product_type = (
            db.query(ProductType)
            .options(joinedload(ProductType.category))
            .filter(ProductType.slug == slug)
            .first()
        )
        if not product_type:
            raise NotFoundError(f"Product type with slug '{slug}' was not found.")

        # Get active products count
        products_count = (
            db.query(Product)
            .filter(Product.product_type_id == product_type.id, Product.is_active.is_(True))
            .count()
        )

        # Get unique brands within this product type
        brand_rows = (
            db.query(Product.brand)
            .filter(Product.product_type_id == product_type.id, Product.is_active.is_(True))
            .distinct()
            .order_by(Product.brand.asc())
            .all()
        )
        brands = [row[0] for row in brand_rows if row[0]]

        return {
            "id": product_type.id,
            "category_id": product_type.category_id,
            "name": product_type.name,
            "slug": product_type.slug,
            "description": product_type.description,
            "created_at": product_type.created_at,
            "updated_at": product_type.updated_at,
            "category": product_type.category,
            "products_count": products_count,
            "brands": brands,
        }
