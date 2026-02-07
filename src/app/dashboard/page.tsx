'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StrategyBrowser } from '@/components/ens/StrategyBrowser';
import { StrategyPublisher } from '@/components/ens/StrategyPublisher';
import { useAccount, useChainId } from 'wagmi';
import { useEnsName } from 'wagmi';
import { Shield, Wallet, Globe, TrendingUp, Layers } from 'lucide-react';
import { SUPPORTED_CHAINS } from '@/lib/web3/config';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address });
  const chainInfo = SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your privacy strategies and monitor portfolio
          </p>
        </div>

        {/* Wallet Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-medium">Wallet</span>
            </div>
            {isConnected ? (
              <>
                <p className="text-sm font-medium text-white font-mono">
                  {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </p>
                {ensName && (
                  <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/30">
                    ENS Verified
                  </Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">Not connected</p>
            )}
          </Card>

          <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">Network</span>
            </div>
            <p className="text-sm font-medium text-white">
              {chainInfo?.icon} {chainInfo?.name || 'Unknown'}
            </p>
            <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
              Connected
            </Badge>
          </Card>

          <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium">Privacy Score</span>
            </div>
            <p className="text-2xl font-bold text-violet-400">--</p>
            <p className="text-[10px] text-gray-500">Execute a trade to see your score</p>
          </Card>
        </div>

        <Separator className="bg-violet-900/30" />

        {/* ENS Strategies */}
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="bg-gray-900/50 border border-violet-900/30">
            <TabsTrigger value="browse" className="data-[state=active]:bg-violet-600/30 data-[state=active]:text-violet-300">
              Browse Strategies
            </TabsTrigger>
            <TabsTrigger value="publish" className="data-[state=active]:bg-violet-600/30 data-[state=active]:text-violet-300">
              Publish Strategy
            </TabsTrigger>
          </TabsList>
          <TabsContent value="browse" className="mt-4">
            <StrategyBrowser />
          </TabsContent>
          <TabsContent value="publish" className="mt-4">
            <StrategyPublisher />
          </TabsContent>
        </Tabs>

        {/* Integration Status */}
        <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-4">
          <h3 className="text-sm font-medium text-white">Integration Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Uniswap v4', icon: <Layers className="w-4 h-4" />, status: 'Active', color: 'text-pink-400' },
              { name: 'LI.FI', icon: <Globe className="w-4 h-4" />, status: 'Active', color: 'text-blue-400' },
              { name: 'ENS', icon: <Shield className="w-4 h-4" />, status: 'Active', color: 'text-cyan-400' },
              { name: 'AI Engine', icon: <TrendingUp className="w-4 h-4" />, status: 'Active', color: 'text-violet-400' },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center gap-2 p-2 rounded-lg border border-gray-800 bg-gray-900/30"
              >
                <span className={integration.color}>{integration.icon}</span>
                <div>
                  <p className="text-xs font-medium text-white">{integration.name}</p>
                  <p className="text-[10px] text-green-400">{integration.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
