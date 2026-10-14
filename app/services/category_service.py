from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.models.category import Category
from app.models.product_type import ProductType
from app.core.errors import NotFoundError


class CategoryService:
    @staticmethod
    def list_categories(db: Session) -> List[Category]:
        """Fetch all categories ordered by name with preloaded product types."""
        categories = (
            db.query(Category)
            .options(joinedload(Category.product_types))
            .order_by(Category.id.asc())
            .all()
        )
        # Populate dynamic product_types_count attribute
        for cat in categories:
            cat.product_types_count = len(cat.product_types)
        return categories

    @staticmethod
    def get_category_by_slug(db: Session, slug: str) -> Category:
        """Fetch a single category by slug along with its product types."""
        category = (
            db.query(Category)
            .options(joinedload(Category.product_types))
            .filter(Category.slug == slug)
            .first()
        )
        if not category:
            raise NotFoundError(f"Category with slug '{slug}' was not found.")
        return category
