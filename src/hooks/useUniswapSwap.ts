'use client';

import { useState, useCallback } from 'react';
import { useAccount, useChainId, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { buildSwapTransaction, buildApproveTransaction, type SwapParams } from '@/lib/uniswap/swap';
import { splitOrder, type SplitOrder } from '@/lib/uniswap/privacy-strategies';
import { UNISWAP_V4_ADDRESSES } from '@/lib/uniswap/config';
import { COMMON_TOKENS } from '@/lib/web3/config';
import type { ExecutionStep, StepStatus } from '@/types/execution';

interface SwapState {
  status: 'idle' | 'approving' | 'swapping' | 'waiting' | 'completed' | 'error';
  currentStep: number;
  totalSteps: number;
  splitOrders: SplitOrder[];
  txHashes: string[];
  error?: string;
}

export function useUniswapSwap() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { sendTransactionAsync } = useSendTransaction();
  const [state, setState] = useState<SwapState>({
    status: 'idle',
    currentStep: 0,
    totalSteps: 1,
    splitOrders: [],
    txHashes: [],
  });

  const executeSwap = useCallback(
    async (params: SwapParams, numSplits: number = 1) => {
      if (!address) throw new Error('Wallet not connected');

      const splits = numSplits > 1 ? splitOrder(params.amount, numSplits) : [{ amount: params.amount, delaySeconds: 0, index: 0 }];

      setState({
        status: 'approving',
        currentStep: 0,
        totalSteps: splits.length + 1,
        splitOrders: splits,
        txHashes: [],
      });

      try {
        // Step 1: Approve token (if not ETH)
        if (params.fromToken !== 'ETH') {
          const tokens = COMMON_TOKENS[params.chainId];
          const tokenInfo = tokens?.[params.fromToken];
          const addresses = UNISWAP_V4_ADDRESSES[params.chainId as keyof typeof UNISWAP_V4_ADDRESSES];

          if (tokenInfo && addresses) {
            const approveTx = buildApproveTransaction(
              tokenInfo.address,
              addresses.Permit2,
              BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
              params.chainId
            );

            const hash = await sendTransactionAsync({
              to: approveTx.to,
              data: approveTx.data,
              value: approveTx.value,
            });

            setState((prev) => ({
              ...prev,
              txHashes: [...prev.txHashes, hash],
            }));
          }
        }

        // Step 2: Execute split swaps
        for (let i = 0; i < splits.length; i++) {
          const split = splits[i];

          if (split.delaySeconds > 0) {
            setState((prev) => ({ ...prev, status: 'waiting', currentStep: i + 1 }));
            await new Promise((resolve) => setTimeout(resolve, split.delaySeconds * 1000));
          }

          setState((prev) => ({ ...prev, status: 'swapping', currentStep: i + 1 }));

          const swapTx = buildSwapTransaction({
            ...params,
            amount: split.amount,
          });

          const hash = await sendTransactionAsync({
            to: swapTx.to,
            data: swapTx.data,
            value: swapTx.value,
          });

          setState((prev) => ({
            ...prev,
            txHashes: [...prev.txHashes, hash],
          }));
        }

        setState((prev) => ({
          ...prev,
          status: 'completed',
          currentStep: prev.totalSteps,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Swap failed',
        }));
        throw error;
      }
    },
    [address, sendTransactionAsync]
  );

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      currentStep: 0,
      totalSteps: 1,
      splitOrders: [],
      txHashes: [],
    });
  }, []);

  return { state, executeSwap, reset };
}
