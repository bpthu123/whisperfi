'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useENSStrategy } from '@/hooks/useENSStrategy';
import { Search, Loader2, BookOpen, User } from 'lucide-react';
import type { StrategyConfig } from '@/types/strategy';

export function StrategyBrowser() {
  const { browseStrategies, lookupResult, isLoading, error } = useENSStrategy();
  const [ensInput, setEnsInput] = useState('');

  const handleSearch = () => {
    if (ensInput.trim()) {
      browseStrategies(ensInput.trim());
    }
  };

  return (
    <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-medium text-white">Strategy Browser</span>
      </div>
      <p className="text-xs text-gray-400">
        Look up DeFi strategies published to any ENS name
      </p>

      <div className="flex gap-2">
        <Input
          value={ensInput}
          onChange={(e) => setEnsInput(e.target.value)}
          placeholder="vitalik.eth"
          className="bg-gray-900/50 border-violet-900/30 text-white placeholder:text-gray-500 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading || !ensInput.trim()}
          size="sm"
          className="bg-violet-600 hover:bg-violet-500 text-white"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {lookupResult && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{lookupResult.ensName}</span>
            <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/30">
              {lookupResult.strategies.length} strategies
            </Badge>
          </div>

          {lookupResult.strategies.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">
              No WhisperFi strategies found for this ENS name
            </p>
          ) : (
            lookupResult.strategies.map((strategy, i) => (
              <StrategyCard key={i} strategy={strategy} />
            ))
          )}
        </div>
      )}
    </Card>
  );
}

function StrategyCard({ strategy }: { strategy: StrategyConfig }) {
  return (
    <div className="border border-gray-800 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{strategy.name}</span>
        <Badge variant="outline" className="text-[10px] bg-gray-900/50 text-gray-400 border-gray-700">
          {strategy.intentType}
        </Badge>
      </div>
      <p className="text-xs text-gray-400">{strategy.description}</p>
      <div className="flex items-center gap-3 text-[10px] text-gray-500">
        <span>Privacy: {strategy.privacyLevel}</span>
        {strategy.splitCount && <span>Splits: {strategy.splitCount}</span>}
        <span>Slippage: {(strategy.slippageTolerance * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}
