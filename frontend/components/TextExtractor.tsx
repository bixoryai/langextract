import { useState } from 'react';

interface TextExtractorProps {
  selectedModel: string;
}

export default function TextExtractor({ selectedModel }: TextExtractorProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    const inputText = activeTab === 'text' ? text : url;
    if (!inputText.trim() || !prompt.trim()) {
      setError('Please provide both input and extraction prompt.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const endpoint = activeTab === 'text' ? '/extract' : '/extract-url';
      const payload = activeTab === 'text'
        ? {
            text: inputText,
            prompt_description: prompt,
            model_id: selectedModel,
          }
        : {
            url: inputText,
            prompt_description: prompt,
            model_id: selectedModel,
          };

      const response = await fetch(`http://localhost:8111${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Extraction failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Extract Information</h2>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'text'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Text Input
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'url'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Web URL
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extraction Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Extract all medication names and dosages from the text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeTab === 'text' ? 'Text to Analyze' : 'Web URL to Scrape'}
            </label>
            {activeTab === 'text' ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              />
            ) : (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Extracting...' : `Extract from ${activeTab === 'text' ? 'Text' : 'Web Page'}`}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {results && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Extraction Results</h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}