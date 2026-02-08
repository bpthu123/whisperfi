'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Zap,
  Globe,
  Brain,
  Layers,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Split,
  Timer,
  GitBranch,
  MessageSquare,
  BarChart3,
  BookOpen,
  ExternalLink,
  Users,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Slide components                                                   */
/* ------------------------------------------------------------------ */

function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-8">
      <div className="relative">
        <div className="w-28 h-28 rounded-3xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
          <Shield className="w-14 h-14 text-violet-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-500 rounded-full animate-pulse" />
      </div>
      <div>
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
          WhisperFi
        </h1>
        <p className="text-2xl text-gray-400 mt-4 max-w-2xl font-light">
          Privacy-Preserving AI DeFi Intent Engine
        </p>
      </div>
      <div className="flex gap-3 mt-4">
        {['Uniswap v4', 'LI.FI', 'ENS', 'Claude AI'].map((t) => (
          <span key={t} className="px-4 py-1.5 rounded-full text-sm border border-violet-500/30 bg-violet-500/10 text-violet-300">
            {t}
          </span>
        ))}
      </div>
      <p className="text-gray-600 text-sm mt-8">EthGlobal HackMoney 2026</p>
    </div>
  );
}

function ProblemSlide() {
  return (
    <div className="flex flex-col justify-center h-full gap-10 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
        <AlertTriangle className="w-5 h-5" />
        The Problem
      </div>
      <h2 className="text-5xl font-bold text-white leading-tight">
        DeFi users are <span className="text-red-400">exposed</span>
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-3">
          <Eye className="w-8 h-8 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Intent Leakage</h3>
          <p className="text-sm text-gray-400 leading-relaxed">On-chain transactions reveal trading intent to everyone — bots, competitors, adversaries</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-3">
          <Zap className="w-8 h-8 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">MEV Extraction</h3>
          <p className="text-sm text-gray-400 leading-relaxed">$1.38B+ extracted from users via front-running and sandwich attacks in 2024</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-3">
          <Layers className="w-8 h-8 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Complexity</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Managing positions across chains requires multiple apps, bridges, and manual coordination</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-3">
          <Users className="w-8 h-8 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">No Strategy Sharing</h3>
          <p className="text-sm text-gray-400 leading-relaxed">DeFi strategies live in Discord servers and Twitter threads — no decentralized standard</p>
        </div>
      </div>
    </div>
  );
}

