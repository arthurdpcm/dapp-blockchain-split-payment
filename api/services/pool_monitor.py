from models.pool import PoolSwapSummary
from utils.thegraph import get_brl_usd_pool_ids, get_swaps_for_pool, BRL_TOKENS, USD_TOKENS, first_day_of_month_timestamp

class PoolMonitorService:
    def get_brl_usd_swaps(self) -> list[PoolSwapSummary]:
        start_timestamp = first_day_of_month_timestamp()
        pool_ids = get_brl_usd_pool_ids()
        results = []
        for pool_id in pool_ids:
            swaps = get_swaps_for_pool(pool_id, start_timestamp)
            total_brl_to_usd = 0.0
            token0 = swaps[0]["token0"]["symbol"] if swaps else None
            token1 = swaps[0]["token1"]["symbol"] if swaps else None
            for swap in swaps:
                is_brl_usd, brl_amount = self.is_brl_to_usd_swap(swap)
                if is_brl_usd:
                    total_brl_to_usd += brl_amount
            results.append(PoolSwapSummary(
                pool_id=pool_id,
                token0=token0,
                token1=token1,
                total_brl_to_usd=total_brl_to_usd
            ))
        return results

    @staticmethod
    def is_brl_to_usd_swap(swap):
        token0 = swap["token0"]["id"].lower()
        token1 = swap["token1"]["id"].lower()
        amount0 = float(swap["amount0"])
        amount1 = float(swap["amount1"])
        if token0 in BRL_TOKENS and token1 in USD_TOKENS and amount0 < 0:
            return True, abs(amount0)
        if token1 in BRL_TOKENS and token0 in USD_TOKENS and amount1 < 0:
            return True, abs(amount1)
        return False, 0.0 