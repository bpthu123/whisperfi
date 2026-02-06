'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useENSStrategy } from '@/hooks/useENSStrategy';
import { Upload, Shield, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export function StrategyPublisher() {
  const { ensName, createStrategy, publishStrategy, isPublishing, error } = useENSStrategy();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<'standard' | 'enhanced' | 'maximum'>('enhanced');
  const [splitCount, setSplitCount] = useState('3');
  const [txHash, setTxHash] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!name.trim()) return;

    const strategy = createStrategy(name.trim(), {
      description: description.trim() || undefined,
      privacyLevel,
      splitCount: parseInt(splitCount) || 3,
    });

    const hash = await publishStrategy(strategy);
    if (hash) {
      setTxHash(hash);
      setName('');
      setDescription('');
    }
  };

  if (!ensName) {
    return (
      <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white">Publish Strategy</span>
        </div>
        <p className="text-xs text-gray-400 text-center py-4">
          Connect a wallet with an ENS name to publish strategies
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white">Publish Strategy</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/30">
          {ensName}
        </Badge>
      </div>

      {txHash && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
          <div className="text-xs text-green-300">
            Published to {ensName}!{' '}
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-200"
            >
              View tx
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-300">{error}</span>
        </div>
      )}

      <div className="space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Strategy name (e.g., conservative-swap)"
          className="bg-gray-900/50 border-violet-900/30 text-white placeholder:text-gray-500 text-sm"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your strategy..."
          className="bg-gray-900/50 border-violet-900/30 text-white placeholder:text-gray-500 text-sm min-h-[60px]"
          rows={2}
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Privacy:</span>
          {(['standard', 'enhanced', 'maximum'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setPrivacyLevel(level)}
              className={`text-xs px-2 py-1 rounded-md border transition-all ${
                privacyLevel === level
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'border-gray-700 text-gray-500 hover:text-gray-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Split count:</span>
          <Input
            type="number"
            value={splitCount}
            onChange={(e) => setSplitCount(e.target.value)}
            className="w-20 bg-gray-900/50 border-violet-900/30 text-white text-sm h-8"
            min="1"
            max="10"
          />
        </div>

        <Button
          onClick={handlePublish}
          disabled={!name.trim() || isPublishing}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing to ENS...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Publish to ENS
            </>
          )}
        </Button>

        <p className="text-[10px] text-gray-600 text-center">
          Requires an ENS setText transaction on Ethereum mainnet
        </p>
      </div>
    </Card>
  );
}
