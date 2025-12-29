import { Transaction, FinancialMetrics, CategoryBreakdown, Category, DailySpend } from '../types';
import { CATEGORY_COLORS } from '../constants';

export const calculateMetrics = (transactions: Transaction[]): FinancialMetrics => {
  const totalIncome = transactions
    .filter(t => t.type === 'credit' || t.category === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpend = transactions
    .filter(t => t.type === 'debit' && t.category !== 'Transfers')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalSpend) / totalIncome) * 100 
    : 0;

  // Simple daily burn rate estimation (assuming data spans roughly 30 days for this demo)
  const uniqueDays = new Set(transactions.map(t => t.date)).size || 30;
  const burnRate = totalSpend / uniqueDays;

  // Risk Score Algorithm (Simplified)
  // 0 is safe, 100 is risky.
  // Factors: High burn rate relative to income, low savings rate.
  let riskScore = 50; 
  if (savingsRate > 20) riskScore -= 20;
  if (savingsRate < 0) riskScore += 30;
  if (totalSpend > totalIncome) riskScore += 20;
  if (burnRate > 200) riskScore += 10; // High daily spend
  
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Find top category
  const breakdown = getCategoryBreakdown(transactions);
  const topCategory = breakdown.length > 0 ? breakdown[0].category : 'None';

  return {
    totalIncome,
    totalSpend,
    savingsRate,
    burnRate,
    riskScore,
    topSpendingCategory: topCategory
  };
};

export const getCategoryBreakdown = (transactions: Transaction[]): CategoryBreakdown[] => {
  const categoryMap = new Map<string, number>();

  transactions
    .filter(t => t.type === 'debit' && t.category !== 'Transfers')
    .forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

  const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: CATEGORY_COLORS[category] || '#94a3b8'
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getDailySpend = (transactions: Transaction[]): DailySpend[] => {
  const dailyMap = new Map<string, number>();
  
  // Initialize range if needed, but for demo we just group existing
  transactions
    .filter(t => t.type === 'debit')
    .forEach(t => {
      const date = t.date;
      const current = dailyMap.get(date) || 0;
      dailyMap.set(date, current + t.amount);
    });

  return Array.from(dailyMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};