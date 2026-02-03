import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, STRATEGY_OPTIMIZER_TOOL } from './prompts';
import { checkRateLimit, recordCall } from './rate-limiter';
import type { ParsedIntent } from '@/types/intent';
import type { PrivacyAnalysis } from '@/types/privacy';
import type { ExecutionPlan, ExecutionStep } from '@/types/execution';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function optimizeStrategy(
  intent: ParsedIntent,
  privacyAnalysis: PrivacyAnalysis
): Promise<ExecutionPlan> {
  const optimizationPrompt = `
Generate an optimized execution plan for this DeFi intent with privacy protections:

Intent:
- Type: ${intent.type}
- From: ${intent.fromToken.amount} ${intent.fromToken.token} on chain ${intent.fromToken.chainId}
- To: ${intent.toToken.token} on chain ${intent.toToken.chainId}
- Privacy Level: ${intent.privacyLevel}
- Urgency: ${intent.urgency}

Privacy Analysis:
- Overall Score: ${privacyAnalysis.overallScore}/100
- Top Risks: ${privacyAnalysis.risks.map((r) => `${r.category}(${r.severity})`).join(', ')}
- Recommendations: ${privacyAnalysis.recommendations.join('; ')}

Generate a concrete execution plan with specific steps. For enhanced/maximum privacy:
- Split large orders into smaller random-sized chunks
- Add WAIT steps between swaps (30-120 seconds)
- For cross-chain operations, consider routing through an intermediate chain
- Use Uniswap v4 for same-chain swaps and LI.FI for cross-chain bridges

Include realistic gas estimates in USD and time estimates in seconds.`;

  checkRateLimit();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    tools: [STRATEGY_OPTIMIZER_TOOL],
    tool_choice: { type: 'tool', name: 'optimize_strategy' },
    messages: [{ role: 'user', content: optimizationPrompt }],
  });
  recordCall();

  const toolUse = response.content.find((c) => c.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Failed to optimize strategy: no tool use in response');
  }

  const input = toolUse.input as Record<string, unknown>;
  const rawSteps = input.steps as Array<Record<string, unknown>>;

  const steps: ExecutionStep[] = rawSteps.map((step, index) => ({
    id: `step-${index}`,
    type: step.type as ExecutionStep['type'],
    description: step.description as string,
    status: 'pending' as const,
    fromToken: step.from_token as string,
    toToken: step.to_token as string,
    amount: step.amount as string,
    chainId: step.chain_id as number,
    toChainId: step.to_chain_id as number | undefined,
    estimatedGas: step.estimated_gas as string,
    estimatedTime: step.estimated_time as number,
    privacyNote: step.privacy_note as string | undefined,
  }));

  return {
    id: `plan-${Date.now()}`,
    strategy: input.strategy as ExecutionPlan['strategy'],
    steps,
    totalEstimatedGas: input.total_estimated_gas as string,
    totalEstimatedTime: input.total_estimated_time as number,
    privacyScore: input.privacy_score as number,
    description: input.plan_description as string,
  };
}
