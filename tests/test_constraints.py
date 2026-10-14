from decimal import Decimal
import pytest
from sqlalchemy.exc import IntegrityError
from app.models.category import Category
from app.models.product_type import ProductType
from app.models.product import Product
from app.models.product_variant import ProductVariant


def test_unique_category_slug_constraint(db_session):
    cat1 = Category(name="Category A", slug="cat-a")
    db_session.add(cat1)
    db_session.commit()

    cat2 = Category(name="Category B", slug="cat-a")  # Duplicate slug
    db_session.add(cat2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_unique_category_product_type_name_constraint(db_session):
    cat = Category(name="Hair Care", slug="hair-care")
    db_session.add(cat)
    db_session.commit()

    pt1 = ProductType(category_id=cat.id, name="Hair Serum", slug="hair-serum-1")
    db_session.add(pt1)
    db_session.commit()

    pt2 = ProductType(category_id=cat.id, name="Hair Serum", slug="hair-serum-2")  # Duplicate name in same category
    db_session.add(pt2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_variant_price_positive_constraint(db_session):
    cat = Category(name="Hair Care", slug="hair-care")
    db_session.add(cat)
    db_session.commit()

    pt = ProductType(category_id=cat.id, name="Hair Oil", slug="hair-oil")
    db_session.add(pt)
    db_session.commit()

    product = Product(
        product_type_id=pt.id,
        name="Test Oil",
        slug="test-oil",
        brand="BrandX",
        is_active=True,
    )
    db_session.add(product)
    db_session.commit()

    # Negative price should violate CheckConstraint
    bad_variant = ProductVariant(
        product_id=product.id,
        sku="TEST-NEG-PRICE",
        name="100ml",
        price=Decimal("-5.00"),
        inventory_quantity=10,
    )
    db_session.add(bad_variant)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_variant_inventory_non_negative_constraint(db_session):
    cat = Category(name="Hair Care", slug="hair-care")
    db_session.add(cat)
    db_session.commit()

    pt = ProductType(category_id=cat.id, name="Hair Oil", slug="hair-oil")
    db_session.add(pt)
    db_session.commit()

    product = Product(
        product_type_id=pt.id,
        name="Test Oil",
        slug="test-oil",
        brand="BrandX",
        is_active=True,
    )
    db_session.add(product)
    db_session.commit()

    # Negative inventory should violate CheckConstraint
    bad_variant = ProductVariant(
        product_id=product.id,
        sku="TEST-NEG-INV",
        name="100ml",
        price=Decimal("15.00"),
        inventory_quantity=-1,
    )
    db_session.add(bad_variant)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_unique_variant_sku_constraint(db_session):
    cat = Category(name="Hair Care", slug="hair-care")
    db_session.add(cat)
    db_session.commit()

    pt = ProductType(category_id=cat.id, name="Hair Oil", slug="hair-oil")
    db_session.add(pt)
    db_session.commit()

    product = Product(
        product_type_id=pt.id,
        name="Test Oil",
        slug="test-oil",
        brand="BrandX",
        is_active=True,
    )
    db_session.add(product)
    db_session.commit()

    v1 = ProductVariant(
        product_id=product.id,
        sku="SKU-DUP-1",
        name="100ml",
        price=Decimal("15.00"),
        inventory_quantity=5,
    )
    db_session.add(v1)
    db_session.commit()

    v2 = ProductVariant(
        product_id=product.id,
        sku="SKU-DUP-1",  # Duplicate SKU
        name="200ml",
        price=Decimal("25.00"),
        inventory_quantity=10,
    )
    db_session.add(v2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()
