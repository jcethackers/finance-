import { Transaction, Category } from './types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-01', description: 'Tech Corp Salary', amount: 5200.00, category: 'Income', type: 'credit', merchant: 'Tech Corp' },
  { id: 't2', date: '2023-10-02', description: 'Downtown Apartments', amount: 1800.00, category: 'Housing', type: 'debit', merchant: 'Downtown Apts' },
  { id: 't3', date: '2023-10-03', description: 'Whole Foods Market', amount: 145.20, category: 'Food & Dining', type: 'debit', merchant: 'Whole Foods' },
  { id: 't4', date: '2023-10-04', description: 'Uber Ride', amount: 24.50, category: 'Transportation', type: 'debit', merchant: 'Uber' },
  { id: 't5', date: '2023-10-05', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'debit', merchant: 'Netflix' },
  { id: 't6', date: '2023-10-05', description: 'Spotify Premium', amount: 11.99, category: 'Entertainment', type: 'debit', merchant: 'Spotify' },
  { id: 't7', date: '2023-10-07', description: 'Local Coffee Shop', amount: 6.50, category: 'Food & Dining', type: 'debit', merchant: 'Bean There' },
  { id: 't8', date: '2023-10-08', description: 'Amazon Purchase', amount: 89.99, category: 'Shopping', type: 'debit', merchant: 'Amazon' },
  { id: 't9', date: '2023-10-10', description: 'Electric Bill', amount: 120.00, category: 'Utilities', type: 'debit', merchant: 'City Power' },
  { id: 't10', date: '2023-10-12', description: 'Sushi Dinner', amount: 85.00, category: 'Food & Dining', type: 'debit', merchant: 'Sushi Place' },
  { id: 't11', date: '2023-10-15', description: 'Uber Ride', amount: 32.00, category: 'Transportation', type: 'debit', merchant: 'Uber' },
  { id: 't12', date: '2023-10-18', description: 'Gym Membership', amount: 45.00, category: 'Health', type: 'debit', merchant: 'FitGym' },
  { id: 't13', date: '2023-10-20', description: 'Trader Joes', amount: 95.40, category: 'Food & Dining', type: 'debit', merchant: 'Trader Joes' },
  { id: 't14', date: '2023-10-22', description: 'Cinema Tickets', amount: 30.00, category: 'Entertainment', type: 'debit', merchant: 'AMC' },
  { id: 't15', date: '2023-10-25', description: 'Shell Gas Station', amount: 55.00, category: 'Transportation', type: 'debit', merchant: 'Shell' },
  { id: 't16', date: '2023-10-28', description: 'Verizon Wireless', amount: 85.00, category: 'Utilities', type: 'debit', merchant: 'Verizon' },
  { id: 't17', date: '2023-10-29', description: 'Nike Store', amount: 120.00, category: 'Shopping', type: 'debit', merchant: 'Nike' },
  { id: 't18', date: '2023-10-30', description: 'Starbucks', amount: 8.50, category: 'Food & Dining', type: 'debit', merchant: 'Starbucks' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Housing': '#3b82f6', // blue-500
  'Food & Dining': '#10b981', // emerald-500
  'Transportation': '#f59e0b', // amber-500
  'Utilities': '#6366f1', // indigo-500
  'Entertainment': '#ec4899', // pink-500
  'Shopping': '#8b5cf6', // violet-500
  'Health': '#ef4444', // red-500
  'Income': '#22c55e', // green-500
  'Transfers': '#94a3b8', // slate-400
  'Other': '#64748b', // slate-500
};

export const INITIAL_SYSTEM_INSTRUCTION = `
You are FinSight AI, an expert, empathetic, and explainable financial assistant.
Your goal is to help users understand their spending, save money, and reduce financial anxiety.
Analyze the provided JSON transaction data.
When answering:
1. Be concise but insightful.
2. Avoid jargon. Explain financial terms simply.
3. If you spot a risk (e.g., high burn rate, low savings), suggest a gentle, actionable fix.
4. Format key numbers in bold.
5. Maintain a professional, supportive ("Coach") tone.
`;