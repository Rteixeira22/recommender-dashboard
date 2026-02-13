import { useState } from 'react';
import { Link2, ChevronDown, Check } from 'lucide-react';

interface ApiOption {
  label: string;
  url: string;
  environment: 'dev' | 'staging' | 'production' | 'custom';
}

const API_PRESETS: ApiOption[] = [
  {
    label: 'Desenvolvimento (Local)',
    url: 'http://recommender.localhost',
    environment: 'dev',
  },
  {
    label: 'Staging (QA)',
    url: 'https://recommender.sermaisapp-qa.ua.pt',
    environment: 'staging',
  },
  // Adicionar quando tiver produção:
  // {
  //   label: 'Produção',
  //   url: 'https://sermais.pt',
  //   environment: 'production',
  // },
  {
    label: 'Personalizado...',
    url: '',
    environment: 'custom',
  },
];

interface ApiSelectorProps {
  apiUrl: string;
  onApiUrlChange: (url: string) => void;
}

export function ApiSelector({ apiUrl, onApiUrlChange }: ApiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customUrl, setCustomUrl] = useState(apiUrl);

  // Encontrar a opção atual
  const currentOption = API_PRESETS.find(opt => opt.url === apiUrl) || API_PRESETS[API_PRESETS.length - 1];

  const handleSelect = (option: ApiOption) => {
    if (option.environment === 'custom') {
      setIsCustom(true);
      setIsOpen(false);
    } else {
      setIsCustom(false);
      onApiUrlChange(option.url);
      setIsOpen(false);
    }
  };

  const handleCustomSubmit = () => {
    if (customUrl.trim()) {
      onApiUrlChange(customUrl.trim());
      setIsCustom(false);
    }
  };

  const handleCustomCancel = () => {
    setCustomUrl(apiUrl);
    setIsCustom(false);
  };

  if (isCustom) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-purple-300 bg-purple-50">
        <Link2 className="w-4 h-4 text-purple-600" />
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCustomSubmit();
            if (e.key === 'Escape') handleCustomCancel();
          }}
          placeholder="https://..."
          className="text-sm text-purple-900 bg-transparent border-0 focus:ring-0 focus:outline-none w-64 placeholder:text-purple-400"
          autoFocus
        />
        <button
          onClick={handleCustomSubmit}
          className="text-xs font-medium text-purple-700 hover:text-purple-900 px-2 py-1 rounded hover:bg-purple-100 transition-colors"
        >
          OK
        </button>
        <button
          onClick={handleCustomCancel}
          className="text-xs font-medium text-purple-600 hover:text-purple-800 px-2 py-1 rounded hover:bg-purple-100 transition-colors"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <Link2 className="w-4 h-4 text-gray-400" />
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium text-gray-900">
            {currentOption.label}
          </span>
          <span className="text-[10px] text-gray-500 truncate max-w-[200px]">
            {apiUrl}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop para fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {API_PRESETS.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-0.5">
                    {option.label}
                  </div>
                  {option.url && (
                    <div className="text-xs text-gray-500 font-mono">
                      {option.url}
                    </div>
                  )}
                  {!option.url && (
                    <div className="text-xs text-gray-400 italic">
                      Inserir URL personalizado
                    </div>
                  )}
                </div>
                {option.url === apiUrl && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
