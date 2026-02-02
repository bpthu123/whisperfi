'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, arbitrum, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'WhisperFi',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
  chains: [base, arbitrum, mainnet],
  ssr: true,
});

export const SUPPORTED_CHAINS = {
  [base.id]: {
    name: 'Base',
    icon: '🔵',
    explorer: 'https://basescan.org',
  },
  [arbitrum.id]: {
    name: 'Arbitrum',
    icon: '🔷',
    explorer: 'https://arbiscan.io',
  },
  [mainnet.id]: {
    name: 'Ethereum',
    icon: '⟠',
    explorer: 'https://etherscan.io',
  },
} as const;

export const COMMON_TOKENS: Record<number, Record<string, { address: `0x${string}`; decimals: number; symbol: string }>> = {
  [base.id]: {
    ETH: { address: '0x0000000000000000000000000000000000000000', decimals: 18, symbol: 'ETH' },
    WETH: { address: '0x4200000000000000000000000000000000000006', decimals: 18, symbol: 'WETH' },
    USDC: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, symbol: 'USDC' },
    USDbC: { address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', decimals: 6, symbol: 'USDbC' },
    DAI: { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18, symbol: 'DAI' },
  },
  [arbitrum.id]: {
    ETH: { address: '0x0000000000000000000000000000000000000000', decimals: 18, symbol: 'ETH' },
    WETH: { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18, symbol: 'WETH' },
    USDC: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6, symbol: 'USDC' },
    'USDC.e': { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6, symbol: 'USDC.e' },
    ARB: { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, symbol: 'ARB' },
  },
  [mainnet.id]: {
    ETH: { address: '0x0000000000000000000000000000000000000000', decimals: 18, symbol: 'ETH' },
    WETH: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, symbol: 'WETH' },
    USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, symbol: 'USDC' },
    USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, symbol: 'USDT' },
    DAI: { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, symbol: 'DAI' },
  },
};
