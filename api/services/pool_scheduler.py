import threading
import time
from services.pool_monitor import PoolMonitorService

CACHE_UPDATE_INTERVAL = 300  # 5 minutes in seconds

# Global cache variables
_brl_usd_swaps_cache = None
_pool_cache = {}
_cache_lock = threading.Lock()


def update_cache():
    global _brl_usd_swaps_cache, _pool_cache
    service = PoolMonitorService()
    while True:
        try:
            brl_usd_swaps = service.get_brl_usd_swaps()
            with _cache_lock:
                _brl_usd_swaps_cache = brl_usd_swaps
                # Optionally, refresh all known pools in the cache
                for pool_id in list(_pool_cache.keys()):
                    _pool_cache[pool_id] = service.get_pool(pool_id)
        except Exception as e:
            print(f"[PoolScheduler] Cache update error: {e}")
        time.sleep(CACHE_UPDATE_INTERVAL)


def start_scheduler():
    t = threading.Thread(target=update_cache, daemon=True)
    t.start()


def get_brl_usd_swaps_cached():
    with _cache_lock:
        return _brl_usd_swaps_cache

def get_pool_cached(pool_id):
    with _cache_lock:
        if pool_id in _pool_cache:
            return _pool_cache[pool_id]
    # If not cached, fetch and cache it
    service = PoolMonitorService()
    pool_data = service.get_pool(pool_id)
    with _cache_lock:
        _pool_cache[pool_id] = pool_data
    return pool_data