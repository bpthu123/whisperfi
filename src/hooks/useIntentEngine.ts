'use client';

import { useState, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useEnsName } from 'wagmi';
import type { ChatMessage } from '@/types/intent';
import type { IntentParseResult } from '@/types/intent';
import type { PrivacyAnalysis } from '@/types/privacy';
import type { ExecutionPlan } from '@/types/execution';

interface IntentEngineState {
  messages: ChatMessage[];
  isProcessing: boolean;
  streamingStage: string | null;
  error: string | null;
}

export function useIntentEngine() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address });
  const [state, setState] = useState<IntentEngineState>({
    messages: [],
    isProcessing: false,
    streamingStage: null,
    error: null,
  });

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isProcessing: true,
        streamingStage: null,
        error: null,
      }));

      try {
        const response = await fetch('/api/intent/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            walletContext: address
              ? {
                  address,
                  ensName: ensName || undefined,
                  chainId,
                  balances: {},
                }
              : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process intent');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let buffer = '';
        let finalData: {
          intentResult?: IntentParseResult;
          privacyAnalysis?: PrivacyAnalysis;
          executionPlan?: ExecutionPlan;
          lifiQuote?: unknown;
          summary?: string;
        } = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          let currentEvent = '';
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              currentEvent = line.slice(7);
            } else if (line.startsWith('data: ') && currentEvent) {
              try {
                const data = JSON.parse(line.slice(6));

                switch (currentEvent) {
                  case 'stage':
                    setState((prev) => ({
                      ...prev,
                      streamingStage: data.message,
                    }));
                    break;
                  case 'intent':
                    finalData.intentResult = data;
                    break;
                  case 'privacy':
                    finalData.privacyAnalysis = data;
                    break;
                  case 'plan':
                    finalData.executionPlan = data;
                    break;
                  case 'lifi':
                    finalData.lifiQuote = data;
                    break;
                  case 'done':
                    finalData = data;
                    break;
                  case 'error':
                    throw new Error(
                      data.code === 'RATE_LIMIT_EXCEEDED'
                        ? 'AI usage limit reached. Please try again later.'
                        : data.error
                    );
                }
              } catch (e) {
                if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
                  throw e;
                }
              }
              currentEvent = '';
            }
          }
        }

        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: finalData.summary || 'Analysis complete.',
          timestamp: Date.now(),
          intentResult: finalData.intentResult as IntentParseResult,
          privacyAnalysis: finalData.privacyAnalysis as PrivacyAnalysis,
          executionPlan: finalData.executionPlan as ExecutionPlan,
          lifiQuote: finalData.lifiQuote as ChatMessage['lifiQuote'],
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isProcessing: false,
          streamingStage: null,
        }));

        return assistantMessage;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';

        const errorAssistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-error`,
          role: 'assistant',
          content: errorMessage,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorAssistantMessage],
          isProcessing: false,
          streamingStage: null,
          error: errorMessage,
        }));
      }
    },
    [address, chainId, ensName]
  );

  const clearMessages = useCallback(() => {
    setState({ messages: [], isProcessing: false, streamingStage: null, error: null });
  }, []);

  return {
    messages: state.messages,
    isProcessing: state.isProcessing,
    streamingStage: state.streamingStage,
    error: state.error,
    sendMessage,
    clearMessages,
  };
}
