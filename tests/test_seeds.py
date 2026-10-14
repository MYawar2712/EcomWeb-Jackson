from app.seeds.seed import seed_taxonomy
from app.models.category import Category
from app.models.product_type import ProductType
from app.models.product import Product
from app.models.product_variant import ProductVariant


def test_seed_taxonomy_strictly_seeds_confirmed_categories_and_types_only(db_session):
    result = seed_taxonomy(db_session)
    assert result["categories_count"] == 9
    assert result["product_types_count"] == 78

    # Verify strictly 9 categories in database
    categories_count = db_session.query(Category).count()
    assert categories_count == 9

    # Verify strictly 78 product types in database
    product_types_count = db_session.query(ProductType).count()
    assert product_types_count == 78

    # CRITICAL: Verify seed NEVER invented any products, variants, brands, prices, or stock!
    products_count = db_session.query(Product).count()
    assert products_count == 0

    variants_count = db_session.query(ProductVariant).count()
    assert variants_count == 0


def test_seed_taxonomy_is_idempotent(db_session):
    # Run seed first time
    res1 = seed_taxonomy(db_session)
    assert res1["categories_count"] == 9
    assert res1["product_types_count"] == 78

    # Run seed second time
    res2 = seed_taxonomy(db_session)
    assert res2["categories_count"] == 9
    assert res2["product_types_count"] == 78

    # Counts must remain unchanged
    assert db_session.query(Category).count() == 9
    assert db_session.query(ProductType).count() == 78
