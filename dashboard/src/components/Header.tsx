import { RefreshCw, KeyRound, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { PERIOD_OPTIONS } from '../constants';
import { EnvironmentBadge } from './EnvironmentBadge';
import { ApiSelector } from './Apiselector';
import type { PeriodOption, Environment } from '../types';

interface HeaderProps {
  token: string;
  onTokenChange: (token: string) => void;
  period: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  apiUrl: string;
  onApiUrlChange: (url: string) => void;
  environment: Environment;
}

export function Header({ 
  token, 
  onTokenChange, 
  period, 
  onPeriodChange,
  apiUrl,
  onApiUrlChange,
  environment,
}: HeaderProps) {
  const queryClient = useQueryClient();

  const handleApiUrlChange = (newUrl: string) => {
    onApiUrlChange(newUrl);
    // Invalidar todas as queries quando mudar a API
    queryClient.invalidateQueries();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2">
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <img
              src="/sermais.png"
              alt="Ser+ Digital"
              className="w-16 h-16 rounded-xl object-contain"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Análise A/B
              </h1>
              <p className="text-xs text-gray-500">
                Sistema de Recomendações
              </p>
            </div>
          </div>

          {/* Controlos */}
          <div className="flex items-center gap-3">
            {/* Indicador de Ambiente */}
            <EnvironmentBadge environment={environment} apiUrl={apiUrl} />

            {/* API Selector com Dropdown */}
            <ApiSelector 
              apiUrl={apiUrl}
              onApiUrlChange={handleApiUrlChange}
            />

            {/* Período */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value as PeriodOption)}
                className="text-sm text-gray-700 bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer"
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Token */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
              <KeyRound className="w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={token}
                onChange={(e) => onTokenChange(e.target.value)}
                placeholder="Token admin..."
                className="text-sm text-gray-700 bg-transparent border-0 focus:ring-0 focus:outline-none w-48 placeholder:text-gray-400"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={() => queryClient.invalidateQueries()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Atualizar dados"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
