import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingHero } from './components/LandingHero';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { AppView, Transaction, AuditLogEntry } from './types';
import { MOCK_TRANSACTIONS } from './constants';
import { initializeChat } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const startFlow = () => {
    setCurrentView(AppView.UPLOAD);
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    
    setLoading(true);
    // Simulate parsing delay and potential real CSV parsing logic here
    setTimeout(() => {
      loadData(MOCK_TRANSACTIONS);
    }, 1500);
  };

  const handleUseDemo = () => {
    setLoading(true);
    setTimeout(() => {
      loadData(MOCK_TRANSACTIONS);
    }, 1000);
  };

  const loadData = (data: Transaction[]) => {
    setTransactions(data);
    initializeChat(data); // Pre-load context into Gemini
    setLoading(false);
    setCurrentView(AppView.DASHBOARD);
  };

  return (
    <Layout showNav={currentView !== AppView.LANDING}>
      {currentView === AppView.LANDING && (
        <LandingHero onStart={startFlow} />
      )}

      {currentView === AppView.UPLOAD && (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
          {loading ? (
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 border-4 border-fintech-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Analyzing Financial DNA...</h3>
              <p className="text-slate-400">Encrypting and processing locally</p>
            </div>
          ) : (
            <FileUpload onUpload={handleFileUpload} onUseDemo={handleUseDemo} />
          )}
        </div>
      )}

      {currentView === AppView.DASHBOARD && (
        <Dashboard 
          transactions={transactions} 
          onUpdateTransactions={setTransactions}
          auditLog={auditLog}
          onUpdateAuditLog={setAuditLog}
        />
      )}
    </Layout>
  );
};

export default App;