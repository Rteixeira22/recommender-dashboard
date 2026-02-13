import { useQuery } from '@tanstack/react-query';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { getMetricsComparison } from '../api';
import {
  METRIC_LABELS,
  COMPARISON_METRICS,
  LOWER_IS_BETTER,
  formatMetricValue,
} from '../constants';
import type { PeriodOption, ABMetricComparison } from '../types';

interface ComparisonTableProps {
  period: PeriodOption;
}

function WinnerBadge({ winner }: { winner: 'A' | 'B' | 'tie' }) {
  if (winner === 'tie') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <Minus className="w-3 h-3" />
        Empate
      </span>
    );
  }

  if (winner === 'A') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        Grupo A
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
      Grupo B
    </span>
  );
}

function DifferenceCell({ comparison }: { comparison: ABMetricComparison }) {
  const { difference, percentDifference, metricName } = comparison;
  const isLowerBetter = LOWER_IS_BETTER.includes(metricName);

  // Determinar se a diferença é positiva (bom para Grupo A)
  const isPositive = isLowerBetter ? difference < 0 : difference > 0;
  const isNeutral = Math.abs(percentDifference) < 1;

  if (isNeutral) {
    return (
      <span className="text-gray-400 text-sm">
        ~0%
      </span>
    );
  }

  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  const Icon = difference > 0 ? ArrowUp : ArrowDown;

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${colorClass}`}>
      <Icon className="w-3.5 h-3.5" />
      {Math.abs(percentDifference).toFixed(1)}%
    </span>
  );
}

export function ComparisonTable({ period }: ComparisonTableProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['comparison', period],
    queryFn: () => getMetricsComparison(Number(period)),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse h-72" />
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-red-500">Erro ao carregar comparação A/B</p>
      </div>
    );
  }

  // Filtrar apenas as métricas de comparação definidas
  const metrics = COMPARISON_METRICS.map((name) =>
    data.comparison.find((c) => c.metricName === name)
  ).filter(Boolean) as ABMetricComparison[];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Comparação A/B</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Período: {data.period.days} dia{data.period.days > 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                Métrica
              </th>
              <th className="text-right text-xs font-medium text-orange-600 uppercase tracking-wider px-4 py-3">
                Grupo A (Recombee)
              </th>
              <th className="text-right text-xs font-medium text-cyan-600 uppercase tracking-wider px-4 py-3">
                Grupo B (Baseline)
              </th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                Diferença
              </th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                Vencedor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {metrics.map((m) => (
              <tr key={m.metricName} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {METRIC_LABELS[m.metricName] || m.metricName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                  {formatMetricValue(m.groupA, m.metricName)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                  {formatMetricValue(m.groupB, m.metricName)}
                </td>
                <td className="px-4 py-3 text-center">
                  <DifferenceCell comparison={m} />
                </td>
                <td className="px-4 py-3 text-center">
                  <WinnerBadge winner={m.winner} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {metrics.length === 0 && (
        <div className="p-8 text-center text-sm text-gray-500">
          Sem dados de comparação. Execute uma agregação de métricas primeiro.
        </div>
      )}
    </div>
  );
}
