from decimal import Decimal
from tests.test_products import create_test_product


def test_products_pagination_validation(client):
    # page must be >= 1
    res = client.get("/api/products?page=0")
    assert res.status_code == 422
    err = res.json()
    assert err["error"]["code"] == "VALIDATION_ERROR"

    # page_size must be <= 100
    res2 = client.get("/api/products?page_size=101")
    assert res2.status_code == 422
    err2 = res2.json()
    assert err2["error"]["code"] == "VALIDATION_ERROR"

    # min_price must be >= 0
    res3 = client.get("/api/products?min_price=-10")
    assert res3.status_code == 422
    err3 = res3.json()
    assert err3["error"]["code"] == "VALIDATION_ERROR"


def test_products_sorting_options(client, seeded_db):
    create_test_product(
        seeded_db,
        product_type_slug="hair-spray",
        name="Apex Hold Spray",
        slug="apex-hold-spray",
        brand="Z-Brand",
        variants_data=[{"sku": "APX-1", "name": "Standard", "price": "20.00", "inventory_quantity": 5}],
    )
    create_test_product(
        seeded_db,
        product_type_slug="hair-spray",
        name="Zenith Mist Spray",
        slug="zenith-mist-spray",
        brand="A-Brand",
        variants_data=[{"sku": "ZNT-1", "name": "Standard", "price": "10.00", "inventory_quantity": 5}],
    )

    # Sort name_desc
    res_desc = client.get("/api/products?sort_by=name_desc")
    assert res_desc.status_code == 200
    items = res_desc.json()["items"]
    assert items[0]["name"] == "Zenith Mist Spray"
    assert items[1]["name"] == "Apex Hold Spray"

    # Sort brand_asc
    res_brand_asc = client.get("/api/products?sort_by=brand_asc")
    assert res_brand_asc.status_code == 200
    b_items = res_brand_asc.json()["items"]
    assert b_items[0]["brand"] == "A-Brand"
    assert b_items[1]["brand"] == "Z-Brand"

    # Sort brand_desc
    res_brand_desc = client.get("/api/products?sort_by=brand_desc")
    assert res_brand_desc.status_code == 200
    bd_items = res_brand_desc.json()["items"]
    assert bd_items[0]["brand"] == "Z-Brand"
    assert bd_items[1]["brand"] == "A-Brand"

    # Sort newest
    res_newest = client.get("/api/products?sort_by=newest")
    assert res_newest.status_code == 200
