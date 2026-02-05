import { createConfig } from '@lifi/sdk';

// Initialize LI.FI SDK configuration
export const lifiConfig = createConfig({
  integrator: 'WhisperFi',
});

export const LIFI_CHAIN_IDS = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  optimism: 10,
  polygon: 137,
} as const;

// Intermediate chains for cross-chain obfuscation
export const OBFUSCATION_CHAINS = [10, 137] as const; // Optimism, Polygon
