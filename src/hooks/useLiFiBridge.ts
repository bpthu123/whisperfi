'use client';

import { useState, useCallback } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { getCrossChainQuote, getCrossChainObfuscatedQuote, type CrossChainQuoteResult } from '@/lib/lifi/cross-chain';

interface BridgeState {
  status: 'idle' | 'quoting' | 'executing' | 'completed' | 'error';
  quote: CrossChainQuoteResult | null;
  obfuscatedQuote: { leg1: CrossChainQuoteResult; leg2: CrossChainQuoteResult } | null;
  txHash?: string;
  error?: string;
}

export function useLiFiBridge() {
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [state, setState] = useState<BridgeState>({
    status: 'idle',
    quote: null,
    obfuscatedQuote: null,
  });

  const getQuote = useCallback(
    async (params: {
      fromChainId: number;
      toChainId: number;
      fromToken: string;
      toToken: string;
      fromAmount: string;
    }) => {
      if (!address) throw new Error('Wallet not connected');

      setState((prev) => ({ ...prev, status: 'quoting', error: undefined }));

      try {
        const quote = await getCrossChainQuote({
          ...params,
          fromAddress: address,
        });

        setState((prev) => ({ ...prev, status: 'idle', quote }));
        return quote;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to get quote',
        }));
        throw error;
      }
    },
    [address]
  );

  const getObfuscatedQuote = useCallback(
    async (params: {
      fromChainId: number;
      toChainId: number;
      fromToken: string;
      toToken: string;
      fromAmount: string;
      intermediateChainId?: number;
    }) => {
      if (!address) throw new Error('Wallet not connected');

      setState((prev) => ({ ...prev, status: 'quoting', error: undefined }));

      try {
        const obfuscatedQuote = await getCrossChainObfuscatedQuote(
          {
            ...params,
            fromAddress: address,
          },
          params.intermediateChainId
        );

        setState((prev) => ({ ...prev, status: 'idle', obfuscatedQuote }));
        return obfuscatedQuote;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to get obfuscated quote',
        }));
        throw error;
      }
    },
    [address]
  );

  const executeBridge = useCallback(
    async (quote: CrossChainQuoteResult) => {
      if (!quote.transactionRequest) {
        throw new Error('No transaction request in quote');
      }

      setState((prev) => ({ ...prev, status: 'executing' }));

      try {
        const hash = await sendTransactionAsync({
          to: quote.transactionRequest.to as `0x${string}`,
          data: quote.transactionRequest.data as `0x${string}`,
          value: BigInt(quote.transactionRequest.value),
        });

        setState((prev) => ({ ...prev, status: 'completed', txHash: hash }));
        return hash;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Bridge execution failed',
        }));
        throw error;
      }
    },
    [sendTransactionAsync]
  );

  const reset = useCallback(() => {
    setState({ status: 'idle', quote: null, obfuscatedQuote: null });
  }, []);

  return { state, getQuote, getObfuscatedQuote, executeBridge, reset };
}
