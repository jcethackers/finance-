export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: 'debit' | 'credit';
  merchant?: string;
  flagged?: boolean;
}

export type Category = 
  | 'Housing' 
  | 'Food & Dining' 
  | 'Transportation' 
  | 'Utilities' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Health' 
  | 'Income' 
  | 'Transfers' 
  | 'Other';

export interface DailySpend {
  date: string;
  amount: number;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

export interface FinancialMetrics {
  totalSpend: number;
  totalIncome: number;
  savingsRate: number;
  burnRate: number; // Average daily spend
  riskScore: number; // 0-100 (lower is better)
  topSpendingCategory: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'neutral' | 'prediction';
  actionable?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface AuditLogEntry {
  id: string;
  transactionId: string;
  oldCategory: string;
  newCategory: string;
  source: 'User' | 'AI' | 'Bulk Edit';
  timestamp: string;
}

export enum AppView {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD'
}