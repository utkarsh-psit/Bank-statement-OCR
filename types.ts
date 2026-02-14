
export enum TransactionCategory {
  FOOD = 'Food',
  TRAVEL = 'Travel',
  SHOPPING = 'Shopping',
  BILLS = 'Bills',
  SALARY = 'Salary',
  TRANSFER = 'Transfer',
  OTHERS = 'Others'
}

export interface Transaction {
  id: string;
  date: string;
  transactionId: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  notes: string;
}

export interface ExtractionResult {
  transactions: Transaction[];
  summary: {
    totalCredits: number;
    totalDebits: number;
    statementPeriod?: string;
    accountNumber?: string;
  };
}
