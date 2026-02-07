import { NextRequest } from 'next/server';
import { parseIntent } from '@/lib/ai/intent-parser';
import { analyzePrivacy } from '@/lib/ai/privacy-analyzer';
import { optimizeStrategy } from '@/lib/ai/strategy-optimizer';
import { getCrossChainQuote, type CrossChainQuoteResult } from '@/lib/lifi/cross-chain';
import { resolveTokenAddress, resolveTokenDecimals } from '@/lib/tokens';
import { parseUnits } from 'viem';
import { RateLimitError } from '@/lib/ai/rate-limiter';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, walletContext } = body;

  if (!message || typeof message !== 'string') {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        // Stage 1: Parse intent
        send('stage', { stage: 'parsing', message: 'Parsing your intent with AI...' });
        const intentResult = await parseIntent(message, walletContext);
        send('intent', intentResult);

        // Stage 2: Privacy analysis
        send('stage', { stage: 'analyzing', message: 'Analyzing privacy risks...' });
        const privacyAnalysis = await analyzePrivacy(intentResult.intent);
        send('privacy', privacyAnalysis);

        // Stage 3: Strategy optimization
        send('stage', { stage: 'optimizing', message: 'Generating optimized execution plan...' });
        const executionPlan = await optimizeStrategy(intentResult.intent, privacyAnalysis);
        send('plan', executionPlan);

        // Stage 4: LI.FI quote (if cross-chain)
        let lifiQuote: CrossChainQuoteResult | null = null;
        const intent = intentResult.intent;
        const isCrossChain = intent.fromToken.chainId !== intent.toToken.chainId;

        if (isCrossChain || intent.type === 'BRIDGE') {
          send('stage', { stage: 'quoting', message: 'Fetching cross-chain quote from LI.FI...' });
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
              send('lifi', lifiQuote);
            } catch (e) {
              send('stage', {
                stage: 'quoting',
                message: `LI.FI quote unavailable: ${e instanceof Error ? e.message : 'unknown error'}`,
              });
            }
          }
        }

        // Final summary
        let summary = `Parsed your intent as a ${intent.type} operation. ` +
          `Privacy score: ${privacyAnalysis.overallScore}/100. ` +
          `Recommended strategy: ${executionPlan.strategy} with ${executionPlan.steps.length} steps.`;

        if (lifiQuote) {
          summary += `\n\nLI.FI Quote: ${lifiQuote.fromAmount} ${lifiQuote.fromToken} → ${lifiQuote.toAmount} ${lifiQuote.toToken}` +
            ` via ${lifiQuote.route}. Est. gas: $${lifiQuote.estimatedGas}, time: ~${lifiQuote.estimatedTime}s.`;
        }

        send('done', {
          intentResult,
          privacyAnalysis,
          executionPlan,
          lifiQuote,
          summary,
        });
      } catch (error) {
        if (error instanceof RateLimitError) {
          send('error', {
            error: error.message,
            code: 'RATE_LIMIT_EXCEEDED',
            stats: error.stats,
          });
        } else {
          send('error', {
            error: error instanceof Error ? error.message : 'Failed to process intent',
          });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
