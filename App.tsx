import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { SheetSelector } from './components/SheetSelector';
import { DataPreview } from './components/DataPreview';
import { AiAnalyzer } from './components/AiAnalyzer';
import { Button } from './components/Button';
import { parseExcelFile, mergeSheets, exportToCSV, exportToXLSX } from './utils/excelHelper';
import { SheetData, MergedData } from './types';
import { Download, ChevronRight, RotateCcw, FileSpreadsheet } from 'lucide-react';
import { FEATURES, APP_NAME } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [mergedData, setMergedData] = useState<MergedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (selectedFile: File) => {
    setIsProcessing(true);
    try {
      const parsedSheets = await parseExcelFile(selectedFile);
      setFile(selectedFile);
      setSheets(parsedSheets);
      setSelectedIndices(parsedSheets.map((_, i) => i)); // Select all by default
      setStep(2);
    } catch (error) {
      console.error("Error parsing file", error);
      alert("Failed to parse the Excel file. Please try another one.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMerge = () => {
    setIsProcessing(true);
    // Use setTimeout to allow UI to update before heavy processing
    setTimeout(() => {
      const selectedSheets = sheets.filter((_, idx) => selectedIndices.includes(idx));
      const merged = mergeSheets(selectedSheets);
      setMergedData(merged);
      setStep(3);
      setIsProcessing(false);
    }, 100);
  };

  const handleReset = () => {
    setStep(1);
    setFile(null);
    setSheets([]);
    setMergedData(null);
  };

  const handleDownload = (format: 'csv' | 'xlsx') => {
    if (mergedData && file) {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      if (format === 'csv') {
        exportToCSV(mergedData, baseName);
      } else {
        exportToXLSX(mergedData, baseName);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
               <FileSpreadsheet size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {APP_NAME}
            </h1>
          </div>
          {step > 1 && (
            <button 
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-red-600 flex items-center transition-colors"
            >
              <RotateCcw size={14} className="mr-1" />
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Progress Stepper */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 text-sm font-medium">
            <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1. Upload</span>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2. Select</span>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3. Merge</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-extrabold text-gray-900">Merge Excel Sheets Instantly</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Combine multiple worksheets into a single master CSV file. 
                Private, secure, and runs entirely in your browser.
              </p>
            </div>
            
            <FileUpload onFileSelect={handleFileSelect} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Sheets */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Select Sheets</h2>
              <p className="text-gray-500">Choose which tabs from <span className="font-medium text-gray-900">{file?.name}</span> you want to include.</p>
            </div>

            <SheetSelector 
              sheets={sheets} 
              selectedIndices={selectedIndices}
              onChange={setSelectedIndices}
            />

            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleMerge}
                disabled={selectedIndices.length === 0}
                isLoading={isProcessing}
                className="w-full max-w-xs h-12 text-lg"
                icon={<ChevronRight />}
              >
                Merge Sheets
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Download */}
        {step === 3 && mergedData && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Merge Complete!</h2>
                <p className="text-gray-500">Your data is ready for export.</p>
              </div>
              <div className="flex space-x-3">
                 <Button 
                  variant="primary"
                  onClick={() => handleDownload('xlsx')}
                  icon={<FileSpreadsheet size={20} />}
                  className="px-6 py-3"
                >
                  Download XLSX
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => handleDownload('csv')}
                  icon={<Download size={20} />}
                  className="px-6 py-3"
                >
                  Download CSV
                </Button>
              </div>
            </div>

            <DataPreview data={mergedData} />

            <AiAnalyzer data={mergedData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
