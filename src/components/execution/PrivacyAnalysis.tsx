'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { PrivacyAnalysis } from '@/types/privacy';

interface PrivacyAnalysisProps {
  analysis: PrivacyAnalysis;
}

const severityColors: Record<string, string> = {
  low: 'bg-green-500/10 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const categoryIcons: Record<string, string> = {
  MEV: '🤖',
  FRONT_RUNNING: '🏃',
  SANDWICH: '🥪',
  INFO_LEAKAGE: '🔍',
  TIMING: '⏱️',
};

export function PrivacyAnalysisCard({ analysis }: PrivacyAnalysisProps) {
  const scoreColor =
    analysis.overallScore >= 70
      ? 'text-green-400'
      : analysis.overallScore >= 40
        ? 'text-yellow-400'
        : 'text-red-400';

  const progressColor =
    analysis.overallScore >= 70
      ? '[&>div]:bg-green-500'
      : analysis.overallScore >= 40
        ? '[&>div]:bg-yellow-500'
        : '[&>div]:bg-red-500';

  return (
    <Card className="bg-gray-900/50 border-violet-900/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white">Privacy Analysis</span>
        </div>
        <span className={`text-2xl font-bold ${scoreColor}`}>
          {analysis.overallScore}
          <span className="text-sm text-gray-500">/100</span>
        </span>
      </div>

      <Progress value={analysis.overallScore} className={`h-2 bg-gray-800 ${progressColor}`} />

      {/* Risk Badges */}
      {analysis.risks.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-gray-400 font-medium">Identified Risks</span>
          <div className="flex flex-wrap gap-1.5">
            {analysis.risks.map((risk, i) => (
              <Badge
                key={i}
                variant="outline"
                className={`text-xs ${severityColors[risk.severity]}`}
              >
                {categoryIcons[risk.category]} {risk.category.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Exposure Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs font-medium text-red-400">Standard</span>
          </div>
          <p className="text-xs text-gray-400">{analysis.standardExposure}</p>
        </div>
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle2 className="w-3 h-3 text-green-400" />
            <span className="text-xs font-medium text-green-400">Optimized</span>
          </div>
          <p className="text-xs text-gray-400">{analysis.optimizedExposure}</p>
        </div>
      </div>

      {/* Improvement */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Info className="w-3 h-3" />
        <span>
          Privacy improved by{' '}
          <span className="text-green-400 font-medium">{analysis.improvementPercentage}%</span>{' '}
          with optimized strategy
        </span>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-medium">Recommendations</span>
          {analysis.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-violet-400 mt-0.5">•</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
