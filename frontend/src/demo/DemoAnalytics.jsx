import React from 'react';
import { motion } from 'framer-motion';
import { useDemo } from './DemoContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DemoAnalytics = () => {
  const { stats, tasks } = useDemo();

  const completionData = [
    { name: 'Mon', completed: 4 },
    { name: 'Tue', completed: 3 },
    { name: 'Wed', completed: 7 },
    { name: 'Thu', completed: 5 },
    { name: 'Fri', completed: 8 },
    { name: 'Sat', completed: 2 },
    { name: 'Sun', completed: 3 },
  ];

  const distributionData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending },
  ];

  const COLORS = ['#7d8dff', 'rgba(125, 141, 255, 0.1)'];

  return (
    <div className="space-y-8 md:space-y-12">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Analytics</h1>
        <p className="text-sm md:text-base text-white/40">Detailed performance metrics derived from simulated activity.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        {/* Weekly Progress */}
        <div className="lg:col-span-8 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 space-y-8 md:space-y-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Weekly Task Resolution</h3>
           </div>
           
           <div className="h-64 md:h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={completionData}>
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
                       cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                       contentStyle={{ 
                          backgroundColor: '#0a0d14', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '24px',
                          padding: '16px',
                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                       }}
                       itemStyle={{ color: '#7d8dff', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                       labelStyle={{ color: '#475569', fontSize: '10px', fontWeight: 900, marginBottom: '8px', letterSpacing: '0.2em' }}
                    />
                    <Bar dataKey="completed" fill="#7d8dff" radius={[12, 12, 12, 12]} barSize={24} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Task Distribution */}
        <div className="lg:col-span-4 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 flex flex-col items-center shadow-2xl backdrop-blur-3xl space-y-8">
           <div className="flex items-center gap-4 self-start">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Workload Distribution</h3>
           </div>
           
           <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={distributionData}
                       innerRadius={70}
                       outerRadius={90}
                       paddingAngle={8}
                       dataKey="value"
                       stroke="none"
                    >
                       {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip
                       contentStyle={{ 
                          backgroundColor: '#0a0d14', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '20px',
                          padding: '12px'
                       }}
                    />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter">{stats.total}</span>
                 <span className="text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest mt-1">Objectives</span>
              </div>
           </div>

           <div className="w-full space-y-6 md:space-y-8">
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Efficiency Threshold</span>
                    <span className="text-sm font-black text-white">{Math.round((stats.completed / stats.total) * 100)}%</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
                       className="h-full bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                       transition={{ duration: 1.5, ease: "circOut" }}
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Avg Effort', value: '3.2h', sub: 'Per Task' },
          { label: 'Efficiency', value: '+14%', sub: 'vs last week' },
          { label: 'Consistency', value: 'High', sub: 'Last 7 days' },
          { label: 'Growth', value: '2.4%', sub: 'Productivity' },
        ].map((m, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 md:p-10 text-center transition-all hover:bg-white/[0.04] hover:border-white/10 shadow-xl backdrop-blur-3xl">
            <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 group-hover:text-slate-400 transition-colors">{m.label}</p>
            <h4 className="text-2xl md:text-4xl font-black text-white tracking-tighter tabular-nums group-hover:scale-110 transition-transform duration-500">{m.value}</h4>
            <p className="text-[9px] md:text-[10px] font-black text-[#7d8dff] uppercase tracking-widest mt-2 md:mt-3 group-hover:tracking-[0.4em] transition-all">{m.sub}</p>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.04] transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoAnalytics;
