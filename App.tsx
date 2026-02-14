
import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import TransactionTable from './components/TransactionTable';
import { extractBankData } from './geminiService';
import { Transaction, ExtractionResult } from './types';
import { convertToCSV, downloadCSV } from './utils/csvExport';
import { PieChart, TrendingUp, TrendingDown, Hash, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractionResult | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const base64 = await fileToBase64(file);
      const result = await extractBankData(base64, file.type);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to process the statement. Please ensure it's a clear image or text-based PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (data?.transactions) {
      const csv = convertToCSV(data.transactions);
      downloadCSV(csv, `Statement_Export_${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const handleCopy = async () => {
    if (data?.transactions) {
      const csv = convertToCSV(data.transactions);
      try {
        await navigator.clipboard.writeText(csv);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Instructions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Upload Statement</h2>
              <p className="text-sm text-slate-500 mb-6">Process bank statements in seconds. Optimized for Indian bank formats.</p>
              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>

            <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">How it works</h3>
              <ul className="space-y-4 text-sm text-indigo-100">
                <li className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-indigo-800 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <p>Our AI reads your file (PDF or Image) and detects transaction tables instantly.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-indigo-800 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <p>Transactions are identified and amounts are converted to standard Rupee format.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-indigo-800 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <p>Get a clean summary of your Income, Spending, and total Transaction volume.</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Results & Analysis */}
          <div className="lg:col-span-8">
            {data ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Income</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{Math.abs(data.summary.totalCredits || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Spending</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{Math.abs(data.summary.totalDebits || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <Hash className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Transactions</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {data.transactions.length}
                    </div>
                  </div>
                </div>

                <TransactionTable 
                  transactions={data.transactions} 
                  onDownload={handleDownload} 
                  onCopy={handleCopy}
                />
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl border-dashed p-12">
                <div className="p-6 bg-slate-50 rounded-full mb-6">
                  <PieChart className="w-16 h-16 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Statement Processed</h3>
                <p className="text-slate-500 max-w-sm">Upload your bank statement on the left to see transaction data and analysis here.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">© 2024 BankScan AI. Secure processing for Indian bank statements using Gemini 3.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
