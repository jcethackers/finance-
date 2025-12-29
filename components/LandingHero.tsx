import React from 'react';
import { ArrowRight, Lock, TrendingUp, Sparkles } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  return (
    <div className="relative pt-12 pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-fintech-accent/20 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] -z-10 opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fintech-800 border border-fintech-700 text-fintech-accent text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini 2.0 AI</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 max-w-4xl animate-slide-up">
          Your money, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fintech-accent to-purple-200">explained by AI.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Stop guessing where your salary went. Upload your statement securely and let our intelligent copilot analyze spending, detect risks, and forecast your wealth.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-fintech-accent hover:bg-fintech-accentHover rounded-lg transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            Analyze My Spending
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onStart} // For demo purposes, both go to same flow
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-300 bg-fintech-800/50 border border-slate-700 hover:bg-fintech-800 hover:text-white rounded-lg transition-all backdrop-blur-sm"
          >
            Try Demo Data
          </button>
        </div>

        {/* Feature Grid (Trust Signals) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {[
            { icon: Lock, title: "Private & Secure", desc: "Analysis happens locally or in ephemeral sessions. We never store your credentials." },
            { icon: TrendingUp, title: "Smart Forecasting", desc: "Predict end-of-month balance based on your unique spending velocity." },
            { icon: Sparkles, title: "Actionable Insights", desc: "Don't just see numbers. Get conversational advice on how to save more." },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center p-6 rounded-2xl bg-fintech-800/40 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 mb-4">
                <item.icon className="w-6 h-6 text-fintech-accent" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};