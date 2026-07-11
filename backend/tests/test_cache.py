import pytest
import asyncio
from backend.services.cache import SemanticCache


@pytest.mark.asyncio
async def test_semantic_cache_set_get():
    cache = SemanticCache()
    await cache.set("test_key", {"data": "value"}, ttl_seconds=10)

    result = await cache.get("test_key")
    assert result == {"data": "value"}

    # Test cache miss
    miss = await cache.get("wrong_key")
    assert miss is None
