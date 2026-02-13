import { Server, AlertCircle } from 'lucide-react';
import type { Environment } from '../hooks/useAuth';

interface EnvironmentBadgeProps {
  environment: Environment;
  apiUrl: string;
}

const ENV_STYLES: Record<Environment, {
  bg: string;
  text: string;
  border: string;
  label: string;
  icon: string;
}> = {
  dev: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    label: 'Desenvolvimento',
    icon: 'text-blue-500',
  },
  staging: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    label: 'Staging',
    icon: 'text-amber-500',
  },
  production: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-400',
    label: 'Produção',
    icon: 'text-red-600',
  },
  custom: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-300',
    label: 'Personalizado',
    icon: 'text-purple-500',
  },
};

export function EnvironmentBadge({ environment, apiUrl }: EnvironmentBadgeProps) {
  const style = ENV_STYLES[environment];
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${style.bg} ${style.border}`}>
      {environment === 'production' ? (
        <AlertCircle className={`w-4 h-4 ${style.icon} animate-pulse`} />
      ) : (
        <Server className={`w-4 h-4 ${style.icon}`} />
      )}
      <div className="flex flex-col">
        <span className={`text-xs font-bold uppercase tracking-wide ${style.text}`}>
          {style.label}
        </span>
        <span className={`text-[10px] ${style.text} opacity-70 truncate max-w-[200px]`} title={apiUrl}>
          {apiUrl}
        </span>
      </div>
    </div>
  );
}
