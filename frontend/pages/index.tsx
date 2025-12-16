import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LLMSelector from '../components/LLMSelector';
import TextExtractor from '../components/TextExtractor';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    // Fetch providers from backend
    fetch('http://localhost:8111/providers')
      .then(res => res.json())
      .then(data => setProviders(data.providers))
      .catch(err => console.error('Failed to fetch providers:', err));
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