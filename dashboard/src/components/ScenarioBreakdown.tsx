import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getMetricsAggregated } from '../api';
import { SCENARIO_LABELS } from '../constants';
import type { PeriodOption } from '../types';

interface ScenarioBreakdownProps {
  period: PeriodOption;
}

export function ScenarioBreakdown({ period: _period }: ScenarioBreakdownProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['aggregated', 'ctr_by_scenario'],
    queryFn: () => getMetricsAggregated({ metricName: 'ctr_by_scenario' }),
  });

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Agrupar por cenário
    const scenarioMap = new Map<
      string,
      { scenario: string; groupA: number; groupB: number }
    >();

    data.forEach((entry) => {
      if (!entry.scenarioCode) return;

      const label =
        SCENARIO_LABELS[entry.scenarioCode] || entry.scenarioCode;

      if (!scenarioMap.has(entry.scenarioCode)) {
        scenarioMap.set(entry.scenarioCode, {
          scenario: label,
          groupA: 0,
          groupB: 0,
        });
      }

      const item = scenarioMap.get(entry.scenarioCode)!;
      if (entry.groupCode === 'A') {
        item.groupA = entry.metricValue;
      } else if (entry.groupCode === 'B') {
        item.groupB = entry.metricValue;
      }
    });

    return Array.from(scenarioMap.values());
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse h-80" />
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-red-500">Erro ao carregar dados por cenário</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">CTR por Cenário</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Taxa de clique por contexto de recomendação
        </p>
      </div>

      <div className="p-4">
        {chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-sm text-gray-500">
            Sem dados por cenário. Execute uma agregação de métricas primeiro.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="scenario"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`]}
              />
              <Legend
                wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
              />
              <Bar
                dataKey="groupA"
                name="Grupo A (Recombee)"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="groupB"
                name="Grupo B (Baseline)"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
