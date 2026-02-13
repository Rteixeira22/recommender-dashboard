import { useQuery } from '@tanstack/react-query';
import { getMetricsComparison } from '../api';
import { FUNNEL_METRICS } from '../constants';
import type { PeriodOption, ABMetricComparison } from '../types';

interface ConversionFunnelProps {
  period: PeriodOption;
}

function FunnelBar({
  label,
  valueA,
  valueB,
}: {
  label: string;
  valueA: number;
  valueB: number;
}) {
  const maxVal = Math.max(valueA, valueB, 1);
  const widthA = Math.max((valueA / maxVal) * 100, 2);
  const widthB = Math.max((valueB / maxVal) * 100, 2);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-orange-600 w-8 text-right font-medium">A</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="bg-orange-500 h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${widthA}%` }}
            >
              {valueA > 0 && (
                <span className="text-[10px] font-bold text-white">
                  {valueA.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-cyan-600 w-8 text-right font-medium">B</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="bg-cyan-500 h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${widthB}%` }}
            >
              {valueB > 0 && (
                <span className="text-[10px] font-bold text-white">
                  {valueB.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConversionFunnel({ period }: ConversionFunnelProps) {
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
        <p className="text-sm text-red-500">Erro ao carregar funil de conversão</p>
      </div>
    );
  }

  const comparisonMap = new Map<string, ABMetricComparison>(
    data.comparison.map((c) => [c.metricName, c])
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Funil de Conversão</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Comparação das taxas de conversão entre grupos
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Grupo A (Recombee)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span>Grupo B (Baseline)</span>
          </div>
        </div>

        {FUNNEL_METRICS.map((step) => {
          const metric = comparisonMap.get(step.key);
          return (
            <FunnelBar
              key={step.key}
              label={step.label}
              valueA={metric?.groupA ?? 0}
              valueB={metric?.groupB ?? 0}
            />
          );
        })}

        {data.comparison.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-4">
            Sem dados de funil. Execute uma agregação de métricas primeiro.
          </div>
        )}
      </div>
    </div>
  );
}
