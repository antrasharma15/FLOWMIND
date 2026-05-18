import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
   const [stats, setStats] = useState({
      total: 0,
      completed: 0,
      pending: 0,
      priorities: { high: 0, medium: 0, low: 0 }
   });
   const [productivityScore, setProductivityScore] = useState({ score: 0, trend: '+0%' });
   const [intelligence, setIntelligence] = useState({
      analysis_summary: "Analyzing your cognitive workload and historical patterns...",
      ai_efficiency_score: 0,
      growth_percentage: "+0%",
      behavioral_pattern: "Stabilizing..."
   });
   const [searchQuery, setSearchQuery] = useState('');
   const [dateRange, setDateRange] = useState('this_month');
   const [aiInsight, setAiInsight] = useState("Analyzing workload patterns for custom recommendations...");
   const [loading, setLoading] = useState(true);

   const [trends, setTrends] = useState([]);
   const [focusWindow, setFocusWindow] = useState({});

   useEffect(() => {
      const fetchAnalyticsData = async () => {
         try {
            setLoading(true);
            const params = {
               range: dateRange,
               search: searchQuery
            };

            const [summaryRes, trendsRes, focusRes, scoreRes, intelligenceRes, trendsHistoryRes, insightRes] = await Promise.all([
               api.get('/analytics/summary', { params }),
               api.get('/analytics/productivity', { params }),
               api.get('/analytics/focus-window', { params }),
               api.get('/analytics/productivity-score'),
               api.get('/ai/intelligence'),
               api.get('/analytics/trends'),
               api.get('/ai/analytics-insight')
            ]);

            setStats(summaryRes.data);
            setTrends(trendsHistoryRes.data.data);
            setFocusWindow(focusRes.data.data);
            setProductivityScore(scoreRes.data);
            setIntelligence(intelligenceRes.data);
            setAiInsight(insightRes.data.insight);
         } catch (error) {
            console.error('Error fetching analytics data:', error);
         } finally {
            setLoading(false);
         }
      };

      const timer = setTimeout(() => {
         fetchAnalyticsData();
      }, 500); // Debounce search

      return () => clearTimeout(timer);
   }, [dateRange, searchQuery]);

   const metrics = [
      { label: 'Total', value: stats.total, sub: 'Tasks Created', icon: '📊', color: 'text-[#7d8dff]' },
      { label: 'Done', value: stats.completed, sub: 'Completed', icon: '✅', color: 'text-[#3ac4ff]' },
      { label: 'Wait', value: stats.pending, sub: 'Pending', icon: '⏳', color: 'text-[#aeb3ff]' },
      { label: 'Urgent', value: stats.priorities.high, sub: 'High Priority', icon: '❗️', color: 'text-[#ff4d4d]' },
      { label: 'Normal', value: stats.priorities.medium, sub: 'Medium', icon: '⏱️', color: 'text-white' },
      { label: 'Low', value: stats.priorities.low, sub: 'Low Priority', icon: '⚡', color: 'text-[#7d8dff]' },
   ];

   return (
      <div className="space-y-12 pb-32">
         {/* Analytics Sub-Header Section */}
         <div className="flex flex-wrap items-center justify-between gap-10">
            <div className="flex flex-wrap items-center gap-6">
               <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-white transition-colors">🔍</span>
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Filter insights..."
                     className="w-80 rounded-2xl border border-white/5 bg-white/[0.03] py-3.5 pl-12 pr-4 text-[11px] font-bold text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  />
               </div>
               <div className="flex items-center gap-3 px-6 py-2 bg-white/[0.03] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Timeframe</span>
                  <select
                     value={dateRange}
                     onChange={(e) => setDateRange(e.target.value)}
                     className="bg-transparent text-[10px] font-black uppercase tracking-widest text-[#7d8dff] outline-none cursor-pointer"
                  >
                     <option value="today" className="bg-[#05070a]">Today</option>
                     <option value="this_week" className="bg-[#05070a]">Weekly</option>
                     <option value="this_month" className="bg-[#05070a]">Monthly</option>
                     <option value="all_time" className="bg-[#05070a]">Archive</option>
                  </select>
               </div>
            </div>
            <div className="h-px flex-1 mx-10 bg-white/5 hidden xl:block" />
         </div>

         {/* Hero Intelligence Cards */}
         <div className="grid grid-cols-12 gap-10">
            {/* Productivity Intelligence */}
            <div className="col-span-8 group relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-16 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
               <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#7d8dff]/05 to-transparent pointer-events-none opacity-50" />
               <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#c084fc]/03 rounded-full blur-[100px] pointer-events-none" />

               <div className="space-y-12 relative z-10">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center text-2xl shadow-2xl">🧠</div>
                     <div>
                        <h3 className="text-3xl font-bold tracking-tight text-white">Neural Efficiency Engine</h3>
                        <p className="text-[15px] text-slate-400 mt-2 leading-relaxed max-w-2xl font-medium">
                           {intelligence.analysis_summary}
                        </p>
                     </div>
                  </div>

                  <div className="flex gap-20">
                     <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Efficiency Quotient</p>
                        <div className="flex items-end gap-4">
                           <span className="text-7xl font-bold tracking-tighter text-white tabular-nums">{productivityScore.score}%</span>
                           <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black mb-3 ${productivityScore.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'}`}>
                              {productivityScore.trend.startsWith('+') ? '↑' : '↓'} {productivityScore.trend}
                           </div>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Kernel Stability</p>
                        <div className="flex items-end gap-6">
                           <span className="text-7xl font-bold tracking-tighter text-white tabular-nums">{intelligence.ai_efficiency_score}</span>
                           <span className="text-[10px] font-black text-[#c084fc] uppercase tracking-[0.3em] mb-4 border-b border-[#c084fc]/30 pb-1">{intelligence.behavioral_pattern}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Next Milestone */}
            <div className="col-span-4 group relative overflow-hidden rounded-[4rem] border border-white/10 bg-[#ffffff]/[0.02] p-12 flex flex-col items-center justify-center text-center space-y-10 shadow-2xl backdrop-blur-3xl transition-all hover:border-white/20">
               <div className="w-24 h-24 rounded-[2.5rem] bg-white text-black flex items-center justify-center text-4xl shadow-[0_20px_50px_-10px_rgba(255,255,255,0.3)] relative group-hover:scale-110 transition-transform duration-700">
                  ⭐
                  <div className="absolute inset-0 rounded-[2.5rem] bg-white blur-2xl opacity-20" />
               </div>
               <div>
                  <h4 className="text-2xl font-bold text-white">Neural Milestone</h4>
                  <p className="text-[13px] text-slate-500 mt-3 leading-relaxed font-medium">Complete 4 more high-priority tasks to reach <span className="text-white font-bold italic">"Cognitive Master"</span> status.</p>
               </div>
               <div className="w-full space-y-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                     <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.completed / Math.max(stats.total, 1)) * 100}%` }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-[#7d8dff] to-[#c084fc] rounded-full shadow-[0_0_15px_rgba(125,141,255,0.4)]"
                     />
                  </div>
                  <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">{stats.completed} / {stats.total} Objectives Synchronized</p>
               </div>
            </div>
         </div>

         {/* Metrics Row */}
         <div className="grid grid-cols-6 gap-8">
            {metrics.map((m, i) => (
               <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 space-y-6 hover:bg-white/[0.06] hover:border-white/10 transition-all shadow-xl backdrop-blur-md"
               >
                  <div className="flex justify-between items-center relative z-10">
                     <div className="w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">{m.icon}</div>
                     <span className={`text-[8px] font-black ${m.color} uppercase tracking-[0.3em]`}>{m.label}</span>
                  </div>
                  <div className="relative z-10">
                     <p className="text-4xl font-bold text-white tracking-tighter tabular-nums">{m.value}</p>
                     <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-2 group-hover:text-slate-500 transition-colors">{m.sub}</p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-white/[0.02] rounded-full blur-2xl transition-all group-hover:bg-white/[0.05]" />
               </motion.div>
            ))}
         </div>

         {/* Charts Section */}
         <div className="grid grid-cols-12 gap-10">
            {/* Productivity Trends */}
            <div className="col-span-8 rounded-[4rem] border border-white/5 bg-white/[0.02] p-16 space-y-12 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7d8dff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

               <div className="flex justify-between items-end">
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold tracking-tight text-white">Execution Momentum</h3>
                     <p className="text-[13px] text-slate-500 font-medium italic">Temporal mapping of neural resolution frequency</p>
                  </div>
                  <div className="bg-white/[0.03] p-1.5 rounded-2xl flex gap-1 border border-white/5">
                     <button className="px-5 py-2 text-[9px] font-black bg-white text-black rounded-xl uppercase tracking-widest transition-all">Periodic</button>
                     <button className="px-5 py-2 text-[9px] font-black text-slate-600 hover:text-white rounded-xl uppercase tracking-widest transition-all">Epochs</button>
                  </div>
               </div>

               <div className="h-80 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={trends}>
                        <defs>
                           <linearGradient id="colorTrends" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#7d8dff" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#7d8dff" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis
                           dataKey="day"
                           axisLine={false}
                           tickLine={false}
                           tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                           dy={20}
                        />
                        <YAxis hide />
                        <Tooltip
                           contentStyle={{
                              backgroundColor: '#0a0d14',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '24px',
                              padding: '16px',
                              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                           }}
                           itemStyle={{ color: '#7d8dff', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                           labelStyle={{ color: '#475569', fontSize: '10px', fontWeight: 900, marginBottom: '8px', letterSpacing: '0.2em' }}
                           cursor={{ stroke: '#7d8dff', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                           type="monotone"
                           dataKey="completed"
                           stroke="#7d8dff"
                           strokeWidth={4}
                           fillOpacity={1}
                           fill="url(#colorTrends)"
                           animationDuration={2000}
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Distribution & Density */}
            <div className="col-span-4 space-y-10">
               <div className="rounded-[4rem] border border-white/5 bg-white/[0.02] p-12 space-y-10 relative overflow-hidden shadow-2xl backdrop-blur-3xl group">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Distribution</h3>

                  <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={[
                                 { name: 'Resolved', value: stats.completed },
                                 { name: 'Pending', value: stats.pending }
                              ]}
                              innerRadius={75}
                              outerRadius={95}
                              paddingAngle={8}
                              dataKey="value"
                              stroke="none"
                           >
                              <Cell fill="#7d8dff" className="drop-shadow-[0_0_15px_rgba(125,141,255,0.4)]" />
                              <Cell fill="rgba(255,255,255,0.03)" />
                           </Pie>
                           <Tooltip
                              contentStyle={{ backgroundColor: '#0a0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                              itemStyle={{ color: '#7d8dff', fontSize: '10px', fontWeight: 900 }}
                           />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold text-white tabular-nums">{stats.total}</span>
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Aggregate</span>
                     </div>
                  </div>

                  <div className="space-y-4 pt-6">
                     <div className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-[#7d8dff] shadow-[0_0_8px_rgba(125,141,255,0.5)]" />
                           <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover/item:text-white transition-colors">Success Velocity</span>
                        </div>
                        <span className="text-[11px] font-black text-white tabular-nums">{Math.round((stats.completed / Math.max(stats.total, 1)) * 100)}%</span>
                     </div>
                     <div className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-white/[0.05]" />
                           <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest group-hover/item:text-slate-400 transition-colors">Queued Load</span>
                        </div>
                        <span className="text-[11px] font-black text-slate-500 tabular-nums">{stats.pending}</span>
                     </div>
                  </div>

                  {/* AI Assistant Bubble */}
                  <div className="mt-10 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col gap-6 group/ai hover:bg-white/[0.06] transition-all relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-[#7d8dff]/10 rounded-full blur-2xl group-hover/ai:bg-[#7d8dff]/20 transition-colors" />
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl">🤖</div>
                        <p className="text-[10px] font-black text-[#7d8dff] uppercase tracking-[0.2em]">System Insight</p>
                     </div>
                     <p className="text-[13px] font-medium text-slate-400 italic leading-relaxed group-hover/ai:text-white transition-colors relative z-10">"{aiInsight}"</p>
                  </div>
               </div>

               <div className="rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-10 space-y-10 shadow-2xl backdrop-blur-3xl">
                  <div className="flex justify-between items-center">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Stability Matrix</h3>
                     <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${(stats.priorities?.high + stats.overdue) > 5 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10' :
                        (stats.priorities?.high + stats.overdue) > 2 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                        }`}>
                        {(stats.priorities?.high + stats.overdue) > 5 ? 'Overload' :
                           (stats.priorities?.high + stats.overdue) > 2 ? 'High Tension' : 'Stable'}
                     </span>
                  </div>

                  <div className="space-y-10">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-600">Priority Density</span>
                           <span className="text-[#7d8dff]">{Math.round((stats.priorities?.high / Math.max(stats.total, 1)) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                           <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stats.priorities?.high / Math.max(stats.total, 1)) * 100}%` }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                              className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                           />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-600">Deadlock Pressure</span>
                           <span className="text-rose-500">{Math.round((stats.overdue / Math.max(stats.total, 1)) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                           <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stats.overdue / Math.max(stats.total, 1)) * 100}%` }}
                              transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                              className="h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Footer Overhaul */}
         <footer className="pt-24 border-t border-white/5 flex flex-wrap justify-between items-center gap-12 group">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-black font-black text-[10px]">FM</div>
                  <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#7d8dff] transition-colors">FlowMind</h2>
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">© 2024 Cognitive Architectures. Engineered in SF.</p>
            </div>
            <nav className="flex gap-12">
               {['Privacy', 'Terms', 'API', 'Changelog'].map(link => (
                  <a key={link} href="#" className="text-[10px] font-black text-slate-700 hover:text-white transition-colors uppercase tracking-[0.2em]">{link}</a>
               ))}
            </nav>
         </footer>
      </div>
   );
};

export default Analytics;
