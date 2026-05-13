import React, { useState } from 'react';
import { MergedData } from '../types';
import { analyzeDataset } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiAnalyzerProps {
  data: MergedData;
}

export const AiAnalyzer: React.FC<AiAnalyzerProps> = ({ data }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeDataset(data);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="w-full mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Data Insights</h3>
            <p className="text-sm text-gray-600">Powered by Gemini</p>
          </div>
        </div>
        {!analysis && (
          <Button 
            onClick={handleAnalyze} 
            isLoading={loading}
            icon={<Sparkles size={16} />}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
          >
            Generate Report
          </Button>
        )}
      </div>

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 text-indigo-600">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
           <p className="text-sm font-medium animate-pulse">Analyzing data structure and patterns...</p>
        </div>
      )}

      {analysis && (
        <div className="prose prose-sm prose-indigo max-w-none bg-white/80 p-6 rounded-lg backdrop-blur-sm border border-white/50 shadow-sm">
          <ReactMarkdown>{analysis}</ReactMarkdown>
          <div className="mt-6 flex justify-end">
            <Button 
                onClick={handleAnalyze} 
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
                Regenerate Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
