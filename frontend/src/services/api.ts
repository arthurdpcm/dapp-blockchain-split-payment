import type { PoolData } from '../models/PoolData';
import type { BrlUsdSwapsByPool } from '../models/BrlUsdSwapsByPool';
import axios from 'axios';
import type { SwapQuote } from '@/models/SwapQuote';

const api = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:8000',
});

export async function getBrlUsdSwaps() {
  const response = await api.get('/brl-usd-swaps');
  return response.data as BrlUsdSwapsByPool[];
}

export async function getPool(id: string, fromTimestamp?: string, toTimestamp?: string) {
  const response = await api.get(`/pool/${id}`, {
    params: {
      dateFrom: fromTimestamp,
      dateTo: toTimestamp,
    },
  });
  return response.data as PoolData;
}

export async function getQuote(tokenIn: string, tokenOut: string) {
  const response = await api.get(`/quote`, {
    params: {
      tokenIn: tokenIn,
      tokenOut: tokenOut,
    },
  });

  if (response.status !== 200) throw new Error('Failed to fetch quote');
  const rawData = response.data as {
    pool_id: string;
    token0Price: number;
    token1Price: number;
    fee_tier: number;
  };
  const swapQuote: SwapQuote = {
    poolId: rawData.pool_id,
    token0Price: rawData.token0Price,
    token1Price: rawData.token1Price,
    feeTier: rawData.fee_tier
  };
  return swapQuote;
}

export default api;
