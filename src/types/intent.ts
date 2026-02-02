export enum IntentType {
  SWAP = 'SWAP',
  BRIDGE = 'BRIDGE',
  PROVIDE_LIQUIDITY = 'PROVIDE_LIQUIDITY',
  REBALANCE = 'REBALANCE',
  YIELD_FARM = 'YIELD_FARM',
}

export interface TokenAmount {
  token: string;
  amount: string;
  chainId: number;
}

export interface ParsedIntent {
  type: IntentType;
  fromToken: TokenAmount;
  toToken: TokenAmount;
  privacyLevel: 'standard' | 'enhanced' | 'maximum';
  slippageTolerance: number;
  urgency: 'low' | 'medium' | 'high';
  additionalConstraints: string[];
}

export interface IntentParseResult {
  intent: ParsedIntent;
  confidence: number;
  explanation: string;
  warnings: string[];
}

export interface WalletContext {
  address: string;
  ensName?: string;
  chainId: number;
  balances: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  intentResult?: IntentParseResult;
  privacyAnalysis?: import('./privacy').PrivacyAnalysis;
  executionPlan?: import('./execution').ExecutionPlan;
  lifiQuote?: {
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
    estimatedGas: string;
    estimatedTime: number;
    route: string;
  };
}
