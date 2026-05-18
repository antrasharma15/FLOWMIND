import React from 'react';
import { motion } from 'framer-motion';
import { useDemo } from './DemoContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DemoDashboard = () => {
  const { stats, tasks, aiMode } = useDemo();

  const mockTrends = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 3 },
    { name: 'Wed', value: 7 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 8 },
    { name: 'Sat', value: 2 },
    { name: 'Sun', value: 3 },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-white/40">Simulated performance metrics and AI focus analysis.</p>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Productivity', value: `${stats.productivityScore}%`, icon: '📈', color: 'text-[#7d8dff]' },
          { label: 'Active Tasks', value: stats.pending, icon: '🎯', color: 'text-[#3ac4ff]' },
          { label: 'High Priority', value: stats.highPriority, icon: '❗️', color: 'text-[#ff4d4d]' },
          { label: 'Completed Today', value: '3', icon: '✅', color: 'text-emerald-400' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 md:p-8 space-y-4 md:space-y-6 hover:bg-white/[0.04] hover:border-white/10 transition-all shadow-xl backdrop-blur-3xl"
          >
            <div className="flex justify-between items-center relative z-10">
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/[0.03] flex items-center justify-center text-lg md:text-xl shadow-inner group-hover:scale-110 transition-transform">{m.icon}</div>
               <span className={`text-[8px] md:text-[9px] font-black ${m.color} uppercase tracking-[0.3em]`}>{m.label}</span>
            </div>
            <div className="relative z-10">
               <p className="text-2xl md:text-4xl font-bold text-white tracking-tighter tabular-nums">{m.value}</p>
               <p className="text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest mt-1 md:mt-2 group-hover:text-slate-500 transition-colors">Real-time Metric</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-16 md:w-20 h-16 md:h-20 bg-white/[0.02] rounded-full blur-2xl transition-all group-hover:bg-white/[0.05]" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        {/* Productivity Chart */}
        <div className="lg:col-span-8 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 space-y-8 md:space-y-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7d8dff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="space-y-2">
                 <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">Execution Momentum</h3>
                 <p className="text-[12px] md:text-[13px] text-slate-500 font-medium italic">Weekly productivity trends vs. AI mode: {aiMode}</p>
              </div>
              <div className="bg-white/[0.03] p-1.5 rounded-2xl flex gap-1 border border-white/5 w-full sm:w-auto">
                 <button className="flex-1 sm:flex-none px-5 py-2 text-[9px] font-black bg-white text-black rounded-xl uppercase tracking-widest transition-all">Periodic</button>
                 <button className="flex-1 sm:flex-none px-5 py-2 text-[9px] font-black text-slate-600 hover:text-white rounded-xl uppercase tracking-widest transition-all">Epochs</button>
              </div>
           </div>
           
           <div className="h-64 md:h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={mockTrends}>
                    <defs>
                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7d8dff" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#7d8dff" stopOpacity={0} />
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis
                       dataKey="name"
                       axisLine={false}
                       tickLine={false}
                       tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                       dy={15}
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
                       dataKey="value"
                       stroke="#7d8dff"
                       strokeWidth={4}
                       fillOpacity={1}
                       fill="url(#colorValue)"
                       animationDuration={2000}
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* AI Insight Card */}
        <div className="lg:col-span-4 group relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04] flex flex-col justify-between">
          <div className="space-y-6 md:space-y-8 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🧠</div>
               <p className="text-[10px] font-black text-[#7d8dff] uppercase tracking-[0.2em]">Executive Insight</p>
            </div>
            <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
              {stats.highPriority > 3
                ? "High workload detected for tomorrow."
                : "Productivity is currently optimal."}
            </h4>
            <p className="text-sm md:text-base text-slate-400 font-medium italic leading-relaxed">
              "{aiMode === 'Focused'
                ? "Prioritizing deep work. Silencing all non-essential notifications."
                : "Maintaining a steady pace. Scheduled breaks every 90 minutes."}"
            </p>
          </div>
          <button className="w-full mt-10 py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl">
            Optimize Schedule
          </button>
        </div>
      </div>

      {/* Quick Tasks */}
      <div className="rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-3xl space-y-8 md:space-y-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Priority Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {tasks.filter(t => t.priority === 'HIGH PRIORITY').slice(0, 3).map((task, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-6 md:p-8 flex items-center justify-between transition-all hover:bg-white/[0.06] hover:border-white/10">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-2 h-2 rounded-full bg-[#ff4d4d] shadow-[0_0_8px_rgba(255,77,77,0.5)]" />
                <span className="text-sm font-bold text-white group-hover:text-[#7d8dff] transition-colors">{task.title}</span>
              </div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest relative z-10 group-hover:text-slate-400 transition-colors">{task.due}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;
