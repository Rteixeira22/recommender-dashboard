import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { OverviewCards } from './components/OverviewCards';
import { ComparisonTable } from './components/ComparisonTable';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { ConversionFunnel } from './components/ConversionFunnel';
import { ScenarioBreakdown } from './components/ScenarioBreakdown';
import { SystemHealth } from './components/SystemHealth';
import { AdminActions } from './components/AdminActions';
import type { PeriodOption } from './types';
import { KeyRound } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Dashboard() {
  const { token, setToken, isAuthenticated } = useAuth();
  const [period, setPeriod] = useState<PeriodOption>('7');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        token={token}
        onTokenChange={setToken}
        period={period}
        onPeriodChange={setPeriod}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!isAuthenticated ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <KeyRound className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Autenticação Necessária
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Introduza o token de administrador no campo acima para aceder ao
              dashboard de análise A/B do sistema de recomendações.
            </p>
          </div>
        ) : (
          <>
            <OverviewCards period={period} />
            <ComparisonTable period={period} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TimeSeriesChart period={period} />
              <ConversionFunnel period={period} />
            </div>

            <ScenarioBreakdown period={period} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemHealth />
              <AdminActions />
            </div>
          </>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-gray-400">
        Ser+ Digital · Universidade de Aveiro · Mestrado em Comunicação e Tecnologias Web
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
