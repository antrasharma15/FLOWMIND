import React from 'react';
import { motion } from 'framer-motion';
import { useDemo } from './DemoContext';

const DemoInsights = () => {
   const { stats, aiMode } = useDemo();

   const insights = [
      { title: 'Peak Productivity', desc: 'You work best between 10 AM – 1 PM.', icon: '⚡', impact: 'High' },
      { title: 'Burnout Risk', desc: stats.highPriority > 4 ? 'Increased risk due to urgent workload.' : 'Stable. Cognitive load is balanced.', icon: '🔋', impact: stats.highPriority > 4 ? 'High' : 'Low' },
      { title: 'Focus Momentum', desc: stats.productivityScore > 70 ? 'Strong momentum. Keep going!' : 'Momentum is dipping. Take a break.', icon: '🌀', impact: 'Medium' },
   ];

   return (
      <div className="space-y-8 md:space-y-12">
         <header className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">AI Insights</h1>
            <p className="text-sm md:text-base text-white/40">Intelligence analysis based on your simulated behavior.</p>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            <div className="lg:col-span-8 space-y-8 md:space-y-10">
               <div className="rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 space-y-8 md:space-y-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">📉</div>
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Weekly Performance Analysis</h3>
                  </div>
                  
                  <div className="space-y-4 md:space-y-6">
                     {insights.map((insight, i) => (
                        <motion.div
                           key={i}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           className="group/item relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 md:p-8 flex items-center justify-between transition-all hover:bg-white/[0.04] hover:border-white/10"
                        >
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-2xl shadow-inner group-hover/item:scale-110 transition-transform">{insight.icon}</div>
                              <div className="space-y-1">
                                 <h4 className="text-lg md:text-xl font-bold tracking-tight text-white">{insight.title}</h4>
                                 <p className="text-[12px] md:text-[13px] font-medium text-slate-500 leading-relaxed max-w-md">{insight.desc}</p>
                              </div>
                           </div>
                           <span className={`hidden sm:inline-block px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 ${insight.impact === 'High' ? 'bg-[#ff4d4d]/10 text-[#ff4d4d]' : 'bg-[#7d8dff]/10 text-[#7d8dff]'}`}>
                              {insight.impact} Impact
                           </span>
                        </motion.div>
                     ))}
                  </div>
               </div>

               <div className="group relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#7d8dff]/05 rounded-full blur-[100px] pointer-events-none" />
                  
                  <div className="space-y-6 md:space-y-8 relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">✨</div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Smart Recommendations</h3>
                     </div>
                     <p className="text-base md:text-lg text-slate-400 font-medium italic leading-relaxed max-w-2xl">
                        Based on your current {aiMode} mode, here are optimized suggestions for your next 24 hours.
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="p-6 md:p-8 bg-white/[0.03] rounded-2xl md:rounded-[2.5rem] border border-white/5 space-y-3">
                           <p className="text-[9px] font-black text-[#7d8dff] uppercase tracking-widest">Action Required</p>
                           <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">Batch backend tasks tomorrow morning for maximum flow.</p>
                        </div>
                        <div className="p-6 md:p-8 bg-white/[0.03] rounded-2xl md:rounded-[2.5rem] border border-white/5 space-y-3">
                           <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Schedule Optimization</p>
                           <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">Move "Sprint Review" to afternoon when cognitive energy is lower.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-8 md:space-y-10">
               <div className="rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 flex flex-col items-center text-center shadow-2xl backdrop-blur-3xl space-y-8">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center p-2">
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="50%" cy="50%" r="48%" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                        <circle cx="50%" cy="50%" r="48%" stroke="#7d8dff" strokeWidth="6" fill="transparent" strokeDasharray={`${stats.productivityScore * 3} 1000`} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(125,141,255,0.5)]" />
                     </svg>
                     <div className="relative z-10 flex flex-col items-center">
                        <span className="text-3xl md:text-4xl font-black text-white tabular-nums">{stats.productivityScore}%</span>
                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Aggregate</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl md:text-2xl font-bold tracking-tight text-white">Focus Score</h4>
                     <p className="text-[12px] md:text-[13px] font-medium text-slate-500 leading-relaxed">Overall cognitive efficiency across all demo data.</p>
                  </div>
               </div>

               <div className="rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-3xl space-y-8 md:space-y-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner">🔋</div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Productivity Mode</h4>
                  </div>
                  <div className="space-y-3">
                     {['Focused', 'Balanced', 'Relaxed'].map(mode => (
                        <div key={mode} className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all relative overflow-hidden group/mode ${aiMode === mode ? 'bg-white text-black border-white shadow-2xl scale-[1.02]' : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-white hover:bg-white/[0.05]'}`}>
                           {aiMode === mode && <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-200 opacity-100" />}
                           <div className="relative z-10 flex items-center justify-between">
                              <p className={`text-sm md:text-base font-black uppercase tracking-widest ${aiMode === mode ? 'text-black' : 'group-hover/mode:text-white'}`}>{mode}</p>
                              {aiMode === mode && <span className="text-black text-xs font-black">ACTIVE</span>}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default DemoInsights;
