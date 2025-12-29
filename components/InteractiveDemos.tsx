import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip, ReferenceLine
} from 'recharts';
import { 
  TrendingUp, TrendingDown, ShieldAlert, ShieldCheck, FileText, 
  Search, Check, X, Zap, Activity, Smartphone, Globe, Lock, Brain
} from 'lucide-react';

// --- FEATURE 1: News-to-Alpha Sentiment Engine ---
const SENTIMENT_SCENARIOS = [
  { text: "Tech Corp announces breakthrough in quantum computing chips.", sentiment: 'positive', score: 0.92 },
  { text: "Supply chain disruptions delay global shipping indefinitely.", sentiment: 'negative', score: -0.85 },
  { text: "Central Bank maintains interest rates, market remains stable.", sentiment: 'neutral', score: 0.05 },
];

export const SentimentEngine = () => {
  const [headline, setHeadline] = useState(SENTIMENT_SCENARIOS[0].text);
  const [data, setData] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [sentiment, setSentiment] = useState(SENTIMENT_SCENARIOS[0]);

  useEffect(() => {
    generateChartData(sentiment);
  }, []);

  const generateChartData = (sent: typeof sentiment) => {
    const base = 150;
    let current = base;
    const newData = [];
    for (let i = 0; i < 20; i++) {
      // Volatility
      const noise = (Math.random() - 0.5) * 5; 
      // Trend based on sentiment
      const trend = i > 10 ? (sent.score * 5 * (i - 10)) : 0;
      
      current = current + noise + (i > 10 ? trend : 0);
      newData.push({ time: i, price: current });
    }
    setData(newData);
  };

  const handleAnalyze = (text: string) => {
    setHeadline(text);
    setAnalyzing(true);
    
    // Simulate AI Processing
    setTimeout(() => {
      const found = SENTIMENT_SCENARIOS.find(s => s.text === text) || SENTIMENT_SCENARIOS[2];
      setSentiment(found);
      generateChartData(found);
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <h3 className="text-2xl font-display font-bold text-white">News-to-Alpha <span className="text-fintech-accent">Engine</span></h3>
        <p className="text-slate-400">
          Our NLP engine reads millions of headlines per second, converting text into trade execution signals instantly.
        </p>
        
        <div className="space-y-3">
          {SENTIMENT_SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleAnalyze(s.text)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                headline === s.text 
                  ? 'bg-slate-800 border-fintech-accent shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="text-sm text-white font-medium">{s.text}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden h-[300px] flex flex-col">
        {analyzing && (
           <div className="absolute inset-0 bg-fintech-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
             <div className="flex flex-col items-center gap-3">
               <div className="w-8 h-8 border-2 border-fintech-accent border-t-transparent rounded-full animate-spin" />
               <span className="text-fintech-accent font-mono text-sm animate-pulse">ANALYZING SENTIMENT...</span>
             </div>
           </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${sentiment.sentiment === 'positive' ? 'bg-emerald-500' : sentiment.sentiment === 'negative' ? 'bg-red-500' : 'bg-slate-500'}`} />
             <span className="text-xs font-mono text-slate-300 uppercase">{sentiment.sentiment} SIGNAL</span>
           </div>
           <span className={`font-mono font-bold ${sentiment.sentiment === 'positive' ? 'text-emerald-400' : sentiment.sentiment === 'negative' ? 'text-red-400' : 'text-slate-400'}`}>
             {sentiment.score > 0 ? '+' : ''}{Math.round(sentiment.score * 100)}%
           </span>
        </div>

        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={sentiment.sentiment === 'positive' ? '#10b981' : sentiment.sentiment === 'negative' ? '#ef4444' : '#94a3b8'} 
                strokeWidth={3} 
                dot={false}
                animationDuration={1500}
              />
              <ReferenceLine x={10} stroke="#64748b" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- FEATURE 2: Fraud Hunter Sandbox ---
const MOCK_TXS = [
  { id: 1, merchant: "Apple Store", location: "Cupertino, CA", amount: 1299.00, risk: "low" },
  { id: 2, merchant: "Unknown Vendor", location: "Lagos, NG", amount: 450.50, risk: "high", reason: "Geo-mismatch detected" },
  { id: 3, merchant: "Starbucks", location: "Seattle, WA", amount: 12.50, risk: "low" },
];

export const FraudHunter = () => {
  const [currentTxIndex, setCurrentTxIndex] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const currentTx = MOCK_TXS[currentTxIndex % MOCK_TXS.length];

  const handleDecision = (decision: 'approve' | 'block') => {
    const isCorrect = (decision === 'block' && currentTx.risk === 'high') || (decision === 'approve' && currentTx.risk === 'low');
    
    setHistory(prev => [{ ...currentTx, decision, isCorrect }, ...prev].slice(0, 3));
    setCurrentTxIndex(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="order-2 md:order-1 relative">
        {/* Card Stack Effect */}
        <div className="absolute top-4 left-4 right-4 bottom-[-10px] bg-slate-800 rounded-2xl opacity-50 scale-95" />
        <div className="absolute top-8 left-8 right-8 bottom-[-20px] bg-slate-900 rounded-2xl opacity-30 scale-90" />
        
        <div className="relative bg-fintech-card border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-slate-800 p-3 rounded-full">
               <Globe className="w-6 h-6 text-slate-300" />
            </div>
            <div className="text-right">
               <div className="text-2xl font-mono font-bold text-white">${currentTx.amount.toFixed(2)}</div>
               <div className="text-xs text-slate-500 uppercase">Transaction Request</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div>
              <div className="text-xs text-slate-500 uppercase">Merchant</div>
              <div className="text-lg text-white font-medium">{currentTx.merchant}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase">Location IP</div>
              <div className="text-lg text-white font-medium flex items-center gap-2">
                 {currentTx.location}
                 {currentTx.risk === 'high' && <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleDecision('block')}
              className="py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold flex justify-center items-center gap-2"
            >
              <X className="w-4 h-4" /> BLOCK
            </button>
            <button 
              onClick={() => handleDecision('approve')}
              className="py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all font-bold flex justify-center items-center gap-2"
            >
              <Check className="w-4 h-4" /> APPROVE
            </button>
          </div>
        </div>
      </div>

      <div className="order-1 md:order-2 flex flex-col justify-center">
        <h3 className="text-2xl font-display font-bold text-white mb-4">Fraud Hunter <span className="text-fintech-accent">Sandbox</span></h3>
        <p className="text-slate-400 mb-8">
          AI acts as your perimeter defense. Test the detection engine yourself. Can you spot the anomaly faster than the 0.02ms algorithm?
        </p>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Activity</h4>
          {history.length === 0 && <div className="text-sm text-slate-600 italic">No decisions made yet.</div>}
          {history.map((h, i) => (
             <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${h.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {h.isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </div>
                  <div className="text-sm">
                    <div className="text-white">{h.merchant}</div>
                    <div className="text-xs text-slate-500">{h.reason || "Verified Transaction"}</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-400">
                   AI Confidence: 99.9%
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- FEATURE 3: Monte Carlo Wealth Simulator ---
export const WealthSimulator = () => {
  const [optimization, setOptimization] = useState(50);
  
  const data = useMemo(() => {
    const arr = [];
    let base = 10000;
    let worst = 10000;
    let best = 10000;
    
    // Spread reduces as optimization increases (AI risk management)
    const spreadFactor = 1 - (optimization / 100); 

    for (let year = 0; year <= 30; year++) {
      arr.push({
        year: 2024 + year,
        median: Math.round(base),
        range: [Math.round(worst), Math.round(best)]
      });
      
      base = base * 1.08; // 8% avg
      worst = worst * (1.02 + (0.02 * spreadFactor)); // Lower bound improves with optimization
      best = best * (1.12 - (0.02 * spreadFactor)); // Upper bound tightens
    }
    return arr;
  }, [optimization]);

  return (
    <div className="glass-card p-8 rounded-3xl border border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
             <Brain className="w-6 h-6 text-fintech-accent" />
             Monte Carlo <span className="text-slate-400 font-light">Simulation</span>
           </h3>
           <p className="text-sm text-slate-400 max-w-md">
             Visualizing 1,000 potential future market scenarios.
             Adjust AI Optimization to see how algorithmic rebalancing reduces volatility risk.
           </p>
        </div>
        <div className="w-full md:w-64">
           <div className="flex justify-between text-xs mb-2">
             <span className="text-slate-400">Standard Portfolio</span>
             <span className="text-fintech-accent font-bold">AI Optimized</span>
           </div>
           <input 
             type="range" 
             min="0" 
             max="100" 
             value={optimization}
             onChange={(e) => setOptimization(parseInt(e.target.value))}
             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fintech-accent"
           />
        </div>
      </div>

      <div className="h-[350px] w-full">
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
             <defs>
               <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                 <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
               </linearGradient>
               <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                 <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
               </linearGradient>
             </defs>
             <XAxis dataKey="year" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
             <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
             <Tooltip 
               contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
             />
             <Area 
               type="monotone" 
               dataKey="range" 
               stroke="none" 
               fill="url(#colorCloud)" 
               fillOpacity={0.4}
               animationDuration={500}
             />
             <Area 
               type="monotone" 
               dataKey="median" 
               stroke="#10B981" 
               strokeWidth={2}
               fill="url(#colorMedian)" 
             />
           </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- FEATURE 4: 10-K Document Interrogator ---
const DOC_CONTENT = {
  header: "Quarterly Earnings Report (10-Q)",
  paragraphs: [
    { id: 1, text: "The Company reported net revenue of $14.2 billion, an increase of 12% year-over-year, driven primarily by cloud services expansion." },
    { id: 2, text: "Operating expenses increased by 15% due to one-time legal settlements and R&D investments in generative AI infrastructure.", type: "risk" },
    { id: 3, text: "Cash and cash equivalents stand at $3.5 billion, ensuring liquidity for upcoming debt obligations maturing in Q4.", type: "liquidity" }
  ]
};

export const DocScanner = () => {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<number | null>(null);

  const handleQuery = (type: string, pId: number) => {
    setActiveQuery(type);
    setHighlight(pId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
         <h3 className="text-2xl font-bold font-display text-white">10-K Document <span className="text-fintech-accent">Interrogator</span></h3>
         <p className="text-slate-400">
           Don't read 100 pages. Ask questions. Our RAG (Retrieval Augmented Generation) engine cites sources instantly.
         </p>
         
         <div className="space-y-3">
            <button 
              onClick={() => handleQuery('revenue', 1)}
              className={`flex items-center gap-3 w-full p-4 rounded-xl border text-left transition-all ${activeQuery === 'revenue' ? 'bg-fintech-accent/10 border-fintech-accent text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Search className="w-5 h-5" />
              <span>"Summarize revenue growth drivers"</span>
            </button>
            <button 
              onClick={() => handleQuery('risk', 2)}
              className={`flex items-center gap-3 w-full p-4 rounded-xl border text-left transition-all ${activeQuery === 'risk' ? 'bg-fintech-accent/10 border-fintech-accent text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span>"Identify hidden operating risks"</span>
            </button>
            <button 
              onClick={() => handleQuery('liquidity', 3)}
              className={`flex items-center gap-3 w-full p-4 rounded-xl border text-left transition-all ${activeQuery === 'liquidity' ? 'bg-fintech-accent/10 border-fintech-accent text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Activity className="w-5 h-5" />
              <span>"Check liquidity status"</span>
            </button>
         </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-8 min-h-[400px] text-slate-800 font-serif relative overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
         <div className="border-b-2 border-slate-300 pb-4 mb-6 flex justify-between items-center">
            <h4 className="font-bold text-xl uppercase tracking-widest">{DOC_CONTENT.header}</h4>
            <FileText className="w-6 h-6 text-slate-400" />
         </div>
         
         <div className="space-y-6 text-sm leading-relaxed opacity-80">
            {DOC_CONTENT.paragraphs.map((p) => (
              <p 
                key={p.id} 
                className={`transition-all duration-500 p-2 rounded ${
                  highlight === p.id 
                    ? 'bg-yellow-200 scale-105 shadow-lg font-medium text-black opacity-100' 
                    : highlight ? 'blur-[1px] opacity-40' : ''
                }`}
              >
                {p.text}
              </p>
            ))}
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
         </div>

         {/* Scanning Overlay Effect */}
         <div className={`absolute top-0 left-0 w-full h-1 bg-fintech-accent/50 shadow-[0_0_15px_rgba(139,92,246,0.8)] transition-all duration-[2000ms] ease-in-out ${highlight ? 'top-[40%] opacity-0' : 'top-0 opacity-100'}`} />
      </div>
    </div>
  );
};

// --- FEATURE 5: Alt-Data Credit Scorer ---
export const CreditScorer = () => {
  const [factors, setFactors] = useState({
    stability: 60,
    consistency: 50,
    digital: 40
  });

  const data = [
    { subject: 'Stability', A: factors.stability, fullMark: 100 },
    { subject: 'Consistency', A: factors.consistency, fullMark: 100 },
    { subject: 'Digital Footprint', A: factors.digital, fullMark: 100 },
    { subject: 'Cash Flow', A: 85, fullMark: 100 },
    { subject: 'Social Proof', A: 70, fullMark: 100 },
  ];

  const score = Math.round((factors.stability + factors.consistency + factors.digital + 85 + 70) / 5);

  const toggleFactor = (key: keyof typeof factors) => {
    setFactors(prev => ({
      ...prev,
      [key]: prev[key] === 100 ? 50 : 100
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
       <div className="relative h-[350px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
             <div className="text-3xl font-bold text-white">{score}</div>
             <div className="text-[10px] text-slate-500 uppercase tracking-widest">Score</div>
          </div>
       </div>

       <div className="space-y-6">
          <h3 className="text-2xl font-bold font-display text-white">Alternative Data <span className="text-fintech-accent">Scoring</span></h3>
          <p className="text-slate-400">
            No credit history? No problem. We analyze thousands of behavioral data points to assess true reliability.
          </p>

          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-[#1DB954]/20 text-[#1DB954]">
                      <Zap className="w-5 h-5" />
                   </div>
                   <div className="text-sm font-medium text-white">Spotify Premium (3+ Years)</div>
                </div>
                <button 
                  onClick={() => toggleFactor('consistency')}
                  className={`w-10 h-5 rounded-full transition-colors relative ${factors.consistency === 100 ? 'bg-fintech-accent' : 'bg-slate-700'}`}
                >
                   <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${factors.consistency === 100 ? 'translate-x-5' : ''}`} />
                </button>
             </div>

             <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <Lock className="w-5 h-5" />
                   </div>
                   <div className="text-sm font-medium text-white">Same Email Address (5+ Years)</div>
                </div>
                <button 
                  onClick={() => toggleFactor('stability')}
                  className={`w-10 h-5 rounded-full transition-colors relative ${factors.stability === 100 ? 'bg-fintech-accent' : 'bg-slate-700'}`}
                >
                   <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${factors.stability === 100 ? 'translate-x-5' : ''}`} />
                </button>
             </div>

             <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                      <Smartphone className="w-5 h-5" />
                   </div>
                   <div className="text-sm font-medium text-white">Device Metadata Integrity</div>
                </div>
                <button 
                  onClick={() => toggleFactor('digital')}
                  className={`w-10 h-5 rounded-full transition-colors relative ${factors.digital === 100 ? 'bg-fintech-accent' : 'bg-slate-700'}`}
                >
                   <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${factors.digital === 100 ? 'translate-x-5' : ''}`} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};