function SolutionSlide() {
  return (
    <div className="flex flex-col justify-center h-full gap-10 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-violet-500/10 text-violet-400 border border-violet-500/20 w-fit">
        <Zap className="w-5 h-5" />
        The Solution
      </div>
      <h2 className="text-5xl font-bold text-white leading-tight">
        Describe intent. <span className="text-violet-400">We handle privacy.</span>
      </h2>
      <div className="bg-gray-900/60 border border-violet-500/20 rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <div className="bg-violet-600/20 border border-violet-500/30 rounded-2xl rounded-tl-sm px-5 py-3 flex-1">
            <p className="text-white text-lg">&quot;Swap 5 ETH for USDC on Base with maximum privacy&quot;</p>
          </div>
        </div>
        <div className="flex items-center gap-3 pl-14">
          <ArrowRight className="w-5 h-5 text-violet-400" />
          <span className="text-gray-400">AI parses, analyzes, optimizes</span>
          <ArrowRight className="w-5 h-5 text-violet-400" />
        </div>
        <div className="grid grid-cols-3 gap-4 pl-14">
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
            <p className="text-xs font-medium text-violet-400 mb-1">Intent Parsed</p>
            <p className="text-sm text-white">SWAP - 5 ETH to USDC on Base</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-xs font-medium text-green-400 mb-1">Privacy Score</p>
            <p className="text-sm text-white">82/100 - 3 risks mitigated</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-400 mb-1">Execution Plan</p>
            <p className="text-sm text-white">Split into 4 chunks + delays</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorksSlide() {
  return (
    <div className="flex flex-col justify-center h-full gap-8 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
        <Brain className="w-5 h-5" />
        How It Works
      </div>
      <h2 className="text-4xl font-bold text-white">Three-stage AI pipeline</h2>
      <div className="flex items-stretch gap-4">
        <div className="flex-1 bg-violet-500/10 border border-violet-500/20 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="text-violet-400 text-sm font-mono">Step 1</span>
          <h3 className="text-xl font-semibold text-white">Parse Intent</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Claude AI with tool use converts natural language into structured DeFi intent with confidence scoring</p>
        </div>
        <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-amber-400 text-sm font-mono">Step 2</span>
          <h3 className="text-xl font-semibold text-white">Analyze Privacy</h3>
          <p className="text-sm text-gray-400 leading-relaxed">AI evaluates MEV exposure, front-running risk, sandwich vulnerability, info leakage, and timing analysis</p>
        </div>
        <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-green-400 text-sm font-mono">Step 3</span>
          <h3 className="text-xl font-semibold text-white">Optimize Strategy</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Generates execution plan with privacy mitigations: order splitting, time delays, cross-chain obfuscation</p>
        </div>
      </div>
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex items-center gap-6">
        <Lock className="w-6 h-6 text-violet-400 flex-shrink-0" />
        <p className="text-sm text-gray-400">
          <span className="text-white font-medium">Server-side AI, client-side execution.</span>{' '}
          API key stays on the server. All transactions are signed client-side via your wallet — we never touch your keys.
        </p>
      </div>
    </div>
  );
}

function PrivacySlide() {
  return (
    <div className="flex flex-col justify-center h-full gap-8 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-green-500/10 text-green-400 border border-green-500/20 w-fit">
        <EyeOff className="w-5 h-5" />
        Privacy Strategies
      </div>
      <h2 className="text-4xl font-bold text-white">Progressive privacy tiers</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-6 bg-gray-500/5 border border-gray-500/20 rounded-xl p-5">
          <div className="w-12 h-12 rounded-lg bg-gray-500/20 flex items-center justify-center text-gray-400 flex-shrink-0">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">Standard</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">Score: 20/100</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">Single transaction, direct execution</p>
            <p className="text-xs text-gray-500 mt-0.5">Fast but fully transparent on-chain</p>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Split className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">Split Order</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Score: 55/100</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">Random-sized chunks hide true trade size</p>
            <p className="text-xs text-gray-500 mt-0.5">Defeats size-based MEV targeting</p>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
          <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">Time-Delayed</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Score: 70/100</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">Split + random 30-120s delays between chunks</p>
            <p className="text-xs text-gray-500 mt-0.5">Prevents timing correlation analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-violet-500/5 border border-violet-500/20 rounded-xl p-5">
          <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
            <GitBranch className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">Cross-Chain Obfuscated</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400">Score: 90/100</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">Route through intermediate chain via LI.FI</p>
            <p className="text-xs text-gray-500 mt-0.5">Breaks on-chain traceability across chains</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureSlide() {
  return (
    <div className="flex flex-col justify-center h-full gap-8 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
        <Layers className="w-5 h-5" />
        Architecture
      </div>
      <h2 className="text-4xl font-bold text-white">Built on production protocols</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Input Layer</p>
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div><p className="text-sm font-medium text-white">Natural Language</p><p className="text-xs text-gray-500">Chat interface</p></div>
          </div>
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div><p className="text-sm font-medium text-white">Claude AI</p><p className="text-xs text-gray-500">Sonnet - Tool Use</p></div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Processing</p>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div><p className="text-sm font-medium text-white">Intent Parser</p><p className="text-xs text-gray-500">Structured JSON output</p></div>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div><p className="text-sm font-medium text-white">Privacy Analyzer</p><p className="text-xs text-gray-500">Risk scoring 0-100</p></div>
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div><p className="text-sm font-medium text-white">Strategy Optimizer</p><p className="text-xs text-gray-500">Execution planning</p></div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Execution Layer</p>
          <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div><p className="text-sm font-medium text-white">Uniswap v4</p><p className="text-xs text-gray-500">Same-chain swaps + LP</p></div>
          </div>
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div><p className="text-sm font-medium text-white">LI.FI SDK</p><p className="text-xs text-gray-500">Cross-chain bridging</p></div>
          </div>
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div><p className="text-sm font-medium text-white">ENS</p><p className="text-xs text-gray-500">Identity + strategy records</p></div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-center text-xs text-gray-500">
        <span className="px-3 py-1 border border-gray-800 rounded-full">Base</span>
        <span className="px-3 py-1 border border-gray-800 rounded-full">Arbitrum</span>
        <span className="px-3 py-1 border border-gray-800 rounded-full">Ethereum</span>
        <span className="px-3 py-1 border border-gray-800 rounded-full">+ any LI.FI chain</span>
      </div>
    </div>
  );
}

function ENSSlide() {
  return (
    <div className="flex flex-col justify-center h-full gap-8 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
        <BookOpen className="w-5 h-5" />
        ENS Innovation
      </div>
      <h2 className="text-4xl font-bold text-white">
        ENS as a <span className="text-indigo-400">decentralized strategy marketplace</span>
      </h2>
      <p className="text-lg text-gray-400">
        Beyond identity — we use ENS text records to publish, discover, and import DeFi strategies.
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-indigo-400" /> Publish
          </h3>
          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm space-y-1">
            <p className="text-gray-500">{"// ENS text record"}</p>
            <p><span className="text-indigo-400">key:</span> <span className="text-green-400">&quot;com.whisperfi.strategy.privacy-max&quot;</span></p>
            <p><span className="text-indigo-400">value:</span> <span className="text-amber-300">{"{"}</span></p>
            <p className="pl-4"><span className="text-gray-400">&quot;privacyLevel&quot;: &quot;maximum&quot;,</span></p>
            <p className="pl-4"><span className="text-gray-400">&quot;splitCount&quot;: 5,</span></p>
            <p className="pl-4"><span className="text-gray-400">&quot;delayRange&quot;: [30, 120]</span></p>
            <p><span className="text-amber-300">{"}"}</span></p>
          </div>
        </div>
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Browse
          </h3>
          <p className="text-sm text-gray-400">
            Look up any <span className="text-white">.eth</span> name to discover their published strategies
          </p>
          <div className="space-y-2">
            {['vitalik.eth', 'aave.eth', 'bpan99.eth'].map((name) => (
              <div key={name} className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20" />
                <span className="text-sm text-white">{name}</span>
                <ArrowRight className="w-3 h-3 text-gray-600 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PrizesSlide() {
  return (
    <div className="flex flex-col justify-center h-full gap-8 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
        <Trophy className="w-5 h-5" />
        Prize Alignment
      </div>
      <h2 className="text-4xl font-bold text-white">
        Targeting <span className="text-amber-400">4 tracks</span> simultaneously
      </h2>
      <div className="space-y-4">
        <div className="flex items-start gap-5 bg-pink-500/5 border border-pink-500/20 rounded-xl p-5">
          <div className="text-right flex-shrink-0 w-20">
            <p className="text-xl font-bold text-pink-400">$5,000</p>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">Uniswap — Agentic Finance</h3>
            <p className="text-sm text-gray-400 mt-1">Claude AI parses intent and builds v4 swap transactions via Universal Router</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
        </div>
        <div className="flex items-start gap-5 bg-violet-500/5 border border-violet-500/20 rounded-xl p-5">
          <div className="text-right flex-shrink-0 w-20">
            <p className="text-xl font-bold text-violet-400">$5,000</p>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">Uniswap — Privacy DeFi</h3>
            <p className="text-sm text-gray-400 mt-1">Order splitting, time delays, privacy scoring — all through Uniswap v4</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-1" />
        </div>
        <div className="flex items-start gap-5 bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
          <div className="text-right flex-shrink-0 w-20">
            <p className="text-xl font-bold text-blue-400">$2,000</p>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">LI.FI — AI x Smart App</h3>
            <p className="text-sm text-gray-400 mt-1">AI generates cross-chain-obfuscated routes via LI.FI SDK for privacy bridging</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
        </div>
        <div className="flex items-start gap-5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
          <div className="text-right flex-shrink-0 w-20">
            <p className="text-xl font-bold text-indigo-400">$3,500+</p>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">ENS — Creative DeFi</h3>
            <p className="text-sm text-gray-400 mt-1">ENS text records as decentralized strategy marketplace — publish & discover</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-white">
          Total potential: <span className="text-amber-400">$15,500+</span>
        </p>
      </div>
    </div>
  );
}

function DemoSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-10">
      <div className="w-24 h-24 rounded-3xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
        <Zap className="w-12 h-12 text-violet-400" />
      </div>
      <h2 className="text-5xl font-bold text-white">Live Demo</h2>
      <p className="text-xl text-gray-400 max-w-lg">
        Let&apos;s see WhisperFi in action
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-lg font-medium transition-colors"
      >
        Open WhisperFi
        <ExternalLink className="w-5 h-5" />
      </Link>
      <div className="flex gap-6 text-sm text-gray-500 items-center">
        <span>1. Connect wallet</span>
        <ArrowRight className="w-4 h-4" />
        <span>2. Type intent</span>
        <ArrowRight className="w-4 h-4" />
        <span>3. See privacy plan</span>
      </div>
    </div>
  );
}

function ThanksSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-8">
      <div className="w-24 h-24 rounded-3xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
        <Shield className="w-12 h-12 text-violet-400" />
      </div>
      <h2 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
        Thank You
      </h2>
      <p className="text-xl text-gray-400">
        WhisperFi — Your DeFi, Your Privacy
      </p>
      <div className="flex gap-4 mt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          Try It <ExternalLink className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 font-medium transition-colors"
        >
          Dashboard <BarChart3 className="w-4 h-4" />
        </Link>
      </div>
      <p className="text-sm text-gray-600 mt-8">
        Built by <span className="text-violet-400">bpan99.eth</span>{' '}
        <a href="https://github.com/bpthu123" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-violet-400 transition-colors">github.com/bpthu123</a>{' '}
        | Next.js + Claude AI + Uniswap v4 + LI.FI + ENS
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main presentation                                                  */
/* ------------------------------------------------------------------ */

const SLIDES = [
  { id: 'title', Component: TitleSlide },
  { id: 'problem', Component: ProblemSlide },
  { id: 'solution', Component: SolutionSlide },
  { id: 'how-it-works', Component: HowItWorksSlide },
  { id: 'privacy', Component: PrivacySlide },
  { id: 'architecture', Component: ArchitectureSlide },
  { id: 'ens', Component: ENSSlide },
  { id: 'prizes', Component: PrizesSlide },
  { id: 'demo', Component: DemoSlide },
  { id: 'thanks', Component: ThanksSlide },
];

export default function PitchPage() {
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1)), []);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const { id, Component } = SLIDES[current];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a12] relative select-none">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/[0.08] rounded-full blur-[120px]" />
      </div>

      {/* Slide area */}
      <div className="relative h-full w-full max-w-6xl mx-auto px-16 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Component />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-between px-8">
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'bg-violet-400 w-6' : 'bg-gray-700 hover:bg-gray-600 w-2'
              }`}
            />
          ))}
        </div>

        <span className="text-xs text-gray-600 font-mono">
          {current + 1} / {SLIDES.length}
        </span>

        <div className="flex gap-2">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="w-9 h-9 rounded-lg border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goNext}
            disabled={current === SLIDES.length - 1}
            className="w-9 h-9 rounded-lg border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
