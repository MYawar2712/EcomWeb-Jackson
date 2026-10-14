from decimal import Decimal
from app.models.category import Category
from app.models.product_type import ProductType
from app.models.product import Product
from app.models.product_variant import ProductVariant


def create_test_product(
    db,
    product_type_slug: str,
    name: str,
    slug: str,
    brand: str,
    variants_data: list,
    description: str = "Test description",
):
    pt = db.query(ProductType).filter(ProductType.slug == product_type_slug).first()
    product = Product(
        product_type_id=pt.id,
        name=name,
        slug=slug,
        brand=brand,
        description=description,
        is_active=True,
    )
    db.add(product)
    db.flush()

    for v in variants_data:
        variant = ProductVariant(
            product_id=product.id,
            sku=v["sku"],
            name=v["name"],
            price=Decimal(str(v["price"])),
            inventory_quantity=v.get("inventory_quantity", 0),
            is_active=v.get("is_active", True),
            barcode=v.get("barcode"),
            attributes=v.get("attributes"),
        )
        db.add(variant)

    db.commit()
    db.refresh(product)
    return product


def test_list_products_empty(client, seeded_db):
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["pagination"]["total_items"] == 0
    assert data["pagination"]["total_pages"] == 0
    assert data["pagination"]["has_next"] is False
    assert data["pagination"]["has_prev"] is False


def test_products_with_multiple_brands_and_variants(client, seeded_db):
    # Support multiple brands per product type
    # Brand 1: "LuxeBarber"
    create_test_product(
        seeded_db,
        product_type_slug="hair-oil",
        name="Argan Nourishing Oil",
        slug="argan-nourishing-oil",
        brand="LuxeBarber",
        variants_data=[
            {"sku": "ARG-50", "name": "50ml", "price": "18.50", "inventory_quantity": 25},
            {"sku": "ARG-100", "name": "100ml", "price": "29.99", "inventory_quantity": 10},
        ],
    )
    # Brand 2: "PureCare" on the same product type "hair-oil"
    create_test_product(
        seeded_db,
        product_type_slug="hair-oil",
        name="Castor Root Oil",
        slug="castor-root-oil",
        brand="PureCare",
        variants_data=[
            {"sku": "CST-100", "name": "100ml", "price": "14.00", "inventory_quantity": 0},
        ],
    )
    # Another product in a different category "barber-tools-accessories" -> "hair-cutting-scissors"
    create_test_product(
        seeded_db,
        product_type_slug="hair-cutting-scissors",
        name="Master 6-Inch Shear",
        slug="master-6-inch-shear",
        brand="TitaniumPro",
        variants_data=[
            {"sku": "SHR-SILVER", "name": "Matte Silver", "price": "85.00", "inventory_quantity": 8},
            {"sku": "SHR-GOLD", "name": "Rose Gold", "price": "95.00", "inventory_quantity": 3},
        ],
    )

    # 1. Test basic list returns 3 products
    res = client.get("/api/products")
    assert res.status_code == 200
    data = res.json()
    assert data["pagination"]["total_items"] == 3
    assert len(data["items"]) == 3

    # Check that product-types endpoint reflects brands and product counts
    pt_res = client.get("/api/product-types/hair-oil")
    assert pt_res.status_code == 200
    pt_data = pt_res.json()
    assert pt_data["products_count"] == 2
    assert set(pt_data["brands"]) == {"LuxeBarber", "PureCare"}

    # 2. Test filter by category_slug
    cat_res = client.get("/api/products?category_slug=hair-care-products")
    assert cat_res.status_code == 200
    assert cat_res.json()["pagination"]["total_items"] == 2

    # 3. Test filter by product_type_slug
    pt_filter_res = client.get("/api/products?product_type_slug=hair-cutting-scissors")
    assert pt_filter_res.status_code == 200
    assert pt_filter_res.json()["pagination"]["total_items"] == 1
    assert pt_filter_res.json()["items"][0]["brand"] == "TitaniumPro"

    # 4. Test filter by brand (case-insensitive)
    brand_res = client.get("/api/products?brand=luxebarber")
    assert brand_res.status_code == 200
    assert brand_res.json()["pagination"]["total_items"] == 1
    assert brand_res.json()["items"][0]["name"] == "Argan Nourishing Oil"

    # 5. Test filter by min_price and max_price
    price_res = client.get("/api/products?min_price=20.00&max_price=30.00")
    assert price_res.status_code == 200
    assert price_res.json()["pagination"]["total_items"] == 1
    assert price_res.json()["items"][0]["slug"] == "argan-nourishing-oil"

    # 6. Test in_stock filter
    in_stock_res = client.get("/api/products?in_stock=true")
    assert in_stock_res.status_code == 200
    in_stock_slugs = {p["slug"] for p in in_stock_res.json()["items"]}
    assert "castor-root-oil" not in in_stock_slugs  # Has 0 stock
    assert "argan-nourishing-oil" in in_stock_slugs

    out_of_stock_res = client.get("/api/products?in_stock=false")
    assert out_of_stock_res.status_code == 200
    out_stock_slugs = {p["slug"] for p in out_of_stock_res.json()["items"]}
    assert "castor-root-oil" in out_stock_slugs

    # 7. Test search
    search_res = client.get("/api/products?search=shear")
    assert search_res.status_code == 200
    assert search_res.json()["pagination"]["total_items"] == 1
    assert search_res.json()["items"][0]["slug"] == "master-6-inch-shear"

    # 8. Test pagination
    paged_res = client.get("/api/products?page=1&page_size=2")
    assert paged_res.status_code == 200
    pdata = paged_res.json()
    assert len(pdata["items"]) == 2
    assert pdata["pagination"]["total_items"] == 3
    assert pdata["pagination"]["total_pages"] == 2
    assert pdata["pagination"]["has_next"] is True
    assert pdata["pagination"]["has_prev"] is False

    paged_page2 = client.get("/api/products?page=2&page_size=2")
    assert paged_page2.status_code == 200
    p2data = paged_page2.json()
    assert len(p2data["items"]) == 1
    assert p2data["pagination"]["has_next"] is False
    assert p2data["pagination"]["has_prev"] is True


def test_get_product_by_slug_success_and_not_found(client, seeded_db):
    create_test_product(
        seeded_db,
        product_type_slug="hair-oil",
        name="Moroccan Argan Elixir",
        slug="moroccan-argan-elixir",
        brand="MorocPro",
        variants_data=[
            {"sku": "ELX-30", "name": "30ml Travel", "price": "12.00", "inventory_quantity": 15},
            {"sku": "ELX-100", "name": "100ml Salon", "price": "35.00", "inventory_quantity": 40},
        ],
    )

    # Success
    res = client.get("/api/products/moroccan-argan-elixir")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Moroccan Argan Elixir"
    assert data["brand"] == "MorocPro"
    assert data["category"]["slug"] == "hair-care-products"
    assert data["product_type"]["slug"] == "hair-oil"
    assert len(data["variants"]) == 2
    assert Decimal(str(data["min_price"])) == Decimal("12.00")
    assert Decimal(str(data["max_price"])) == Decimal("35.00")
    assert data["total_stock"] == 55

    # 404
    not_found_res = client.get("/api/products/non-existent-product")
    assert not_found_res.status_code == 404
    err = not_found_res.json()
    assert err["error"]["code"] == "NOT_FOUND"
    assert "not found" in err["error"]["message"].lower()
