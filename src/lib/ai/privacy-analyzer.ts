import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, PRIVACY_ANALYSIS_TOOL } from './prompts';
import { checkRateLimit, recordCall } from './rate-limiter';
import type { ParsedIntent } from '@/types/intent';
import type { PrivacyAnalysis } from '@/types/privacy';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyzePrivacy(intent: ParsedIntent): Promise<PrivacyAnalysis> {
  const intentDescription = `
Analyze the privacy risks of this DeFi operation:
- Type: ${intent.type}
- From: ${intent.fromToken.amount} ${intent.fromToken.token} on chain ${intent.fromToken.chainId}
- To: ${intent.toToken.token} on chain ${intent.toToken.chainId}
- Privacy Level Requested: ${intent.privacyLevel}
- Urgency: ${intent.urgency}
- Slippage: ${intent.slippageTolerance * 100}%

Consider MEV exposure, front-running risk, sandwich attack vulnerability, information leakage from on-chain data, and timing analysis risks.`;

  checkRateLimit();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [PRIVACY_ANALYSIS_TOOL],
    tool_choice: { type: 'tool', name: 'analyze_privacy' },
    messages: [{ role: 'user', content: intentDescription }],
  });
  recordCall();

  const toolUse = response.content.find((c) => c.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Failed to analyze privacy: no tool use in response');
  }

  const input = toolUse.input as Record<string, unknown>;

  return {
    overallScore: input.overall_score as number,
    risks: (input.risks as Array<Record<string, unknown>>).map((r) => ({
      category: r.category as PrivacyAnalysis['risks'][0]['category'],
      severity: r.severity as PrivacyAnalysis['risks'][0]['severity'],
      description: r.description as string,
      mitigation: r.mitigation as string,
    })),
    recommendations: input.recommendations as string[],
    standardExposure: input.standard_exposure as string,
    optimizedExposure: input.optimized_exposure as string,
    improvementPercentage: input.improvement_percentage as number,
  };
}
