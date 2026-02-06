'use client';

import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  ArrowRightLeft,
  Timer,
  KeyRound,
  Layers,
  GitBranch,
} from 'lucide-react';
import type { ExecutionStep, StepType } from '@/types/execution';

interface StepCardProps {
  step: ExecutionStep;
  index: number;
}

const stepIcons: Record<StepType, React.ReactNode> = {
  APPROVE: <KeyRound className="w-3.5 h-3.5" />,
  SWAP_UNISWAP: <ArrowRightLeft className="w-3.5 h-3.5" />,
  BRIDGE_LIFI: <GitBranch className="w-3.5 h-3.5" />,
  ADD_LIQUIDITY: <Layers className="w-3.5 h-3.5" />,
  WAIT: <Timer className="w-3.5 h-3.5" />,
};

const statusIcons = {
  pending: <Circle className="w-4 h-4 text-gray-500" />,
  executing: <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />,
  completed: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  failed: <XCircle className="w-4 h-4 text-red-400" />,
};

const chainNames: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  10: 'Optimism',
  137: 'Polygon',
};

export function StepCard({ step, index }: StepCardProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
        step.status === 'executing'
          ? 'bg-violet-500/5 border-violet-500/30'
          : step.status === 'completed'
            ? 'bg-green-500/5 border-green-500/20'
            : step.status === 'failed'
              ? 'bg-red-500/5 border-red-500/20'
              : 'bg-gray-900/30 border-gray-800'
      }`}
    >
      <div className="flex flex-col items-center gap-1">
        {statusIcons[step.status]}
        <span className="text-[10px] text-gray-500">#{index + 1}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-violet-400">{stepIcons[step.type]}</span>
          <span className="text-xs font-medium text-white truncate">
            {step.description}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {step.type !== 'WAIT' && (
            <span className="text-[10px] text-gray-400">
              {step.amount} {step.fromToken} → {step.toToken}
            </span>
          )}
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-gray-900/50 text-gray-400 border-gray-700">
            {chainNames[step.chainId] || `Chain ${step.chainId}`}
            {step.toChainId && step.toChainId !== step.chainId && (
              <> → {chainNames[step.toChainId] || `Chain ${step.toChainId}`}</>
            )}
          </Badge>
          <span className="text-[10px] text-gray-500">
            ~{step.estimatedGas} gas
          </span>
          <span className="text-[10px] text-gray-500">
            ~{step.estimatedTime}s
          </span>
        </div>

        {step.privacyNote && (
          <p className="text-[10px] text-violet-400/70 mt-1 italic">
            {step.privacyNote}
          </p>
        )}

        {step.txHash && (
          <p className="text-[10px] text-blue-400 mt-1 font-mono truncate">
            tx: {step.txHash}
          </p>
        )}

        {step.error && (
          <p className="text-[10px] text-red-400 mt-1">{step.error}</p>
        )}
      </div>
    </div>
  );
}
