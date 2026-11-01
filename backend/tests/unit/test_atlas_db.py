import pytest
from app.core.database import sanitize_mongo_uri, connect_to_mongo, close_mongo_connection, db_manager
from app.core.config import settings

def test_sanitize_mongo_uri():
    raw_uri = "mongodb+srv://mock_user:mock_password_token@cluster.example.internal/?retryWrites=true"
    sanitized = sanitize_mongo_uri(raw_uri)
    assert "mock_user" not in sanitized
    assert "mock_password_token" not in sanitized
    assert "://***:***@" in sanitized
    assert "cluster.example.internal" in sanitized

@pytest.mark.asyncio
async def test_atlas_connection_and_indexes():
    db = await connect_to_mongo()
    assert db is not None
    ping_result = await db.command("ping")
    assert ping_result.get("ok") == 1
    
    # Verify collections can be accessed
    cols = await db.list_collection_names()
    assert isinstance(cols, list)
    
    # Safe temporary probe document (create, read, delete)
    probe = db["_spms_probe_test"]
    insert_res = await probe.insert_one({"probe": "health_check"})
    assert insert_res.inserted_id is not None
    
    found = await probe.find_one({"_id": insert_res.inserted_id})
    assert found is not None
    assert found["probe"] == "health_check"
    
    del_res = await probe.delete_one({"_id": insert_res.inserted_id})
    assert del_res.deleted_count == 1
    
    await close_mongo_connection()
