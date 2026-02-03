import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, INTENT_PARSE_TOOL } from './prompts';
import { checkRateLimit, recordCall } from './rate-limiter';
import type { IntentParseResult, WalletContext } from '@/types/intent';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function parseIntent(
  userMessage: string,
  walletContext?: WalletContext
): Promise<IntentParseResult> {
  const contextInfo = walletContext
    ? `\n\nUser wallet context:\n- Address: ${walletContext.address}\n- ENS: ${walletContext.ensName || 'none'}\n- Chain: ${walletContext.chainId}\n- Balances: ${JSON.stringify(walletContext.balances)}`
    : '';

  checkRateLimit();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT + contextInfo,
    tools: [INTENT_PARSE_TOOL],
    tool_choice: { type: 'tool', name: 'parse_defi_intent' },
    messages: [{ role: 'user', content: userMessage }],
  });
  recordCall();

  const toolUse = response.content.find((c) => c.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Failed to parse intent: no tool use in response');
  }

  const input = toolUse.input as Record<string, unknown>;

  return {
    intent: {
      type: input.intent_type as IntentParseResult['intent']['type'],
      fromToken: {
        token: (input.from_token as Record<string, unknown>).token as string,
        amount: (input.from_token as Record<string, unknown>).amount as string,
        chainId: (input.from_token as Record<string, unknown>).chain_id as number,
      },
      toToken: {
        token: (input.to_token as Record<string, unknown>).token as string,
        amount: (input.to_token as Record<string, unknown>).amount as string || '',
        chainId: (input.to_token as Record<string, unknown>).chain_id as number,
      },
      privacyLevel: input.privacy_level as 'standard' | 'enhanced' | 'maximum',
      slippageTolerance: input.slippage_tolerance as number,
      urgency: input.urgency as 'low' | 'medium' | 'high',
      additionalConstraints: (input.constraints as string[]) || [],
    },
    confidence: input.confidence as number,
    explanation: input.explanation as string,
    warnings: (input.warnings as string[]) || [],
  };
}
