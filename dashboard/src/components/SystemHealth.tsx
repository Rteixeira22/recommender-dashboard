import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Activity } from 'lucide-react';
import { getHealthDetailed, getMetricsSummary, getJobStatus } from '../api';

function StatusDot({ status }: { status: string }) {
  const isHealthy =
    status === 'healthy' || status === 'ok' || status === 'connected';

  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${
          isHealthy ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span
        className={`text-sm font-medium ${
          isHealthy ? 'text-green-700' : 'text-red-700'
        }`}
      >
        {isHealthy ? 'Operacional' : 'Indisponível'}
      </span>
    </span>
  );
}

export function SystemHealth() {
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: getHealthDetailed,
    refetchInterval: 30_000, // Health check a cada 30s
  });

  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: getMetricsSummary,
  });

  const { data: jobStatus } = useQuery({
    queryKey: ['job-status'],
    queryFn: getJobStatus,
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <Activity className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Estado do Sistema</h2>
      </div>

      <div className="p-4 space-y-3">
        {/* Status dos componentes */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Serviço</span>
          {health ? (
            <StatusDot status={health.status} />
          ) : (
            <span className="text-sm text-gray-400">A verificar...</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Base de Dados</span>
          {health ? (
            <StatusDot status={health.components.database.status} />
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Providers</span>
          {health ? (
            <StatusDot status={health.components.providers.status} />
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Teste A/B</span>
          {health ? (
            <StatusDot status={health.components.abTesting.status} />
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>

        {/* Separador */}
        <div className="border-t border-gray-100 pt-3 mt-3" />

        {/* Informações de métricas */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Última Agregação</span>
          <span className="text-sm font-medium text-gray-900">
            {summary?.latestComputation
              ? formatDistanceToNow(new Date(summary.latestComputation), {
                  addSuffix: true,
                  locale: pt,
                })
              : 'Nunca'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Métricas Armazenadas</span>
          <span className="text-sm font-medium text-gray-900">
            {summary?.totalMetrics?.toLocaleString('pt-PT') ?? '0'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Métricas Únicas</span>
          <span className="text-sm font-medium text-gray-900">
            {summary?.uniqueMetricNames ?? '0'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Job de Agregação</span>
          {jobStatus ? (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                jobStatus.isRunning
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {jobStatus.isRunning ? 'A correr' : 'Inativo'}
            </span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>

        {health?.config && (
          <>
            <div className="border-t border-gray-100 pt-3 mt-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ambiente</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {health.config.environment}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Experiência</span>
              <span className="text-sm font-medium text-gray-900">
                {health.config.experimentName}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
