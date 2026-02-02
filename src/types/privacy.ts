export type RiskCategory = 'MEV' | 'FRONT_RUNNING' | 'SANDWICH' | 'INFO_LEAKAGE' | 'TIMING';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface PrivacyRisk {
  category: RiskCategory;
  severity: RiskSeverity;
  description: string;
  mitigation: string;
}

export interface PrivacyAnalysis {
  overallScore: number; // 0-100, higher = more private
  risks: PrivacyRisk[];
  recommendations: string[];
  standardExposure: string;
  optimizedExposure: string;
  improvementPercentage: number;
}
