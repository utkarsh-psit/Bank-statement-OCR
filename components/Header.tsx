
import React from 'react';
import { Landmark, FileText, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Landmark className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">BankScan <span className="text-indigo-600">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Analyzer</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">History</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Guides</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Settings className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
