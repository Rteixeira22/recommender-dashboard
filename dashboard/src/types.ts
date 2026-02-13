// === API response wrappers ===

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  count?: number;
}

// === Metrics Cache entry (from GET /admin/metrics/aggregated) ===

export interface MetricsCacheEntry {
  id: string;
  metricName: string;
  metricValue: number;
  groupCode: string | null;
  scenarioCode: string | null;
  modelUsed: string | null;
  periodStart: string;
  periodEnd: string;
  computedAt: string;
  metadata: Record<string, unknown> | null;
}

// === A/B Comparison (from GET /admin/metrics/comparison) ===

export interface ABMetricComparison {
  metricName: string;
  groupA: number;
  groupB: number;
  difference: number;
  percentDifference: number;
  winner: 'A' | 'B' | 'tie';
}

export interface ComparisonResponse {
  period: {
    start: string;
    end: string;
    days: number;
  };
  comparison: ABMetricComparison[];
}

// === Metrics Summary (from GET /admin/metrics/summary) ===

export interface MetricsSummary {
  totalMetrics: number;
  uniqueMetricNames: number;
  latestComputation: string | null;
  oldestPeriod: string | null;
}

// === Stats / A/B Distribution (from GET /stats) ===

export interface ABStats {
  experiment: string;
  statistics: {
    totalUsers: number;
    distribution: {
      groupCode: string;
      count: number;
      percentage: number;
    }[];
  };
  validation: {
    isBalanced: boolean;
    deviation: number;
  };
  timestamp: string;
}

// === Health (from GET /health/detailed) ===

export interface DetailedHealth {
  status: 'healthy' | 'unhealthy';
  service: string;
  timestamp: string;
  components: {
    database: { status: string };
    providers: { status: string; details: Record<string, unknown> };
    abTesting: { status: string };
  };
  config: {
    environment: string;
    experimentName: string;
  };
}

// === Job Status (from GET /admin/metrics/job-status) ===

export interface JobStatus {
  isRunning: boolean;
  enabled: boolean;
  config: {
    hourlyIntervalMinutes: number;
    dailyIntervalHours: number;
    retentionDays: number;
    enabled: boolean;
  };
}

// === Aggregation trigger response ===

export interface AggregationResult {
  type: string;
  metricsStored: number;
}

// === Period selection ===

export type PeriodOption = '1' | '7' | '14' | '30';

// === Environment detection ===

export type Environment = 'dev' | 'staging' | 'production' | 'custom';