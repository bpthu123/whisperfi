'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Shield, BarChart3, ShieldCheck, ShieldOff } from 'lucide-react';
import { usePrivacySettings } from '@/store/privacy-settings';

export function Header() {
  const { flashbotsEnabled, toggleFlashbots } = usePrivacySettings();

  return (
    <header className="border-b border-violet-900/30 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-violet-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
              WhisperFi
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-violet-300 transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-violet-300 transition-colors flex items-center gap-1"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFlashbots}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              flashbotsEnabled
                ? 'bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/25'
                : 'bg-gray-800/50 border-gray-700/50 text-gray-500 hover:text-gray-300 hover:border-gray-600'
            }`}
            title={flashbotsEnabled ? 'Flashbots Protect: ON — txs sent to private mempool' : 'Flashbots Protect: OFF — txs sent to public mempool'}
          >
            {flashbotsEnabled ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <ShieldOff className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Flashbots</span>
            <span className={`w-1.5 h-1.5 rounded-full ${flashbotsEnabled ? 'bg-green-400' : 'bg-gray-600'}`} />
          </button>
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>
    </header>
  );
}
