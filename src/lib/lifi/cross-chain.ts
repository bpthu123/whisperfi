import { getQuote, type QuoteRequest } from '@lifi/sdk';
import './config'; // ensure config is initialized

export interface CrossChainQuoteParams {
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromAddress: string;
}

export interface CrossChainQuoteResult {
  id: string;
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  estimatedTime: number;
  route: string;
  transactionRequest?: {
    to: string;
    data: string;
    value: string;
    chainId: number;
    gasLimit: string;
  };
}

export async function getCrossChainQuote(
  params: CrossChainQuoteParams
): Promise<CrossChainQuoteResult> {
  try {
    const quoteRequest: QuoteRequest = {
      fromChain: params.fromChainId,
      toChain: params.toChainId,
      fromToken: params.fromToken,
      toToken: params.toToken,
      fromAmount: params.fromAmount,
      fromAddress: params.fromAddress as `0x${string}`,
    };

    const quote = await getQuote(quoteRequest);

    return {
      id: quote.id || `quote-${Date.now()}`,
      fromChainId: params.fromChainId,
      toChainId: params.toChainId,
      fromToken: quote.action.fromToken.symbol,
      toToken: quote.action.toToken.symbol,
      fromAmount: quote.action.fromAmount,
      toAmount: quote.estimate.toAmount,
      estimatedGas: quote.estimate.gasCosts?.[0]?.amountUSD || '0',
      estimatedTime: quote.estimate.executionDuration || 120,
      route: quote.toolDetails?.name || 'LI.FI Aggregated',
      transactionRequest: quote.transactionRequest
        ? {
            to: quote.transactionRequest.to as string,
            data: quote.transactionRequest.data as string,
            value: (quote.transactionRequest.value || '0') as string,
            chainId: params.fromChainId,
            gasLimit: (quote.transactionRequest.gasLimit || '500000') as string,
          }
        : undefined,
    };
  } catch (error) {
    console.error('LI.FI quote error:', error);
    throw new Error(`Failed to get cross-chain quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get an obfuscated cross-chain route that goes through an intermediate chain
 * to make the final destination harder to trace.
 */
export async function getCrossChainObfuscatedQuote(
  params: CrossChainQuoteParams,
  intermediateChainId: number = 10 // Default: Optimism
): Promise<{ leg1: CrossChainQuoteResult; leg2: CrossChainQuoteResult }> {
  // Leg 1: Source → Intermediate (bridge to USDC on intermediate chain)
  const leg1 = await getCrossChainQuote({
    ...params,
    toChainId: intermediateChainId,
    toToken: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC on Optimism
  });

  // Leg 2: Intermediate → Destination
  const leg2 = await getCrossChainQuote({
    fromChainId: intermediateChainId,
    toChainId: params.toChainId,
    fromToken: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC on Optimism
    toToken: params.toToken,
    fromAmount: leg1.toAmount,
    fromAddress: params.fromAddress,
  });

  return { leg1, leg2 };
}
