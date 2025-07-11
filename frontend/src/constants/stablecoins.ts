export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// List of BRL stablecoins for the swap page
export const BRL_STABLECOINS = [
  {
    symbol: 'BRLA',
    name: 'Brazilian Digital Real',
    address: '0xe6a537a407488807f0bbeb0038b79004f19dddfb',
    image: '/brla_logo.png',
    decimals: 18,
  },
  {
    symbol: 'BRZ',
    name: 'Brazilian Digital Token',
    address: '0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc',
    image: '/brz_logo.png',
    decimals: 18,
  }
];
export const USD_STABLECOINS = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    image: '/usdc_logo.png',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    image: '/usdt_logo.png',
    decimals: 6,
  },
];

export const STABLECOINS = [...BRL_STABLECOINS, ...USD_STABLECOINS];
