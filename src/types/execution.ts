export enum StepType {
  APPROVE = 'APPROVE',
  SWAP_UNISWAP = 'SWAP_UNISWAP',
  BRIDGE_LIFI = 'BRIDGE_LIFI',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY',
  WAIT = 'WAIT',
}

export type StepStatus = 'pending' | 'executing' | 'completed' | 'failed';

export interface ExecutionStep {
  id: string;
  type: StepType;
  description: string;
  status: StepStatus;
  fromToken: string;
  toToken: string;
  amount: string;
  chainId: number;
  toChainId?: number; // destination chain for BRIDGE_LIFI steps
  estimatedGas: string;
  estimatedTime: number; // seconds
  privacyNote?: string;
  txHash?: string;
  error?: string;
}

export interface ExecutionPlan {
  id: string;
  strategy: 'standard' | 'split' | 'delayed' | 'cross-chain-obfuscated';
  steps: ExecutionStep[];
  totalEstimatedGas: string;
  totalEstimatedTime: number;
  privacyScore: number; // 0-100
  description: string;
}
