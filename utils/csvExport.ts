
import { Transaction } from '../types';

export const convertToCSV = (transactions: Transaction[]): string => {
  const header = "Date,Transaction ID,Description,Amount,Category,Notes";
  const rows = transactions.map(t => {
    return [
      t.date,
      t.transactionId || 'NA',
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.category,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ].join(',');
  });
  
  return [header, ...rows].join('\n');
};

export const downloadCSV = (csvContent: string, fileName: string = 'bank_transactions.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
