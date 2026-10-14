import logging
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.models.category import Category
from app.models.product_type import ProductType
from app.seeds.seed_data import CONFIRMED_TAXONOMY

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")


def seed_taxonomy(db: Session) -> dict:
    """Idempotently seed only Jackson's 9 confirmed categories and their product types.
    
    CRITICAL: Never creates or invents mock products, brands, prices, or stock.
    """
    total_categories = 0
    total_product_types = 0

    for cat_data in CONFIRMED_TAXONOMY:
        category = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not category:
            category = Category(
                name=cat_data["category"],
                slug=cat_data["slug"],
                description=cat_data.get("description"),
            )
            db.add(category)
            db.flush()
            logger.info("Created Category: %s (%s)", category.name, category.slug)
        else:
            category.name = cat_data["category"]
            category.description = cat_data.get("description")
            db.flush()

        total_categories += 1

        for pt_data in cat_data["product_types"]:
            product_type = (
                db.query(ProductType)
                .filter(ProductType.slug == pt_data["slug"])
                .first()
            )
            if not product_type:
                product_type = ProductType(
                    category_id=category.id,
                    name=pt_data["name"],
                    slug=pt_data["slug"],
                    description=f"{pt_data['name']} in {category.name}",
                )
                db.add(product_type)
                logger.info("  Created ProductType: %s (%s)", product_type.name, product_type.slug)
            else:
                product_type.category_id = category.id
                product_type.name = pt_data["name"]

            total_product_types += 1

    db.commit()
    logger.info(
        "Seeding complete: %d categories and %d product types verified/created.",
        total_categories,
        total_product_types,
    )
    return {
        "categories_count": total_categories,
        "product_types_count": total_product_types,
    }


def main():
    # Ensure tables exist if running against local dev
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_taxonomy(db)


if __name__ == "__main__":
    main()
