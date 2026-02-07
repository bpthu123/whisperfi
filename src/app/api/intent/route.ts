import { NextRequest, NextResponse } from 'next/server';
import { parseIntent } from '@/lib/ai/intent-parser';
import { analyzePrivacy } from '@/lib/ai/privacy-analyzer';
import { optimizeStrategy } from '@/lib/ai/strategy-optimizer';
import { getCrossChainQuote, type CrossChainQuoteResult } from '@/lib/lifi/cross-chain';
import { resolveTokenAddress, resolveTokenDecimals } from '@/lib/tokens';
import { parseUnits } from 'viem';
import { RateLimitError } from '@/lib/ai/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, walletContext } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Step 1: Parse the user's intent
    const intentResult = await parseIntent(message, walletContext);

    // Step 2: Analyze privacy risks
    const privacyAnalysis = await analyzePrivacy(intentResult.intent);

    // Step 3: Generate optimized execution plan
    const executionPlan = await optimizeStrategy(intentResult.intent, privacyAnalysis);

    // Step 4: Fetch real LI.FI quotes for cross-chain or bridge intents
    let lifiQuote: CrossChainQuoteResult | null = null;
    const intent = intentResult.intent;
    const isCrossChain = intent.fromToken.chainId !== intent.toToken.chainId;

    if (isCrossChain || intent.type === 'BRIDGE') {
      const fromAddress = walletContext?.address || '0x0000000000000000000000000000000000000001';
      const fromTokenAddr = resolveTokenAddress(intent.fromToken.token, intent.fromToken.chainId);
      const toTokenAddr = resolveTokenAddress(intent.toToken.token, intent.toToken.chainId);

      if (fromTokenAddr && toTokenAddr) {
        const decimals = resolveTokenDecimals(intent.fromToken.token, intent.fromToken.chainId);
        const amountWei = parseUnits(intent.fromToken.amount, decimals).toString();

        try {
          lifiQuote = await getCrossChainQuote({
            fromChainId: intent.fromToken.chainId,
            toChainId: intent.toToken.chainId,
            fromToken: fromTokenAddr,
            toToken: toTokenAddr,
            fromAmount: amountWei,
            fromAddress,
          });
        } catch (e) {
          console.warn('LI.FI quote failed (non-fatal):', e instanceof Error ? e.message : e);
        }
      }
    }

    // Build summary
    let summary = `Parsed your intent as a ${intent.type} operation. ` +
      `Privacy score: ${privacyAnalysis.overallScore}/100. ` +
      `Recommended strategy: ${executionPlan.strategy} with ${executionPlan.steps.length} steps.`;

    if (lifiQuote) {
      summary += `\n\nLI.FI Quote: ${lifiQuote.fromAmount} ${lifiQuote.fromToken} → ${lifiQuote.toAmount} ${lifiQuote.toToken}` +
        ` via ${lifiQuote.route}. Est. gas: $${lifiQuote.estimatedGas}, time: ~${lifiQuote.estimatedTime}s.`;
    }

    return NextResponse.json({
      intentResult,
      privacyAnalysis,
      executionPlan,
      lifiQuote,
      summary,
    });
  } catch (error) {
    console.error('Intent processing error:', error);
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: error.message, stats: error.stats },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process intent' },
      { status: 500 }
    );
  }
}
