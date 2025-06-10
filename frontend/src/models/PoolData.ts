export interface PoolData {
  pool_id: string;
  swaps: Array<{
    amount0: string;
    amount1: string;
    timestamp: string;
    token0: {
      id: string;
      symbol: string;
    };
    token1: {
      id: string;
      symbol: string;
    };
  }>;
}
