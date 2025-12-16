import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LLMSelector from '../components/LLMSelector';
import TextExtractor from '../components/TextExtractor';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    // Fetch providers from backend
    console.log('Fetching providers from backend...');
    fetch('http://localhost:8111/providers')
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Received providers:', data);
        setProviders(data.providers);
      })
      .catch(err => {
        console.error('Failed to fetch providers:', err);
        // Fallback to hardcoded providers for testing
        setProviders([
          { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-3.5-turbo'] },
          { id: 'anthropic', name: 'Anthropic', models: ['claude-3-5-sonnet-20241022'] },
          { id: 'gemini', name: 'Google Gemini', models: ['gemini-2.5-flash'] },
          { id: 'ollama', name: 'Ollama (Local)', models: ['llama3.2'] }
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Super Extractor - Bixory AI</title>
        <meta name="description" content="AI-powered text extraction tool" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
            Super Extractor
          </h1>
          <p className="text-lg text-center mb-8 text-gray-600">
            Extract structured information from text using advanced AI models
          </p>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <LLMSelector
              providers={providers}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>

          <TextExtractor selectedModel={selectedModel} />
        </div>
      </main>

      <Footer />
    </div>
  );
}