// Shared token addresses — usable from both client and server
export const COMMON_TOKENS: Record<number, Record<string, { address: string; decimals: number; symbol: string }>> = {
  8453: {
    ETH: { address: '0x0000000000000000000000000000000000000000', decimals: 18, symbol: 'ETH' },
    WETH: { address: '0x4200000000000000000000000000000000000006', decimals: 18, symbol: 'WETH' },
    USDC: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, symbol: 'USDC' },
    USDbC: { address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', decimals: 6, symbol: 'USDbC' },
    DAI: { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18, symbol: 'DAI' },
  },
  42161: {
    ETH: { address: '0x0000000000000000000000000000000000000000', decimals: 18, symbol: 'ETH' },
    WETH: { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18, symbol: 'WETH' },
    USDC: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6, symbol: 'USDC' },
    'USDC.e': { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6, symbol: 'USDC.e' },
    ARB: { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, symbol: 'ARB' },
  },
  1: {
    ETH: { address: '0x0000000000000000000000000000000000000000', decimals: 18, symbol: 'ETH' },
    WETH: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, symbol: 'WETH' },
    USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, symbol: 'USDC' },
    USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, symbol: 'USDT' },
    DAI: { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, symbol: 'DAI' },
  },
};

/**
 * Resolve a token symbol to its address on a given chain.
 * For native ETH, LI.FI expects the zero address.
 */
export function resolveTokenAddress(symbol: string, chainId: number): string | null {
  const chain = COMMON_TOKENS[chainId];
  if (!chain) return null;
  const token = chain[symbol.toUpperCase()] || chain[symbol];
  return token?.address || null;
}

export function resolveTokenDecimals(symbol: string, chainId: number): number {
  const chain = COMMON_TOKENS[chainId];
  if (!chain) return 18;
  const token = chain[symbol.toUpperCase()] || chain[symbol];
  return token?.decimals ?? 18;
}
