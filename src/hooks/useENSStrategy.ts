'use client';

import { useState, useCallback } from 'react';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { useEnsName } from 'wagmi';
import { lookupStrategies } from '@/lib/ens/strategy-records';
import { serializeStrategy, getStrategyKey, createDefaultStrategy } from '@/lib/ens/strategy-records';
import { buildSetTextTransaction } from '@/lib/ens/resolve';
import type { StrategyConfig, StrategyLookupResult } from '@/types/strategy';

export function useENSStrategy() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const [lookupResult, setLookupResult] = useState<StrategyLookupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const browseStrategies = useCallback(async (targetENS: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await lookupStrategies(targetENS);
      setLookupResult(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to look up strategies';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const publishStrategy = useCallback(
    async (config: StrategyConfig): Promise<string | null> => {
      if (!ensName) {
        setError('ENS name required to publish strategies');
        return null;
      }

      setIsPublishing(true);
      setError(null);

      try {
        // Switch to mainnet for ENS transactions
        try { await switchChainAsync({ chainId: 1 }); } catch {}

        const key = getStrategyKey(config.name);
        const value = serializeStrategy(config);
        const tx = buildSetTextTransaction(ensName, key, value);

        const hash = await sendTransactionAsync({
          to: tx.to as `0x${string}`,
          data: tx.data,
          value: tx.value,
        });

        return hash;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to publish strategy';
        setError(message);
        return null;
      } finally {
        setIsPublishing(false);
      }
    },
    [ensName, sendTransactionAsync, switchChainAsync]
  );

  const preparePublishStrategy = useCallback(
    (config: StrategyConfig) => {
      if (!ensName) {
        throw new Error('ENS name required to publish strategies');
      }

      const key = getStrategyKey(config.name);
      const value = serializeStrategy(config);

      return { key, value, ensName };
    },
    [ensName]
  );

  const createStrategy = useCallback(
    (name: string, overrides?: Partial<StrategyConfig>) => {
      const author = ensName || address || 'anonymous';
      return createDefaultStrategy(name, author, overrides);
    },
    [ensName, address]
  );

  return {
    ensName,
    lookupResult,
    isLoading,
    isPublishing,
    error,
    browseStrategies,
    publishStrategy,
    preparePublishStrategy,
    createStrategy,
  };
}
