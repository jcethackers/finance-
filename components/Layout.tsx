import React from 'react';
import { ShieldCheck, PieChart, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen bg-fintech-900 text-slate-100 selection:bg-fintech-accent selection:text-white overflow-x-hidden">
      {showNav && (
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-fintech-900/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="bg-fintech-accent/10 p-2 rounded-lg">
                  <PieChart className="h-6 w-6 text-fintech-accent" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight">FinSight<span className="text-fintech-accent">.ai</span></span>
              </div>
              
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                <a href="#" className="hover:text-white transition-colors">Features</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
                <a href="#" className="hover:text-white transition-colors">About</a>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-fintech-accent" />
                  <span>Bank-Grade Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="relative">
        {children}
      </main>
    </div>
  );
};