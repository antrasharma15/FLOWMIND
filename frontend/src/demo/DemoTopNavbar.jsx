import React from 'react';
import { useDemo } from './DemoContext';

const DemoTopNavbar = () => {
  const { avatar } = useDemo();

  return (
    <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 bg-[#05070a]/80 backdrop-blur-3xl z-40">
      <div className="flex items-center gap-6">
        <div className="relative w-full max-w-sm group hidden md:block">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input 
            type="text" 
            placeholder="Search simulation context..." 
            readOnly
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[11px] font-bold text-white focus:outline-none transition-all cursor-not-allowed placeholder:text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active Simulation</span>
        </div>
        
        <div className="h-8 w-[1px] bg-white/5 hidden sm:block" />
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-white uppercase tracking-tighter">Demo User</p>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Guest Node</p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border border-white/10 p-1 overflow-hidden shadow-2xl">
             <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-lg md:rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoTopNavbar;
