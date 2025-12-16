import { useState } from 'react';

interface Provider {
  id: string;
  name: string;
  models: string[];
}

interface LLMSelectorProps {
  providers: Provider[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function LLMSelector({ providers, selectedModel, onModelChange }: LLMSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState(providers[0]?.id || '');

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = providers.find(p => p.id === providerId);
    if (provider && provider.models.length > 0) {
      onModelChange(provider.models[0]);
    }
  };

  const currentProvider = providers.find(p => p.id === selectedProvider);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Choose Your AI Model</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentProvider?.models.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}