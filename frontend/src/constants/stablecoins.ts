export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// List of BRL stablecoins for the swap page
export const BRL_STABLECOINS = [
  { symbol: 'BRLA',
    name: 'Brazilian Digital Real',
    address: '0xe6a537a407488807f0bbeb0038b79004f19dddfb',
    image: '/brla_logo.png',
    decimals: 18
  },
  { symbol: 'BRZ',
    name: 'Brazilian Digital Token',
    address: '0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc', // testnet 
    image: '/brz_logo.png' ,
    decimals: 18
  },
  // { symbol: 'BRZ_TESTNET',
  //   name: 'Brazilian Digital Token',
  //   address: '0x13c90ba1f2cf2818af3e10c94878393683738899', // testnet 
  //   image: '/brz_logo.png' ,
  //   decimals: 18
  // },
  {
    symbol: 'MATIC',
    name: 'Matic Token',
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    image: '/polygon_logo.png',
    decimals: 18
  },
  //   {
  //   symbol: 'POL',
  //   name: 'Polygon Token',
  //   address: '0x00000000000000000000000000000000000001010', 
  //   image: '/polygon_logo.png',
  //   decimals: 18
  // },
  {
    symbol: 'EURE',
    name: 'Monerium EUR emoney',
    address: '0x18ec0a6e18e5bc3784fdd3a3634b31245ab704f6',
    image: '/eure_logo.png',
    decimals: 18
  },
  { symbol: 'USDC',
    name: 'USD Coin',
    address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    image: '/usdc_logo.png',
    decimals: 6
  },
  //   { symbol: 'USDC_Testnet',
  //   name: 'USD Coin',
  //   address: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
  //   image: '/usdc_logo.png',
  //   decimals: 6
  // },
  // {
  //   symbol: 'ETH',
  //   name: 'Ethereum',
  //   address: ZERO_ADDRESS,
  //   image: '/ethereum_logo.png'
  // }
];
export const USD_STABLECOINS = [
  { symbol: 'USDC',
    name: 'USD Coin',
    address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    image: '/usdc_logo.png',
    decimals: 6
  },
  { symbol: 'USDT',
    name: 'Tether USD',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    image: '/usdt_logo.png',
    decimals: 6
  },
  // { symbol: 'BRZ_TESTNET',
  //   name: 'Brazilian Digital Token',
  //   address: '0x13c90ba1f2cf2818af3e10c94878393683738899', // testnet 
  //   image: '/brz_logo.png' ,
  //   decimals: 18
  // },
];

export const STABLECOINS = [
  ...BRL_STABLECOINS,
  ...USD_STABLECOINS
];