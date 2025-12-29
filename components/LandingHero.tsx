import React, { useState } from 'react';
import { 
  ArrowRight, ShieldCheck, Zap, TrendingUp, Sparkles, 
  Activity, Lock, Database, Cpu, PieChart, Globe, ChevronRight 
} from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  const [investment, setInvestment] = useState(10000);

  return (
    <div className="relative w-full overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-20">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-fintech-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fintech-neonCyan/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[20%] left-[20%] w-full h-px bg-gradient-to-r from-transparent via-fintech-accent/20 to-transparent rotate-45 transform scale-150" />
        </div>

        <div className="max-w-5xl mx-auto z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fintech-800/80 border border-fintech-accent/30 text-fintech-accent text-sm font-medium mb-8 animate-fade-in backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span className="font-mono tracking-tight">Gemini 3.0 Pro Thinking Model</span>
          </div>

          {/* Headlines */}
          <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight text-white mb-6 leading-[1.1] animate-slide-up">
            The Future of <br />
            <span className="text-gradient">Algorithmic Wealth</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up font-light" style={{ animationDelay: '0.1s' }}>
            Harness the power of deep learning to predict cash flow, detect anomalies, and automate wealth generation with 99.9% precision.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={onStart}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-fintech-accent hover:bg-fintech-accentHover rounded-xl transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:scale-105"
            >
              Start Simulation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onStart} 
              className="px-8 py-4 text-slate-300 hover:text-white font-medium transition-colors hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
            >
              Read Whitepaper
            </button>
          </div>
        </div>

        {/* Dashboard Preview / Floating UI */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto h-[400px] hidden md:block animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-fintech-900 via-transparent to-transparent z-10" />
          <div className="w-full h-full glass-card rounded-t-3xl border-b-0 p-8 transform rotate-x-12 perspective-1000 opacity-80 scale-95 origin-bottom">
             <div className="grid grid-cols-3 gap-6 h-full">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col justify-between">
                   <div className="flex justify-between text-slate-400 text-sm"><span>Net Worth</span><TrendingUp className="w-4 h-4 text-fintech-neonGreen" /></div>
                   <div className="text-4xl font-mono text-white">$142,094</div>
                   <div className="h-16 w-full bg-fintech-neonGreen/10 rounded-lg relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-fintech-neonGreen/20 to-transparent animate-pulse" />
                   </div>
                </div>
                <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-400">Real-time Anomaly Detection</span>
                      <span className="px-2 py-0.5 bg-fintech-neonCyan/20 text-fintech-neonCyan text-xs rounded uppercase font-bold">Live</span>
                   </div>
                   <div className="flex-1 flex items-end justify-between gap-1">
                      {[40, 65, 30, 80, 50, 90, 45, 70, 60, 30, 50, 85].map((h, i) => (
                        <div key={i} className="w-full bg-fintech-accent/40 rounded-t-sm transition-all duration-1000 ease-in-out" style={{ height: `${h}%` }} />
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- LIVE SIMULATION SECTION --- */}
      <section className="py-24 relative border-t border-white/5 bg-fintech-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Predictive <span className="text-gradient">Alpha</span> Generation
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Our Gemini-powered engine simulates thousands of market scenarios to forecast your portfolio's growth potential versus traditional index funds.
              </p>
              
              <div className="glass-card p-8 rounded-2xl border border-fintech-accent/20">
                <div className="mb-8">
                  <div className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                    <span>Initial Investment</span>
                    <span className="text-white font-mono">${investment.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="1000"
                    value={investment}
                    onChange={(e) => setInvestment(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fintech-accent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">Traditional Yield (5yr)</div>
                    <div className="text-2xl font-mono text-slate-300">
                      ${Math.floor(investment * 1.45).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-fintech-accent/10 border border-fintech-accent/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1">
                      <Sparkles className="w-3 h-3 text-fintech-accent" />
                    </div>
                    <div className="text-xs text-fintech-accent mb-1">AI Optimized (5yr)</div>
                    <div className="text-2xl font-mono text-white font-bold">
                      ${Math.floor(investment * 1.82).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex items-center justify-center overflow-hidden">
               {/* Decorative Grid */}
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>
               
               {/* Visual Chart */}
               <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <path 
                    d="M0,200 Q50,180 100,150 T200,100 T300,60 T400,20" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3" 
                    className="animate-pulse"
                  />
                  <path 
                    d="M0,200 Q50,190 100,170 T200,140 T300,120 T400,90" 
                    fill="none" 
                    stroke="#64748b" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                  />
               </svg>
               
               {/* Floating Label */}
               <div className="absolute top-[10%] right-[10%] glass-card px-4 py-2 rounded-lg flex items-center gap-2 animate-float">
                  <div className="w-2 h-2 rounded-full bg-fintech-neonGreen animate-pulse" />
                  <span className="font-mono text-xs text-fintech-neonGreen">+32.4% Variance</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- USE CASES (CARDS) --- */}
      <section className="py-24 px-4 bg-[#05050A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Intelligence <span className="text-fintech-accent">Deployed</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Enterprise-grade financial tools, now accessible for personal wealth management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UseCaseCard 
              icon={Activity} 
              title="Algorithmic Trading" 
              desc="Millisecond execution based on sentiment analysis and market signals."
              color="text-fintech-neonGreen"
            />
            <UseCaseCard 
              icon={ShieldCheck} 
              title="Fraud Detection" 
              desc="Pattern recognition that spots anomalies in real-time before they impact you."
              color="text-red-400"
            />
            <UseCaseCard 
              icon={Cpu} 
              title="Credit Risk Analysis" 
              desc="Non-linear risk assessment using 50+ alternative data points."
              color="text-fintech-neonBlue"
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (TIMELINE) --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full bg-fintech-accent/5 blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-display font-bold text-center mb-20">The Neural Pipeline</h2>
          
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-fintech-accent to-transparent md:-translate-x-1/2" />
            
            <TimelineItem 
              step="01" 
              title="Data Ingestion" 
              desc="Securely upload CSVs or connect bank feeds. Data is encrypted locally."
              icon={Database}
              side="left"
            />
            <TimelineItem 
              step="02" 
              title="Pattern Recognition" 
              desc="Gemini 3.0 analyzes spending velocity and categorizes transactions."
              icon={Cpu}
              side="right"
            />
             <TimelineItem 
              step="03" 
              title="Strategic Planning" 
              desc="Thinking Mode (32k tokens) formulates complex wealth strategies."
              icon={Zap}
              side="left"
            />
          </div>
        </div>
      </section>

      {/* --- DATA VISUALIZATION / STATS --- */}
      <section className="py-24 bg-fintech-800/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
             <StatItem value="$4.2B" label="Transactions Processed" />
             <StatItem value="0.02ms" label="Latency Speed" />
             <StatItem value="99.9%" label="Uptime Guarantee" />
             <StatItem value="142+" label="Financial Models" />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#030014] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
               <div className="bg-white/10 p-2 rounded-lg">
                  <PieChart className="w-6 h-6 text-white" />
               </div>
               <span className="font-display font-bold text-xl text-white">FinSight<span className="text-fintech-accent">.AI</span></span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
               <a href="#" className="hover:text-white transition-colors">Platform</a>
               <a href="#" className="hover:text-white transition-colors">Solutions</a>
               <a href="#" className="hover:text-white transition-colors">Developers</a>
               <a href="#" className="hover:text-white transition-colors">Legal</a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-slate-600">
             <div>&copy; 2025 FinSight AI. Built for the Hackathon.</div>
             <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Globe className="w-3 h-3" />
                <span>Global Nodes Active</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- SUBCOMPONENTS --- */

const UseCaseCard = ({ icon: Icon, title, desc, color }: any) => (
  <div className="glass-card p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-2 cursor-default">
    <div className={`p-3 rounded-xl bg-slate-900 w-fit mb-6 border border-slate-800 group-hover:border-slate-700 transition-colors ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-fintech-accent transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    <div className="mt-6 flex items-center text-xs font-semibold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
      Learn More <ChevronRight className="w-3 h-3 ml-1" />
    </div>
  </div>
);

const TimelineItem = ({ step, title, desc, icon: Icon, side }: any) => (
  <div className={`relative flex items-center justify-between mb-16 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
    {/* Content */}
    <div className="w-[calc(50%-2rem)] glass-card p-6 rounded-xl border border-white/5 hover:border-fintech-accent/50 transition-colors">
      <div className="text-fintech-accent font-mono text-xs font-bold mb-2">STEP {step}</div>
      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        {title}
      </h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>

    {/* Center Dot */}
    <div className="absolute left-[15px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-fintech-900 border-2 border-fintech-accent shadow-[0_0_10px_rgba(139,92,246,0.5)] z-10" />
    
    {/* Spacer for other side */}
    <div className="hidden md:block w-[calc(50%-2rem)]" />
  </div>
);

const StatItem = ({ value, label }: any) => (
  <div className="p-6">
    <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2">{value}</div>
    <div className="text-sm text-fintech-accent uppercase tracking-wider font-semibold">{label}</div>
  </div>
);
