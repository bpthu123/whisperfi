'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { StepCard } from './StepCard';
import { Zap, Clock, DollarSign, Shield, Play, Square, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ExecutionPlan } from '@/types/execution';
import type { ExecutionState } from '@/hooks/useExecutionEngine';

interface ExecutionPlanProps {
  plan: ExecutionPlan;
  executionState?: ExecutionState;
  onExecute?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
}

const strategyColors: Record<string, string> = {
  standard: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  split: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  delayed: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'cross-chain-obfuscated': 'bg-violet-500/10 text-violet-400 border-violet-500/30',
};

const strategyLabels: Record<string, string> = {
  standard: 'Standard',
  split: 'Split Order',
  delayed: 'Time-Delayed',
  'cross-chain-obfuscated': 'Cross-Chain Obfuscated',
};

export function ExecutionPlanCard({ plan, executionState, onExecute, onCancel, onReset }: ExecutionPlanProps) {
  const isRunning = executionState?.status === 'running';
  const isCompleted = executionState?.status === 'completed';
  const isFailed = executionState?.status === 'failed';
  const hasExecutionState = executionState && executionState.status !== 'idle';

  // Use live step data if executing, otherwise use plan steps
  const steps = hasExecutionState ? executionState.steps : plan.steps;
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  return (
    <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white">Execution Plan</span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/30 animate-pulse">
              Executing...
            </Badge>
          )}
          {isCompleted && (
            <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
              Complete
            </Badge>
          )}
          {isFailed && (
            <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30">
              Failed
            </Badge>
          )}
          <Badge variant="outline" className={strategyColors[plan.strategy]}>
            {strategyLabels[plan.strategy]}
          </Badge>
        </div>
      </div>

      <p className="text-xs text-gray-400">{plan.description}</p>

      {/* Progress bar when executing */}
      {hasExecutionState && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Progress</span>
            <span className="text-white font-medium">{completedCount}/{steps.length} steps</span>
          </div>
          <Progress
            value={progressPct}
            className={`h-2 bg-gray-800 ${isCompleted ? '[&>div]:bg-green-500' : isFailed ? '[&>div]:bg-red-500' : '[&>div]:bg-violet-500'}`}
          />
        </div>
      )}

      {/* Wait countdown */}
      {executionState?.waitCountdown != null && executionState.waitCountdown > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <p className="text-sm font-medium text-amber-300">Privacy delay active</p>
            <p className="text-xs text-amber-400/70">
              Waiting {executionState.waitCountdown}s to prevent timing correlation...
            </p>
          </div>
          <span className="ml-auto text-2xl font-mono font-bold text-amber-400">
            {executionState.waitCountdown}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-xs">
          <DollarSign className="w-3.5 h-3.5 text-green-400" />
          <div>
            <span className="text-gray-500 block">Est. Gas</span>
            <span className="text-white font-medium">{plan.totalEstimatedGas}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <div>
            <span className="text-gray-500 block">Est. Time</span>
            <span className="text-white font-medium">{formatTime(plan.totalEstimatedTime)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Shield className="w-3.5 h-3.5 text-violet-400" />
          <div>
            <span className="text-gray-500 block">Privacy</span>
            <span className="text-white font-medium">{plan.privacyScore}/100</span>
          </div>
        </div>
      </div>

      <Separator className="bg-violet-900/30" />

      {/* Steps */}
      <div className="space-y-2">
        <span className="text-xs text-gray-400 font-medium">
          Steps ({steps.length})
        </span>
        {steps.map((step, index) => (
          <StepCard key={step.id} step={step} index={index} />
        ))}
      </div>

      {/* Error */}
      {executionState?.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{executionState.error}</p>
        </div>
      )}

      {/* Action buttons */}
      <Separator className="bg-violet-900/30" />
      <div className="flex gap-2">
        {!hasExecutionState && onExecute && (
          <Button
            onClick={onExecute}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Execute Plan
          </Button>
        )}
        {isRunning && onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Square className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        {(isCompleted || isFailed) && onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            className="flex-1 border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            All steps completed
          </div>
        )}
      </div>
    </Card>
  );
}
