
import React, { useState } from 'react';
import { Transaction, TransactionCategory } from '../types';
import { Download, Info, Copy, Check } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onDownload: () => void;
  onCopy: () => void;
}

const CategoryBadge: React.FC<{ category: TransactionCategory }> = ({ category }) => {
  const colors: Record<TransactionCategory, string> = {
    [TransactionCategory.FOOD]: 'bg-orange-100 text-orange-700',
    [TransactionCategory.TRAVEL]: 'bg-blue-100 text-blue-700',
    [TransactionCategory.SHOPPING]: 'bg-purple-100 text-purple-700',
    [TransactionCategory.BILLS]: 'bg-red-100 text-red-700',
    [TransactionCategory.SALARY]: 'bg-green-100 text-green-700',
    [TransactionCategory.TRANSFER]: 'bg-cyan-100 text-cyan-700',
    [TransactionCategory.OTHERS]: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category] || colors[TransactionCategory.OTHERS]}`}>
      {category}
    </span>
  );
};

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDownload, onCopy }) => {
  const [copied, setCopied] = useState(false);

  if (transactions.length === 0) return null;

  const handleCopyClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Extracted Transactions</h2>
          <p className="text-sm text-slate-500">Detected {transactions.length} rows with high confidence OCR.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyClick}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy CSV'}</span>
          </button>
          <button
            onClick={onDownload}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((txn, index) => (
                <tr key={txn.id || index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {txn.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    <div className="font-medium">{txn.description}</div>
                    {txn.notes && <div className="text-xs text-slate-400 mt-0.5 italic">{txn.notes}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CategoryBadge category={txn.category} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                    {txn.transactionId || 'NA'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${txn.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {txn.amount < 0 ? '-' : '+'}₹{Math.abs(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Info className="w-12 h-12 mb-2 opacity-20" />
            <p>No transactions to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
