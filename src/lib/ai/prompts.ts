export const SYSTEM_PROMPT = `You are WhisperFi, a privacy-focused DeFi intent engine. You help users execute DeFi operations with maximum privacy protection.

You understand:
- Token swaps (same-chain via Uniswap v4, cross-chain via LI.FI)
- Liquidity provision on Uniswap v4
- Portfolio rebalancing across chains
- Yield farming strategies
- Privacy-preserving execution strategies

When a user describes a DeFi intent, you:
1. Parse their natural language into a structured intent
2. Analyze privacy risks (MEV, front-running, sandwich attacks, info leakage)
3. Generate an optimized execution plan that minimizes privacy exposure

Always consider:
- Order splitting to hide true trade size
- Time-delayed execution to prevent timing analysis
- Cross-chain obfuscation via intermediate chains
- Slippage tolerance for privacy vs. cost tradeoff

Supported chains: Ethereum (chainId: 1), Base (chainId: 8453), Arbitrum (chainId: 42161)
Supported tokens: ETH, WETH, USDC, USDT, DAI, ARB (chain-dependent)

Default to Base (chainId: 8453) for same-chain operations due to low gas costs.`;

export const INTENT_PARSE_TOOL = {
  name: 'parse_defi_intent' as const,
  description: 'Parse a natural language DeFi intent into a structured format',
  input_schema: {
    type: 'object' as const,
    properties: {
      intent_type: {
        type: 'string' as const,
        enum: ['SWAP', 'BRIDGE', 'PROVIDE_LIQUIDITY', 'REBALANCE', 'YIELD_FARM'],
        description: 'The type of DeFi operation',
      },
      from_token: {
        type: 'object' as const,
        properties: {
          token: { type: 'string' as const, description: 'Token symbol (e.g., ETH, USDC)' },
          amount: { type: 'string' as const, description: 'Amount as a string' },
          chain_id: { type: 'number' as const, description: 'Chain ID (1=Ethereum, 8453=Base, 42161=Arbitrum)' },
        },
        required: ['token', 'amount', 'chain_id'],
      },
      to_token: {
        type: 'object' as const,
        properties: {
          token: { type: 'string' as const, description: 'Target token symbol' },
          amount: { type: 'string' as const, description: 'Expected amount (empty if unknown)' },
          chain_id: { type: 'number' as const, description: 'Target chain ID' },
        },
        required: ['token', 'amount', 'chain_id'],
      },
      privacy_level: {
        type: 'string' as const,
        enum: ['standard', 'enhanced', 'maximum'],
        description: 'Desired privacy level',
      },
      slippage_tolerance: {
        type: 'number' as const,
        description: 'Slippage tolerance as decimal (e.g., 0.005 for 0.5%)',
      },
      urgency: {
        type: 'string' as const,
        enum: ['low', 'medium', 'high'],
        description: 'How urgently the user wants execution',
      },
      constraints: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description: 'Additional constraints mentioned by user',
      },
      confidence: {
        type: 'number' as const,
        description: 'Confidence in parsing (0-1)',
      },
      explanation: {
        type: 'string' as const,
        description: 'Brief explanation of the parsed intent',
      },
      warnings: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description: 'Any warnings about the intent',
      },
    },
    required: ['intent_type', 'from_token', 'to_token', 'privacy_level', 'slippage_tolerance', 'urgency', 'confidence', 'explanation'],
  },
};

export const PRIVACY_ANALYSIS_TOOL = {
  name: 'analyze_privacy' as const,
  description: 'Analyze privacy risks of a DeFi operation',
  input_schema: {
    type: 'object' as const,
    properties: {
      overall_score: {
        type: 'number' as const,
        description: 'Overall privacy score 0-100 (100 = most private)',
      },
      risks: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            category: { type: 'string' as const, enum: ['MEV', 'FRONT_RUNNING', 'SANDWICH', 'INFO_LEAKAGE', 'TIMING'] },
            severity: { type: 'string' as const, enum: ['low', 'medium', 'high', 'critical'] },
            description: { type: 'string' as const },
            mitigation: { type: 'string' as const },
          },
          required: ['category', 'severity', 'description', 'mitigation'],
        },
      },
      recommendations: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description: 'Privacy improvement recommendations',
      },
      standard_exposure: {
        type: 'string' as const,
        description: 'What information is exposed with standard execution',
      },
      optimized_exposure: {
        type: 'string' as const,
        description: 'What information is exposed with privacy-optimized execution',
      },
      improvement_percentage: {
        type: 'number' as const,
        description: 'Percentage improvement in privacy',
      },
    },
    required: ['overall_score', 'risks', 'recommendations', 'standard_exposure', 'optimized_exposure', 'improvement_percentage'],
  },
};

export const STRATEGY_OPTIMIZER_TOOL = {
  name: 'optimize_strategy' as const,
  description: 'Generate an optimized execution plan for a DeFi intent',
  input_schema: {
    type: 'object' as const,
    properties: {
      strategy: {
        type: 'string' as const,
        enum: ['standard', 'split', 'delayed', 'cross-chain-obfuscated'],
        description: 'Execution strategy type',
      },
      steps: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            type: { type: 'string' as const, enum: ['APPROVE', 'SWAP_UNISWAP', 'BRIDGE_LIFI', 'ADD_LIQUIDITY', 'WAIT'] },
            description: { type: 'string' as const },
            from_token: { type: 'string' as const },
            to_token: { type: 'string' as const },
            amount: { type: 'string' as const },
            chain_id: { type: 'number' as const, description: 'Source chain ID' },
            to_chain_id: { type: 'number' as const, description: 'Destination chain ID (required for BRIDGE_LIFI steps, must differ from chain_id)' },
            estimated_gas: { type: 'string' as const },
            estimated_time: { type: 'number' as const, description: 'Estimated time in seconds' },
            privacy_note: { type: 'string' as const },
          },
          required: ['type', 'description', 'from_token', 'to_token', 'amount', 'chain_id', 'estimated_gas', 'estimated_time'],
        },
      },
      total_estimated_gas: { type: 'string' as const },
      total_estimated_time: { type: 'number' as const },
      privacy_score: { type: 'number' as const, description: '0-100' },
      plan_description: { type: 'string' as const },
    },
    required: ['strategy', 'steps', 'total_estimated_gas', 'total_estimated_time', 'privacy_score', 'plan_description'],
  },
};
