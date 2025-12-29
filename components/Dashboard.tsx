import React, { useState, useEffect } from 'react';
import { Transaction, FinancialMetrics, AIInsight, CategoryBreakdown, DailySpend, AuditLogEntry } from '../types';
import { calculateMetrics, getCategoryBreakdown, getDailySpend } from '../services/analysisService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, Wallet, Activity } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { TransactionsTable } from './TransactionsTable';
import { generateInitialInsights } from '../services/geminiService';

interface DashboardProps {
  transactions: Transaction[];
  onUpdateTransactions: (transactions: Transaction[]) => void;
  auditLog: AuditLogEntry[];
  onUpdateAuditLog: (log: AuditLogEntry[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  onUpdateTransactions,
  auditLog,
  onUpdateAuditLog
}) => {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [dailyData, setDailyData] = useState<DailySpend[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    // Process local data
    const calculatedMetrics = calculateMetrics(transactions);
    const calculatedBreakdown = getCategoryBreakdown(transactions);
    const calculatedDaily = getDailySpend(transactions);

    setMetrics(calculatedMetrics);
    setCategoryData(calculatedBreakdown);
    setDailyData(calculatedDaily);

    // Fetch AI insights if not already fetched
    if (insights.length === 0) {
        const fetchInsights = async () => {
        setLoadingInsights(true);
        const generated = await generateInitialInsights(transactions);
        setInsights(generated);
        setLoadingInsights(false);
        };
        fetchInsights();
    }
  }, [transactions]); // Re-run when transactions update (e.g. bulk edit)

  if (!metrics) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Financial Overview</h1>
          <p className="text-slate-400 text-sm">Real-time analysis of your {transactions.length} transactions</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
           <div className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-300 border border-slate-700">
             Oct 2023
           </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="Total Spend" 
          value={`$${metrics.totalSpend.toLocaleString()}`} 
          trend="+12%" 
          trendDirection="up"
          icon={Wallet}
        />
        <MetricCard 
          title="Burn Rate (Daily)" 
          value={`$${metrics.burnRate.toFixed(2)}`} 
          trend="-5%" 
          trendDirection="down"
          icon={Activity}
        />
        <MetricCard 
          title="Savings Rate" 
          value={`${metrics.savingsRate.toFixed(1)}%`} 
          trend={metrics.savingsRate > 20 ? "Healthy" : "Low"} 
          trendDirection={metrics.savingsRate > 20 ? "up" : "down"}
          icon={TrendingUp}
          color={metrics.savingsRate > 20 ? "text-emerald-400" : "text-amber-400"}
        />
        <MetricCard 
          title="FinHealth Score" 
          value={100 - metrics.riskScore} 
          trend="AI Calculated" 
          icon={AlertTriangle}
          color={(100 - metrics.riskScore) > 70 ? "text-emerald-400" : "text-amber-400"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Insights Section */}
          <div className="bg-fintech-800/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-fintech-accent animate-pulse"></div>
              <h2 className="text-lg font-semibold text-white">AI Copilot Insights</h2>
            </div>
            
            {loadingInsights ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-20 bg-slate-800/50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-white">{insight.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        insight.type === 'warning' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      }`}>
                        {insight.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{insight.description}</p>
                    {insight.actionable && (
                      <div className="text-xs font-medium text-fintech-accent flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Tip: {insight.actionable}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spending Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Pie Chart */}
            <div className="bg-fintech-800/50 backdrop-blur border border-slate-800 rounded-2xl p-6 h-[400px]">
              <h3 className="text-lg font-semibold text-white mb-4">Spend by Category</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Trend Bar Chart */}
            <div className="bg-fintech-800/50 backdrop-blur border border-slate-800 rounded-2xl p-6 h-[400px]">
              <h3 className="text-lg font-semibold text-white mb-4">Daily Velocity</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dailyData}>
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Transactions Table */}
          <TransactionsTable 
            transactions={transactions} 
            onUpdate={onUpdateTransactions}
            auditLog={auditLog}
            onUpdateAuditLog={onUpdateAuditLog}
          />

        </div>

        {/* Sidebar - Chat Copilot */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Subcomponent for Metric Cards
const MetricCard = ({ title, value, trend, trendDirection, icon: Icon, color }: any) => (
  <div className="bg-fintech-800/40 backdrop-blur border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-slate-900/80 border border-slate-800 ${color ? color : 'text-slate-400'} group-hover:text-white transition-colors`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          trendDirection === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 
          trendDirection === 'down' ? 'text-red-400 bg-red-500/10' : 
          'text-slate-400 bg-slate-500/10'
        }`}>
          {trendDirection === 'up' ? <ArrowUpRight className="w-3 h-3" /> : trendDirection === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
          {trend}
        </div>
      )}
    </div>
    <div className="text-2xl font-display font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-500">{title}</div>
  </div>
);