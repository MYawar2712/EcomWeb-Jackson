def test_get_product_type_by_slug_success(client, seeded_db):
    response = client.get("/api/product-types/hair-oil")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Hair Oil"
    assert data["slug"] == "hair-oil"
    assert data["category"]["name"] == "Hair Care Products"
    assert data["category"]["slug"] == "hair-care-products"
    assert data["products_count"] == 0
    assert data["brands"] == []


def test_get_product_type_by_slug_not_found(client, seeded_db):
    response = client.get("/api/product-types/invalid-product-type-slug")
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == "NOT_FOUND"
    assert "not found" in data["error"]["message"].lower()
