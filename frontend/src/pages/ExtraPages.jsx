import React from 'react';
import { motion } from 'framer-motion';

const PlaceholderPage = ({ title, icon, color }) => (
  <div className="space-y-10">
    <div className="flex justify-between items-end">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-bold tracking-tight mb-4"
        >
          {title}
        </motion.h1>
        <p className="text-white/50 max-w-lg leading-relaxed">
          The {title.toLowerCase()} module is being optimized for your neural workflow. 
          Expect deep cognitive resonance in the next cycle.
        </p>
      </div>
      <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-4xl shadow-xl">
        {icon}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#121626]/40 border border-white/5 rounded-[2rem] p-10 h-64 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
          <div className="w-12 h-12 rounded-full border border-white/10 mb-6 flex items-center justify-center opacity-20">
             {icon}
          </div>
          <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${30 + i * 20}%` }}
              className={`h-full bg-current ${color.replace('from-', 'text-')}`}
             />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Analytics = () => <PlaceholderPage title="Analytics" icon="📈" color="from-[#3ac4ff]" />;
export const Insights = () => <PlaceholderPage title="AI Insights" icon="🧠" color="from-[#7d8dff]" />;
export const Settings = () => <PlaceholderPage title="Settings" icon="⚙️" color="from-gray-500" />;
