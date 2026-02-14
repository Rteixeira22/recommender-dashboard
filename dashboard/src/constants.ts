export const METRIC_LABELS: Record<string, string> = {
  ctr: 'Taxa de Clique (CTR)',
  ctr_by_scenario: 'CTR por Cenário',
  conversion_rate: 'Taxa de Conversão',
  view_to_click_rate: 'Vista \u2192 Clique',
  click_to_enroll_rate: 'Clique \u2192 Inscrição',
  enroll_to_complete_rate: 'Inscrição \u2192 Conclusão',
  total_recommendations: 'Total de Recomendações',
  total_events: 'Total de Eventos',
  unique_users: 'Utilizadores Únicos',
  unique_items_recommended: 'Itens Únicos Recomendados',
  avg_rank_clicked: 'Posição Média Clicada',
  recommendations_per_user: 'Recomendações por Utilizador',
  events_per_user: 'Eventos por Utilizador',
};

export const METRIC_FORMATS: Record<string, 'percent' | 'number' | 'decimal'> = {
  ctr: 'percent',
  ctr_by_scenario: 'percent',
  conversion_rate: 'percent',
  view_to_click_rate: 'percent',
  click_to_enroll_rate: 'percent',
  enroll_to_complete_rate: 'percent',
  total_recommendations: 'number',
  total_events: 'number',
  unique_users: 'number',
  unique_items_recommended: 'number',
  avg_rank_clicked: 'decimal',
  recommendations_per_user: 'decimal',
  events_per_user: 'decimal',
};

// Métricas onde um valor mais baixo é melhor
export const LOWER_IS_BETTER = ['avg_rank_clicked'];

export const SCENARIO_LABELS: Record<string, string> = {
  home_feed: 'Feed Principal',
  my_initiatives: 'Minhas Iniciativas',
  profile_similar: 'Perfil Semelhante',
  search_enhance: 'Pesquisa Melhorada',
  post_enrollment: 'Pós-Inscrição',
  onboarding: 'Onboarding',
  similar_users: 'Utilizadores Semelhantes',
};

export const PERIOD_OPTIONS = [
  { value: '1', label: 'Último dia' },
  { value: '7', label: 'Últimos 7 dias' },
  { value: '14', label: 'Últimos 14 dias' },
  { value: '30', label: 'Últimos 30 dias' },
] as const;

// Métricas mostradas na tabela de comparação
export const COMPARISON_METRICS = [
  'ctr',
  'conversion_rate',
  'view_to_click_rate',
  'click_to_enroll_rate',
  'enroll_to_complete_rate',
  'avg_rank_clicked',
];

// Métricas disponíveis para o gráfico temporal
export const TIME_SERIES_METRICS = [
  'ctr',
  'conversion_rate',
  'view_to_click_rate',
  'click_to_enroll_rate',
  'enroll_to_complete_rate',
  'avg_rank_clicked',
  'total_recommendations',
  'unique_users',
];

// Labels de conversão
export const FUNNEL_METRICS = [
  { key: 'view_to_click_rate', label: 'Vista \u2192 Clique' },
  { key: 'click_to_enroll_rate', label: 'Clique \u2192 Inscrição' },
  { key: 'enroll_to_complete_rate', label: 'Inscrição \u2192 Conclusão' },
  { key: 'conversion_rate', label: 'Conversão Global' },
] as const;

export function formatMetricValue(value: number, metricName: string): string {
  const format = METRIC_FORMATS[metricName] || 'decimal';
  switch (format) {
    case 'percent':
      return `${value.toFixed(2)}%`;
    case 'number':
      return value.toLocaleString('pt-PT');
    case 'decimal':
      return value.toFixed(2);
    default:
      return String(value);
  }
}
