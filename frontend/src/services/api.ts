import type { BrlUsdSwapsByPool } from '../models/BrlUsdSwapsByPool';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:8000',
});

export async function getBrlUsdSwaps() {
  const response = await api.get('/brl-usd-swaps');
  return response.data as BrlUsdSwapsByPool[];
}

export default api;
