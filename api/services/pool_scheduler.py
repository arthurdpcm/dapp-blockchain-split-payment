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

def get_pool_cached(pool_id, date_from=None, date_to=None):
    with _cache_lock:
        cached_data = _pool_cache.get(pool_id)
    
    need_fetch = False
    fetch_from = None
    fetch_to = None
    all_swaps = []

    if cached_data:
        cached_from = cached_data.get('cached_from')
        cached_to = cached_data.get('cached_to')
        all_swaps = cached_data.get('swaps', [])

        # Verifica se o intervalo solicitado está completamente dentro do cache
        if date_from and (not cached_from or date_from < cached_from):
            fetch_from = date_from
            fetch_to = min(cached_from, date_to) if date_to else cached_from
            need_fetch = True

        if date_to and (not cached_to or date_to > cached_to):
            fetch_from2 = max(cached_to, date_from) if date_from else cached_to
            fetch_to2 = date_to
            need_fetch = True

    else:
        # Sem cache algum
        fetch_from = date_from
        fetch_to = date_to
        need_fetch = True

    # Busca os dados faltantes, se necessário
    if need_fetch:
        service = PoolMonitorService()
        new_swaps = []

        if fetch_from and fetch_to:
            new_swaps += service.get_pool(pool_id, date_from=fetch_from, date_to=fetch_to)['swaps']
        elif fetch_from:
            new_swaps += service.get_pool(pool_id, date_from=fetch_from)['swaps']
        elif fetch_to:
            new_swaps += service.get_pool(pool_id, date_to=fetch_to)['swaps']
        else:
            new_swaps += service.get_pool(pool_id)['swaps']

        # Atualiza o cache com os novos swaps
        with _cache_lock:
            all_swaps += new_swaps
            all_swaps = list({s['id']: s for s in all_swaps}.values())  # remove duplicados
            all_swaps.sort(key=lambda s: s['timestamp'])  # ordena por timestamp

            _pool_cache[pool_id] = {
                'pool_id': pool_id,
                'swaps': all_swaps,
                'cached_from': min(s['timestamp'] for s in all_swaps),
                'cached_to': max(s['timestamp'] for s in all_swaps),
            }

    # Filtra para retornar só o que foi solicitado
    result = [
        swap for swap in _pool_cache[pool_id]['swaps']
        if (not date_from or swap['timestamp'] >= date_from) and
           (not date_to or swap['timestamp'] <= date_to)
    ]

    return {
        'pool_id': pool_id,
        'swaps': result
    }
