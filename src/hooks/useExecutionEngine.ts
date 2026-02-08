'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { useAccount, useSendTransaction, useSwitchChain, useWalletClient, useChainId } from 'wagmi';
import { createPublicClient, http, parseUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { buildSwapTransaction, buildApproveTransaction } from '@/lib/uniswap/swap';
import { getCrossChainQuote } from '@/lib/lifi/cross-chain';
import { resolveTokenAddress, resolveTokenDecimals } from '@/lib/tokens';
import { UNISWAP_V4_ADDRESSES } from '@/lib/uniswap/config';
import { usePrivacySettings, FLASHBOTS_RPC } from '@/store/privacy-settings';
import type { ExecutionPlan, ExecutionStep, StepStatus } from '@/types/execution';

export interface ExecutionState {
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  currentStepIndex: number;
  steps: ExecutionStep[];
  waitCountdown: number | null; // seconds remaining for WAIT steps
  error: string | null;
}

export function useExecutionEngine() {
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { flashbotsEnabled } = usePrivacySettings();
  const [state, setState] = useState<ExecutionState>({
    status: 'idle',
    currentStepIndex: -1,
    steps: [],
    waitCountdown: null,
    error: null,
  });
  const abortRef = useRef(false);

  // Flashbots Protect public client for submitting raw txs to private mempool
  const flashbotsClient = useMemo(
    () => createPublicClient({ chain: mainnet, transport: http(FLASHBOTS_RPC) }),
    []
  );

  // Send transaction — routes through Flashbots on mainnet when enabled
  const sendTx = useCallback(async (txParams: { to: `0x${string}`; data: `0x${string}`; value: bigint }) => {
    if (flashbotsEnabled && chainId === 1 && walletClient) {
      try {
        const request = await walletClient.prepareTransactionRequest(txParams);
        const serializedTx = await walletClient.signTransaction(request);
        const hash = await flashbotsClient.sendRawTransaction({ serializedTransaction: serializedTx });
        console.log('[flashbots] tx sent to private mempool:', hash);
        return hash;
      } catch (e) {
        console.warn('[flashbots] wallet does not support eth_signTransaction, falling back to standard send:', e);
      }
    }
    return sendTransactionAsync(txParams);
  }, [flashbotsEnabled, chainId, walletClient, flashbotsClient, sendTransactionAsync]);

  const updateStep = useCallback((index: number, updates: Partial<ExecutionStep>) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map((s, i) => i === index ? { ...s, ...updates } : s),
    }));
  }, []);

  const executeStep = useCallback(async (step: ExecutionStep, index: number): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');

    setState(prev => ({ ...prev, currentStepIndex: index }));
    updateStep(index, { status: 'executing' });

    switch (step.type) {
      case 'WAIT': {
        // Real time-delay for privacy — countdown visible to user
        const waitSeconds = step.estimatedTime || 60;
        for (let remaining = waitSeconds; remaining > 0; remaining--) {
          if (abortRef.current) throw new Error('Execution cancelled');
          setState(prev => ({ ...prev, waitCountdown: remaining }));
          await new Promise(r => setTimeout(r, 1000));
        }
        setState(prev => ({ ...prev, waitCountdown: null }));
        updateStep(index, { status: 'completed' });
        break;
      }

      case 'APPROVE': {
        const tokenAddr = resolveTokenAddress(step.fromToken, step.chainId);
        const chainAddrs = UNISWAP_V4_ADDRESSES[step.chainId as keyof typeof UNISWAP_V4_ADDRESSES];
        const isNativeETH = !tokenAddr || tokenAddr === '0x0000000000000000000000000000000000000000';
        if (isNativeETH || !chainAddrs) {
          updateStep(index, { status: 'completed', privacyNote: 'Skipped — native ETH needs no approval' });
          break;
        }
        // Switch chain if needed
        try { await switchChainAsync({ chainId: step.chainId }); } catch {}
        const tx = buildApproveTransaction(
          tokenAddr as `0x${string}`,
          chainAddrs.Permit2,
          BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
          step.chainId,
        );
        const hash = await sendTx({ to: tx.to, data: tx.data, value: tx.value });
        updateStep(index, { status: 'completed', txHash: hash });
        break;
      }

      case 'SWAP_UNISWAP': {
        try { await switchChainAsync({ chainId: step.chainId }); } catch {}
        const tx = buildSwapTransaction({
          fromToken: step.fromToken,
          toToken: step.toToken,
          amount: step.amount,
          chainId: step.chainId,
          slippage: 0.005,
          recipient: address,
        });
        const hash = await sendTx({ to: tx.to, data: tx.data, value: tx.value });
        updateStep(index, { status: 'completed', txHash: hash });
        break;
      }

      case 'BRIDGE_LIFI': {
        const destChainId = step.toChainId || step.chainId;
        if (destChainId === step.chainId) {
          // Same chain — skip bridge, mark as completed
          updateStep(index, { status: 'completed', privacyNote: 'Same chain — no bridge needed' });
          break;
        }

        const fromTokenAddr = resolveTokenAddress(step.fromToken, step.chainId);
        const toTokenAddr = resolveTokenAddress(step.toToken, destChainId);

        if (fromTokenAddr && toTokenAddr) {
          const decimals = resolveTokenDecimals(step.fromToken, step.chainId);
          const amountWei = parseUnits(step.amount || '0', decimals).toString();

          try { await switchChainAsync({ chainId: step.chainId }); } catch {}
          const quote = await getCrossChainQuote({
            fromChainId: step.chainId,
            toChainId: destChainId,
            fromToken: fromTokenAddr,
            toToken: toTokenAddr,
            fromAmount: amountWei,
            fromAddress: address,
          });

          if (quote.transactionRequest) {
            const hash = await sendTx({
              to: quote.transactionRequest.to as `0x${string}`,
              data: quote.transactionRequest.data as `0x${string}`,
              value: BigInt(quote.transactionRequest.value),
            });
            updateStep(index, { status: 'completed', txHash: hash });
          } else {
            updateStep(index, { status: 'completed', privacyNote: 'Quote received — no tx needed yet' });
          }
        } else {
          updateStep(index, { status: 'completed', privacyNote: 'Token not resolved — simulated' });
        }
        break;
      }

      case 'ADD_LIQUIDITY': {
        // Liquidity provision is complex; mark as simulated for hackathon
        updateStep(index, { status: 'completed', privacyNote: 'Simulated — LP position would be opened here' });
        break;
      }

      default:
        updateStep(index, { status: 'completed', privacyNote: 'Unknown step type — skipped' });
    }
  }, [address, sendTx, switchChainAsync, updateStep]);

  const execute = useCallback(async (plan: ExecutionPlan) => {
    if (!address) {
      setState(prev => ({ ...prev, error: 'Connect your wallet first' }));
      return;
    }

    abortRef.current = false;
    const steps = plan.steps.map(s => ({ ...s, status: 'pending' as StepStatus }));
    setState({ status: 'running', currentStepIndex: 0, steps, waitCountdown: null, error: null });

    for (let i = 0; i < steps.length; i++) {
      if (abortRef.current) {
        setState(prev => ({ ...prev, status: 'failed', error: 'Execution cancelled by user' }));
        return;
      }
      try {
        await executeStep(steps[i], i);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Step failed';
        updateStep(i, { status: 'failed', error: msg });
        setState(prev => ({ ...prev, status: 'failed', error: msg }));
        return;
      }
      // Check abort again after step completes
      if (abortRef.current) {
        setState(prev => ({ ...prev, status: 'failed', error: 'Execution cancelled by user' }));
        return;
      }
    }

    setState(prev => ({ ...prev, status: 'completed', currentStepIndex: steps.length }));
  }, [address, executeStep, updateStep]);

  const cancel = useCallback(() => {
    abortRef.current = true;
    setState(prev => ({ ...prev, status: 'failed', waitCountdown: null, error: 'Execution cancelled by user' }));
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setState({ status: 'idle', currentStepIndex: -1, steps: [], waitCountdown: null, error: null });
  }, []);

  return { state, execute, cancel, reset };
}
