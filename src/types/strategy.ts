export interface StrategyConfig {
  name: string;
  description: string;
  intentType: string;
  privacyLevel: string;
  splitCount?: number;
  delayRange?: [number, number];
  preferredChains?: number[];
  slippageTolerance: number;
  createdAt: number;
  author: string;
}

export interface ENSStrategyRecord {
  key: string; // e.g., 'com.whisperfi.strategy.conservative-swap'
  value: string; // JSON-serialized StrategyConfig
}

export interface StrategyLookupResult {
  ensName: string;
  strategies: StrategyConfig[];
  error?: string;
}
