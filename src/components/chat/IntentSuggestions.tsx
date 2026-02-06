'use client';

import { Zap, Eye, EyeOff, Waves, ArrowRightLeft, Globe } from 'lucide-react';
import type { ReactNode } from 'react';

interface IntentSuggestionsProps {
  onSelect: (message: string) => void;
  compact?: boolean;
}

interface Suggestion {
  label: string;
  icon: ReactNode;
  message: string;
  color: string;
  description?: string;
}

const STRATEGY_TEMPLATES: Suggestion[] = [
  {
    label: 'Speed Mode',
    icon: <Zap className="w-3 h-3" />,
    message: 'Swap 1 ETH for USDC on Base with standard privacy, high urgency',
    color: 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20',
    description: 'Fast execution, minimal delays',
  },
  {
    label: 'Stealth Mode',
    icon: <EyeOff className="w-3 h-3" />,
    message: 'Swap 2 ETH for USDC on Base with enhanced privacy, split into chunks with delays',
    color: 'bg-violet-500/10 text-violet-300 border-violet-500/30 hover:bg-violet-500/20',
    description: 'Split orders + time delays',
  },
  {
    label: 'Whale Mode',
    icon: <Waves className="w-3 h-3" />,
    message: 'Swap 10 ETH for USDC with maximum privacy, split into 5 random chunks with delays and cross-chain obfuscation',
    color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20',
    description: 'Max splitting + cross-chain routing',
  },
];

const QUICK_ACTIONS: Suggestion[] = [
  {
    label: 'Cross-Chain Bridge',
    icon: <Globe className="w-3 h-3" />,
    message: 'Bridge 500 USDC from Arbitrum to Base privately',
    color: 'bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20',
  },
  {
    label: 'Obfuscated Route',
    icon: <ArrowRightLeft className="w-3 h-3" />,
    message: 'Move 2000 USDC from Ethereum to Arbitrum through an intermediate chain for privacy',
    color: 'bg-pink-500/10 text-pink-300 border-pink-500/30 hover:bg-pink-500/20',
  },
];

export function IntentSuggestions({ onSelect, compact }: IntentSuggestionsProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {STRATEGY_TEMPLATES.map((t) => (
          <button
            key={t.label}
            onClick={() => onSelect(t.message)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${t.color}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-lg">
      <p className="text-xs text-gray-500 text-center uppercase tracking-wider">Strategy Templates</p>
      <div className="grid gap-2">
        {STRATEGY_TEMPLATES.map((t) => (
          <button
            key={t.label}
            onClick={() => onSelect(t.message)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left border transition-all cursor-pointer ${t.color}`}
          >
            <div className="flex-shrink-0">{t.icon}</div>
            <div>
              <span className="text-sm font-medium">{t.label}</span>
              {t.description && (
                <span className="text-xs opacity-60 ml-2">{t.description}</span>
              )}
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center uppercase tracking-wider pt-2">Quick Actions</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => onSelect(a.message)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${a.color}`}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
