import axios from 'axios';
import type {
  ApiResponse,
  MetricsCacheEntry,
  ComparisonResponse,
  MetricsSummary,
  ABStats,
  DetailedHealth,
  JobStatus,
  AggregationResult,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar Bearer token do localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('recommender_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === Endpoints públicos ===

export const getHealthDetailed = () =>
  api.get<DetailedHealth>('/health/detailed').then((r) => r.data);

// === Endpoints autenticados ===

export const getStats = () =>
  api.get<ApiResponse<ABStats>>('/stats').then((r) => r.data.data);

// === Endpoints admin ===

export const getMetricsAggregated = (params?: {
  metricName?: string;
  groupCode?: string;
  scenarioCode?: string;
}) =>
  api
    .get<ApiResponse<MetricsCacheEntry[]>>('/admin/metrics/aggregated', { params })
    .then((r) => r.data.data);

export const getMetricsSummary = () =>
  api.get<ApiResponse<MetricsSummary>>('/admin/metrics/summary').then((r) => r.data.data);

export const getMetricsComparison = (days: number) =>
  api
    .get<ApiResponse<ComparisonResponse>>('/admin/metrics/comparison', {
      params: { days },
    })
    .then((r) => r.data.data);

export const getMetricsHistory = (
  metricName: string,
  params?: { groupCode?: string; scenarioCode?: string; limit?: number }
) =>
  api
    .get<ApiResponse<MetricsCacheEntry[]>>(`/admin/metrics/history/${metricName}`, {
      params,
    })
    .then((r) => r.data.data);

export const triggerAggregation = (type: 'hourly' | 'daily' = 'hourly') =>
  api
    .post<ApiResponse<AggregationResult>>('/admin/metrics/aggregate', { type })
    .then((r) => r.data.data);

export const getJobStatus = () =>
  api.get<ApiResponse<JobStatus>>('/admin/metrics/job-status').then((r) => r.data.data);

export const triggerCleanup = () =>
  api
    .post<ApiResponse<{ deletedCount: number }>>('/admin/metrics/cleanup')
    .then((r) => r.data.data);

export const clearCache = () =>
  api.post('/admin/cache/clear').then((r) => r.data);
