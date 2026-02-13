import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { getMetricsHistory } from '../api';
import { TIME_SERIES_METRICS, METRIC_LABELS, formatMetricValue } from '../constants';
import type { PeriodOption } from '../types';

interface TimeSeriesChartProps {
  period: PeriodOption;
}

export function TimeSeriesChart({ period }: TimeSeriesChartProps) {
  const [selectedMetric, setSelectedMetric] = useState('ctr');

  const limit = Number(period) <= 1 ? 24 : Number(period) * 4;

  const { data: historyA, isLoading: loadingA } = useQuery({
    queryKey: ['history', selectedMetric, 'A', period],
    queryFn: () =>
      getMetricsHistory(selectedMetric, { groupCode: 'A', limit }),
  });

  const { data: historyB, isLoading: loadingB } = useQuery({
    queryKey: ['history', selectedMetric, 'B', period],
    queryFn: () =>
      getMetricsHistory(selectedMetric, { groupCode: 'B', limit }),
  });

  const isLoading = loadingA || loadingB;

  // Fundir dados dos dois grupos por data
  const chartData = useMemo(() => {
    if (!historyA && !historyB) return [];

    const dateMap = new Map<string, { date: string; groupA: number; groupB: number }>();

    const formatDate = (dateStr: string) => {
      try {
        return format(new Date(dateStr), 'dd MMM HH:mm', { locale: pt });
      } catch {
        return dateStr;
      }
    };

    // Processar Grupo A
    (historyA || []).forEach((entry) => {
      const key = entry.periodEnd;
      const formatted = formatDate(key);
      dateMap.set(key, {
        date: formatted,
        groupA: entry.metricValue,
        groupB: 0,
      });
    });

    // Processar Grupo B
    (historyB || []).forEach((entry) => {
      const key = entry.periodEnd;
      const formatted = formatDate(key);
      const existing = dateMap.get(key);
      if (existing) {
        existing.groupB = entry.metricValue;
      } else {
        dateMap.set(key, {
          date: formatted,
          groupA: 0,
          groupB: entry.metricValue,
        });
      }
    });

    // Ordenar por data
    return Array.from(dateMap.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([, v]) => v);
  }, [historyA, historyB]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Evolução Temporal</h2>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {TIME_SERIES_METRICS.map((m) => (
            <option key={m} value={m}>
              {METRIC_LABELS[m] || m}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-sm text-gray-500">
            A carregar dados...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-sm text-gray-500">
            Sem dados históricos. Execute uma agregação de métricas primeiro.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [
                  formatMetricValue(value, selectedMetric),
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
              />
              <Line
                type="monotone"
                dataKey="groupA"
                name="Grupo A (Recombee)"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f97316' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="groupB"
                name="Grupo B (Baseline)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 3, fill: '#06b6d4' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
