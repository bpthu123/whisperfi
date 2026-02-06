'use client';

import { Shield, User, Globe, ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PrivacyAnalysisCard } from '@/components/execution/PrivacyAnalysis';
import { ExecutionPlanCard } from '@/components/execution/ExecutionPlan';
import { useExecutionEngine } from '@/hooks/useExecutionEngine';
import type { ChatMessage as ChatMessageType } from '@/types/intent';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const { state: execState, execute, cancel, reset } = useExecutionEngine();

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-purple-500/20'
            : 'bg-violet-500/20'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-purple-400" />
        ) : (
          <Shield className="w-4 h-4 text-violet-400" />
        )}
      </div>

      <div
        className={`max-w-[80%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-violet-600/30 border border-violet-500/30 rounded-tr-sm text-white'
              : 'bg-gray-900/50 border border-violet-900/30 rounded-tl-sm text-gray-200'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.lifiQuote && (
          <LiFiQuoteCard quote={message.lifiQuote} />
        )}

        {message.privacyAnalysis && (
          <PrivacyAnalysisCard analysis={message.privacyAnalysis} />
        )}

        {message.executionPlan && (
          <ExecutionPlanCard
            plan={message.executionPlan}
            executionState={execState}
            onExecute={() => execute(message.executionPlan!)}
            onCancel={cancel}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}

function LiFiQuoteCard({ quote }: { quote: NonNullable<ChatMessageType['lifiQuote']> }) {
  const formatAmount = (amount: string, symbol: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return `${amount} ${symbol}`;
    if (num > 1e15) {
      const eth = num / 1e18;
      if (eth > 0.001) return `${eth.toFixed(4)} ${symbol}`;
      const usdc = num / 1e6;
      if (usdc > 0.01) return `${usdc.toFixed(2)} ${symbol}`;
    }
    return `${num.toFixed(num < 1 ? 6 : 2)} ${symbol}`;
  };

  return (
    <Card className="bg-cyan-500/5 border border-cyan-500/20 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-white">LI.FI Live Quote</span>
        <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
          Real-time
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-black/30 rounded-lg px-3 py-2 flex-1 text-center">
          <p className="text-xs text-gray-500">From</p>
          <p className="text-sm font-medium text-white">{formatAmount(quote.fromAmount, quote.fromToken)}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <div className="bg-black/30 rounded-lg px-3 py-2 flex-1 text-center">
          <p className="text-xs text-gray-500">To</p>
          <p className="text-sm font-medium text-white">{formatAmount(quote.toAmount, quote.toToken)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-green-400" />
          Gas: ${quote.estimatedGas}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-blue-400" />
          ~{quote.estimatedTime}s
        </span>
        <span className="text-cyan-400/70">
          via {quote.route}
        </span>
      </div>
    </Card>
  );
}
