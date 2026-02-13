import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Users,
  MousePointerClick,
  TrendingUp,
  FlaskConical,
  Scale,
} from 'lucide-react';
import { getStats, getMetricsComparison } from '../api';
import type { PeriodOption } from '../types';

interface OverviewCardsProps {
  period: PeriodOption;
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  isLoading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse h-24" />
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
          <p className="text-xs text-gray-500 truncate">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function OverviewCards({ period }: OverviewCardsProps) {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });

  const { data: comparison, isLoading: compLoading } = useQuery({
    queryKey: ['comparison', period],
    queryFn: () => getMetricsComparison(Number(period)),
  });

  const isLoading = statsLoading || compLoading;

  const totalUsers = stats?.statistics?.totalUsers ?? 0;
  const groupADist = stats?.statistics?.distribution?.find((d) => d.groupCode === 'A');
  const groupBDist = stats?.statistics?.distribution?.find((d) => d.groupCode === 'B');

  const ctr = comparison?.comparison?.find((c) => c.metricName === 'ctr');
  const convRate = comparison?.comparison?.find(
    (c) => c.metricName === 'conversion_rate'
  );
  const totalRecs = comparison?.comparison?.find(
    (c) => c.metricName === 'ctr'
  );

  // Calcular CTR global (média ponderada simplificada)
  const globalCtr = ctr
    ? ((ctr.groupA + ctr.groupB) / 2).toFixed(2)
    : '0.00';
  const globalConv = convRate
    ? ((convRate.groupA + convRate.groupB) / 2).toFixed(2)
    : '0.00';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        icon={Users}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        value={totalUsers.toLocaleString('pt-PT')}
        label="Utilizadores Totais"
        isLoading={isLoading}
      />
      <StatCard
        icon={MousePointerClick}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        value={`${globalCtr}%`}
        label="CTR Global"
        isLoading={isLoading}
      />
      <StatCard
        icon={TrendingUp}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        value={`${globalConv}%`}
        label="Taxa de Conversão"
        isLoading={isLoading}
      />
      <StatCard
        icon={BarChart3}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
        value={
          totalRecs
            ? ((totalRecs.groupA + totalRecs.groupB) / 2).toLocaleString('pt-PT', {
                maximumFractionDigits: 0,
              })
            : '0'
        }
        label="Desvio Validação"
        isLoading={isLoading}
      />
      <StatCard
        icon={FlaskConical}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
        value={
          groupADist
            ? `${groupADist.count} (${groupADist.percentage?.toFixed(1) ?? 50}%)`
            : '0'
        }
        label="Grupo A · Recombee"
        isLoading={isLoading}
      />
      <StatCard
        icon={Scale}
        iconBg="bg-cyan-50"
        iconColor="text-cyan-600"
        value={
          groupBDist
            ? `${groupBDist.count} (${groupBDist.percentage?.toFixed(1) ?? 50}%)`
            : '0'
        }
        label="Grupo B · Baseline"
        isLoading={isLoading}
      />
    </div>
  );
}
