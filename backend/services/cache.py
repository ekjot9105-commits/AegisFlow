"""
Semantic Cache Service.

Provides an in-memory caching layer to prevent redundant LLM calls.
Designed to be easily swappable with a Redis implementation in the future.
"""

import time
import logging
import hashlib
from typing import Optional, Any, Dict, Tuple

logger = logging.getLogger(__name__)


class SemanticCache:
    """
    In-memory singleton cache service with TTL and metrics tracking.
    """

    _instance = None
    _cache: Dict[str, Tuple[float, Any]]
    hits: int
    misses: int

    def __new__(cls) -> "SemanticCache":
        if cls._instance is None:
            cls._instance = super(SemanticCache, cls).__new__(cls)
            cls._instance._cache = {}
            cls._instance.hits = 0
            cls._instance.misses = 0
        return cls._instance

    def _generate_key(self, prompt: str) -> str:
        """
        Generates a deterministic hash for a given text prompt.
        This represents a simplified 'semantic' match (exact match for now).
        """
        return hashlib.sha256(prompt.strip().encode("utf-8")).hexdigest()

    async def get(self, prompt: str) -> Optional[Any]:
        """
        Retrieves a cached AI response based on the prompt if it hasn't expired.

        Args:
            prompt: The text prompt used as the cache key.

        Returns:
            The cached Pydantic model/data or None if not found/expired.
        """
        key = self._generate_key(prompt)

        if key in self._cache:
            expires_at, data = self._cache[key]
            if time.time() < expires_at:
                self.hits += 1
                logger.debug(f"Cache hit for key {key}. Total hits: {self.hits}")
                return data
            else:
                # Expired, clean it up
                del self._cache[key]

        self.misses += 1
        logger.debug(f"Cache miss for key {key}. Total misses: {self.misses}")
        return None

    async def set(self, prompt: str, data: Any, ttl_seconds: int = 300) -> None:
        """
        Stores an AI response in the cache.

        Args:
            prompt: The text prompt used as the cache key.
            data: The parsed Pydantic model to cache.
            ttl_seconds: Time to live in seconds (default 5 minutes).
        """
        key = self._generate_key(prompt)
        expires_at = time.time() + ttl_seconds
        self._cache[key] = (expires_at, data)
        logger.debug(f"Cached response for key {key} with TTL {ttl_seconds}s")

    def get_metrics(self) -> dict:
        """Returns the current cache metrics."""
        total = self.hits + self.misses
        hit_rate = (self.hits / total * 100) if total > 0 else 0.0
        return {
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate_percent": round(hit_rate, 2),
            "total_items": len(self._cache),
        }

    def clear(self) -> None:
        """Clears the entire cache. Useful for testing."""
        self._cache.clear()
        self.hits = 0
        self.misses = 0


# Global instance
semantic_cache = SemanticCache()
