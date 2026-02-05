import { getENSTextRecord } from './resolve';
import type { StrategyConfig, StrategyLookupResult } from '@/types/strategy';

// WhisperFi uses ENS text records as a decentralized strategy marketplace
// Strategy keys follow the pattern: com.whisperfi.strategy.<strategy-name>
const STRATEGY_KEY_PREFIX = 'com.whisperfi.strategy';

// Well-known strategy names that users can publish
const KNOWN_STRATEGY_NAMES = [
  'conservative-swap',
  'aggressive-swap',
  'privacy-max',
  'yield-optimizer',
  'rebalance-weekly',
] as const;

/**
 * Look up all WhisperFi strategies published to an ENS name.
 * This creates a decentralized strategy marketplace — anyone can publish
 * strategies to their ENS name and others can browse/import them.
 */
export async function lookupStrategies(ensName: string): Promise<StrategyLookupResult> {
  const strategies: StrategyConfig[] = [];

  try {
    // Check all known strategy keys
    const results = await Promise.allSettled(
      KNOWN_STRATEGY_NAMES.map(async (name) => {
        const key = `${STRATEGY_KEY_PREFIX}.${name}`;
        const value = await getENSTextRecord(ensName, key);
        if (value) {
          try {
            const config = JSON.parse(value) as StrategyConfig;
            return config;
          } catch {
            return null;
          }
        }
        return null;
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        strategies.push(result.value);
      }
    }

    return { ensName, strategies };
  } catch (error) {
    return {
      ensName,
      strategies: [],
      error: error instanceof Error ? error.message : 'Failed to lookup strategies',
    };
  }
}

/**
 * Serialize a strategy config for storage in an ENS text record.
 */
export function serializeStrategy(config: StrategyConfig): string {
  return JSON.stringify(config);
}

/**
 * Build the ENS text record key for a strategy name.
 */
export function getStrategyKey(strategyName: string): string {
  const sanitized = strategyName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `${STRATEGY_KEY_PREFIX}.${sanitized}`;
}

/**
 * Create a default strategy config for publishing.
 */
export function createDefaultStrategy(
  name: string,
  author: string,
  overrides?: Partial<StrategyConfig>
): StrategyConfig {
  return {
    name,
    description: `${name} strategy by ${author}`,
    intentType: 'SWAP',
    privacyLevel: 'enhanced',
    splitCount: 3,
    delayRange: [30, 120],
    preferredChains: [8453], // Base
    slippageTolerance: 0.005,
    createdAt: Date.now(),
    author,
    ...overrides,
  };
}
