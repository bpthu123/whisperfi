export interface SplitOrder {
  amount: string;
  delaySeconds: number;
  index: number;
}

/**
 * Split a large order into random-sized chunks for privacy.
 * This hides the true trade size from MEV bots and on-chain observers.
 */
export function splitOrder(totalAmount: string, numSplits: number): SplitOrder[] {
  const total = parseFloat(totalAmount);
  const splits: SplitOrder[] = [];

  // Generate random proportions
  const randomWeights = Array.from({ length: numSplits }, () => Math.random() + 0.3);
  const weightSum = randomWeights.reduce((a, b) => a + b, 0);

  let remaining = total;
  for (let i = 0; i < numSplits; i++) {
    const isLast = i === numSplits - 1;
    const amount = isLast
      ? remaining
      : parseFloat((total * (randomWeights[i] / weightSum)).toFixed(6));

    remaining -= amount;

    splits.push({
      amount: amount.toFixed(6),
      delaySeconds: i === 0 ? 0 : getRandomDelay(30, 120),
      index: i,
    });
  }

  return splits;
}

/**
 * Generate a random delay between min and max seconds.
 * Used to prevent timing analysis of split orders.
 */
function getRandomDelay(minSeconds: number, maxSeconds: number): number {
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}

/**
 * Calculate privacy score based on strategy parameters.
 * Higher score = more private.
 */
export function calculatePrivacyScore(params: {
  strategy: 'standard' | 'split' | 'delayed' | 'cross-chain-obfuscated';
  numSplits?: number;
  hasDelay?: boolean;
  crossChain?: boolean;
}): number {
  let score = 20; // Base score for any strategy

  switch (params.strategy) {
    case 'standard':
      break;
    case 'split':
      score += 25;
      if (params.numSplits && params.numSplits >= 3) score += 10;
      if (params.numSplits && params.numSplits >= 5) score += 5;
      break;
    case 'delayed':
      score += 35;
      if (params.hasDelay) score += 15;
      break;
    case 'cross-chain-obfuscated':
      score += 45;
      if (params.crossChain) score += 15;
      break;
  }

  return Math.min(score, 100);
}

/**
 * Recommend a privacy strategy based on trade size and user preferences.
 */
export function recommendStrategy(params: {
  amountUSD: number;
  privacyLevel: 'standard' | 'enhanced' | 'maximum';
  urgency: 'low' | 'medium' | 'high';
}): {
  strategy: 'standard' | 'split' | 'delayed' | 'cross-chain-obfuscated';
  numSplits: number;
  reason: string;
} {
  const { amountUSD, privacyLevel, urgency } = params;

  if (privacyLevel === 'standard' || urgency === 'high') {
    return { strategy: 'standard', numSplits: 1, reason: 'Direct execution for speed' };
  }

  if (privacyLevel === 'maximum' && urgency === 'low') {
    if (amountUSD > 10000) {
      return {
        strategy: 'cross-chain-obfuscated',
        numSplits: 5,
        reason: 'Large trade with maximum privacy: split across chains with delays',
      };
    }
    return {
      strategy: 'delayed',
      numSplits: 4,
      reason: 'Maximum privacy with time-delayed split execution',
    };
  }

  // Enhanced privacy
  if (amountUSD > 5000) {
    return {
      strategy: 'split',
      numSplits: 3,
      reason: 'Split into 3 chunks to hide trade size',
    };
  }

  return {
    strategy: 'split',
    numSplits: 2,
    reason: 'Split into 2 chunks for moderate privacy',
  };
}
