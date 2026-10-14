def test_get_categories_empty(client):
    response = client.get("/api/categories")
    assert response.status_code == 200
    assert response.json() == []


def test_get_categories_seeded(client, seeded_db):
    response = client.get("/api/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) == 9

    category_slugs = {c["slug"] for c in categories}
    expected_slugs = {
        "hair-care-products",
        "hair-styling-products",
        "barber-tools-accessories",
        "shaving-beard-care",
        "hair-colors-dyes",
        "skin-care",
        "electrical-salon-equipment",
        "nail-beauty-accessories",
        "professional-salon-supplies",
    }
    assert category_slugs == expected_slugs

    # Verify product_types_count is populated
    hair_care = next(c for c in categories if c["slug"] == "hair-care-products")
    assert hair_care["product_types_count"] == 5


def test_get_category_by_slug_success(client, seeded_db):
    response = client.get("/api/categories/hair-care-products")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Hair Care Products"
    assert data["slug"] == "hair-care-products"
    assert len(data["product_types"]) == 5

    type_names = {pt["name"] for pt in data["product_types"]}
    assert type_names == {
        "Hair Oil",
        "Hair Serum",
        "Hair Mask",
        "Hair Tonic",
        "Keratin & Rebonding Creams",
    }


def test_get_category_by_slug_not_found(client, seeded_db):
    response = client.get("/api/categories/non-existent-category")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "NOT_FOUND"
    assert "not found" in data["error"]["message"].lower()
