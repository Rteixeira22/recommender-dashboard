import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calculator,
  CalendarDays,
  Eraser,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { triggerAggregation, clearCache, triggerCleanup } from '../api';

interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}

export function AdminActions() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const showFeedback = (msg: FeedbackMessage) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const aggregateHourly = useMutation({
    mutationFn: () => triggerAggregation('hourly'),
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      showFeedback({
        type: 'success',
        text: `Agregação horária concluída: ${data.metricsStored} métricas armazenadas`,
      });
    },
    onError: () => {
      showFeedback({ type: 'error', text: 'Erro ao executar agregação horária' });
    },
  });

  const aggregateDaily = useMutation({
    mutationFn: () => triggerAggregation('daily'),
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      showFeedback({
        type: 'success',
        text: `Agregação diária concluída: ${data.metricsStored} métricas armazenadas`,
      });
    },
    onError: () => {
      showFeedback({ type: 'error', text: 'Erro ao executar agregação diária' });
    },
  });

  const clearCacheMutation = useMutation({
    mutationFn: clearCache,
    onSuccess: () => {
      showFeedback({ type: 'success', text: 'Cache de recomendações limpo com sucesso' });
    },
    onError: () => {
      showFeedback({ type: 'error', text: 'Erro ao limpar cache' });
    },
  });

  const cleanupMutation = useMutation({
    mutationFn: triggerCleanup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      showFeedback({
        type: 'success',
        text: `Limpeza concluída: ${data.deletedCount} registos removidos`,
      });
    },
    onError: () => {
      showFeedback({ type: 'error', text: 'Erro ao executar limpeza' });
    },
  });

  const isAnyLoading =
    aggregateHourly.isPending ||
    aggregateDaily.isPending ||
    clearCacheMutation.isPending ||
    cleanupMutation.isPending;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Ações de Administração
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Agregação */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Agregação de Métricas</p>
          <div className="flex gap-2">
            <button
              onClick={() => aggregateHourly.mutate()}
              disabled={isAnyLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aggregateHourly.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calculator className="w-4 h-4" />
              )}
              Agregar (Horário)
            </button>
            <button
              onClick={() => aggregateDaily.mutate()}
              disabled={isAnyLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aggregateDaily.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CalendarDays className="w-4 h-4" />
              )}
              Agregar (Diário)
            </button>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-100" />

        {/* Cache */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Cache de Recomendações</p>
          <button
            onClick={() => clearCacheMutation.mutate()}
            disabled={isAnyLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {clearCacheMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eraser className="w-4 h-4" />
            )}
            Limpar Cache
          </button>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-100" />

        {/* Cleanup */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Limpeza de Dados Antigos</p>
          <button
            onClick={() => cleanupMutation.mutate()}
            disabled={isAnyLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cleanupMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Executar Limpeza
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`flex items-center gap-2 mt-3 px-3 py-2 rounded-lg text-sm ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
}
