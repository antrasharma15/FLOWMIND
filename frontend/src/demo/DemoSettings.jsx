import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from './DemoContext';

const DemoSettings = () => {
  const { aiMode, setAiMode, uiDensity, setUiDensity, avatar } = useDemo();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl space-y-8 md:space-y-12">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm md:text-base text-white/40">Customize your simulated experience.</p>
      </header>

      {/* Profile Section */}
      <section className="group relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.02] rounded-full blur-[80px]" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[3rem] border border-white/10 p-1.5 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
            <img src={avatar} alt="Demo Avatar" className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem]" />
          </div>
          <div className="text-center md:text-left space-y-3 md:space-y-4 flex-1">
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Demo User</h3>
            <p className="text-[12px] md:text-[13px] font-black text-slate-500 uppercase tracking-widest">guest@flowmind.simulation</p>
            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-5 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
                Verified Simulation Node
              </span>
              <span className="px-5 py-2 bg-white/[0.05] border border-white/5 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Tier: Enterprise Explorer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Preferences */}
      <section className="rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-3xl space-y-8 md:space-y-12">
        <div className="space-y-3">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner">🧠</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">AI Productivity Mode</h3>
           </div>
           <p className="text-base md:text-lg text-slate-400 font-medium italic leading-relaxed max-w-2xl">
              Switch modes to see how the AI recommendations and dashboard insights change dynamically in this simulation.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {['Focused', 'Balanced', 'Relaxed'].map(mode => (
            <button
              key={mode}
              onClick={() => setAiMode(mode)}
              className={`p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border transition-all text-left relative overflow-hidden group ${aiMode === mode ? 'bg-white text-black border-white shadow-2xl scale-[1.02]' : 'bg-white/[0.02] border-white/5 text-slate-500 hover:bg-white/[0.05] hover:border-white/10'}`}
            >
              {aiMode === mode && <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-200 opacity-100" />}
              
              <div className="relative z-10 space-y-6 md:space-y-8">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-colors ${aiMode === mode ? 'bg-black/5' : 'bg-white/5'}`}>
                   {mode === 'Focused' ? '🎯' : mode === 'Balanced' ? '⚖️' : '🌴'}
                 </div>
                 <div className="space-y-2">
                    <h4 className={`text-xl font-bold tracking-tight ${aiMode === mode ? 'text-black' : 'text-white'}`}>{mode}</h4>
                    <p className={`text-[9px] font-black uppercase tracking-widest leading-tight ${aiMode === mode ? 'text-black/60' : 'text-slate-600'}`}>
                      {mode === 'Focused' ? 'Minimize distractions' : mode === 'Balanced' ? 'Steady momentum' : 'Stress-free workflow'}
                    </p>
                 </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* UI Density */}
      <section className="rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-3xl space-y-8 md:space-y-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner">👁️</div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Interface Density</h3>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 p-2 bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] w-fit">
          {['Compact', 'Balanced', 'Spacious'].map(density => (
            <button
              key={density}
              onClick={() => setUiDensity(density)}
              className={`px-8 md:px-10 py-3 md:py-3.5 rounded-[1rem] md:rounded-[2rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${uiDensity === density ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {density}
            </button>
          ))}
        </div>
      </section>

      {/* Logout Simulation */}
      <section className="rounded-[2.5rem] md:rounded-[4rem] border border-red-500/10 bg-red-500/[0.02] p-8 md:p-12 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl backdrop-blur-3xl">
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-red-500 tracking-tight">Deactivate Simulation</h3>
          <p className="text-[11px] md:text-[12px] font-black text-red-500/40 uppercase tracking-widest">Active neural node will be disconnected</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-10 py-4.5 bg-red-500 text-white rounded-[1.5rem] md:rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Terminate Sync
        </button>
      </section>
    </div>
  );
};

export default DemoSettings;
