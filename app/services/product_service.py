from decimal import Decimal
from typing import Optional, List, Tuple, Dict, Any
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_, and_, desc, asc
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.product_type import ProductType
from app.models.category import Category
from app.core.errors import NotFoundError


class ProductService:
    @staticmethod
    def get_product_by_slug(db: Session, slug: str) -> dict:
        """Fetch full product details by slug including category, product type, and variants."""
        product = (
            db.query(Product)
            .options(
                joinedload(Product.product_type).joinedload(ProductType.category),
                joinedload(Product.variants),
            )
            .filter(Product.slug == slug)
            .first()
        )
        if not product:
            raise NotFoundError(f"Product with slug '{slug}' was not found.")

        # Compute price range and stock from active variants
        active_variants = [v for v in product.variants if v.is_active]
        prices = [v.price for v in active_variants]
        min_price = min(prices) if prices else None
        max_price = max(prices) if prices else None
        total_stock = sum(v.inventory_quantity for v in active_variants)

        return {
            "id": product.id,
            "name": product.name,
            "slug": product.slug,
            "brand": product.brand,
            "description": product.description,
            "is_active": product.is_active,
            "product_type": product.product_type,
            "category": product.product_type.category,
            "variants": product.variants,
            "min_price": min_price,
            "max_price": max_price,
            "total_stock": total_stock,
            "created_at": product.created_at,
            "updated_at": product.updated_at,
        }

    @staticmethod
    def list_products(
        db: Session,
        category_slug: Optional[str] = None,
        product_type_slug: Optional[str] = None,
        brand: Optional[str] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        in_stock: Optional[bool] = None,
        search: Optional[str] = None,
        sort_by: str = "name_asc",
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[dict], int]:
        """List products with pagination, search, sorting, and multi-faceted filtering."""
        query = (
            db.query(Product)
            .join(Product.product_type)
            .join(ProductType.category)
            .options(
                joinedload(Product.product_type).joinedload(ProductType.category),
                joinedload(Product.variants),
            )
        )

        # Filters
        if category_slug:
            query = query.filter(Category.slug == category_slug)

        if product_type_slug:
            query = query.filter(ProductType.slug == product_type_slug)

        if brand:
            query = query.filter(func.lower(Product.brand) == brand.strip().lower())

        if search:
            search_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.brand.ilike(search_term),
                    Product.description.ilike(search_term),
                )
            )

        # Variant-dependent filters (min_price, max_price, in_stock)
        if min_price is not None:
            query = query.filter(
                Product.variants.any(
                    and_(ProductVariant.is_active.is_(True), ProductVariant.price >= min_price)
                )
            )

        if max_price is not None:
            query = query.filter(
                Product.variants.any(
                    and_(ProductVariant.is_active.is_(True), ProductVariant.price <= max_price)
                )
            )

        if in_stock is True:
            query = query.filter(
                Product.variants.any(
                    and_(
                        ProductVariant.is_active.is_(True),
                        ProductVariant.inventory_quantity > 0,
                    )
                )
            )
        elif in_stock is False:
            # Products where none of the active variants have inventory > 0
            query = query.filter(
                ~Product.variants.any(
                    and_(
                        ProductVariant.is_active.is_(True),
                        ProductVariant.inventory_quantity > 0,
                    )
                )
            )

        # Total count before pagination
        total_items = query.distinct().count()

        # Sorting
        if sort_by == "name_desc":
            query = query.order_by(Product.name.desc())
        elif sort_by == "brand_asc":
            query = query.order_by(Product.brand.asc(), Product.name.asc())
        elif sort_by == "brand_desc":
            query = query.order_by(Product.brand.desc(), Product.name.asc())
        elif sort_by == "newest":
            query = query.order_by(Product.created_at.desc())
        elif sort_by == "oldest":
            query = query.order_by(Product.created_at.asc())
        else:
            # Default name_asc
            query = query.order_by(Product.name.asc())

        offset = (page - 1) * page_size
        products = query.offset(offset).limit(page_size).all()

        results = []
        for p in products:
            active_vars = [v for v in p.variants if v.is_active]
            prices = [v.price for v in active_vars]
            results.append({
                "id": p.id,
                "name": p.name,
                "slug": p.slug,
                "brand": p.brand,
                "description": p.description,
                "is_active": p.is_active,
                "product_type_id": p.product_type_id,
                "product_type_name": p.product_type.name,
                "product_type_slug": p.product_type.slug,
                "category_id": p.product_type.category_id,
                "category_name": p.product_type.category.name,
                "category_slug": p.product_type.category.slug,
                "min_price": min(prices) if prices else None,
                "max_price": max(prices) if prices else None,
                "total_stock": sum(v.inventory_quantity for v in active_vars),
                "variants_count": len(p.variants),
                "created_at": p.created_at,
                "updated_at": p.updated_at,
            })

        return results, total_items
