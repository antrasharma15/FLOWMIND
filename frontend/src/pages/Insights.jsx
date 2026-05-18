import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

const Insights = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [overview, setOverview] = useState(null);
  const [focusScore, setFocusScore] = useState({ score: 0, label: 'Stable', trend: 'up' });
  const [burnoutData, setBurnoutData] = useState({ risk_level: 'Low', recovery_recommendation: '', workload_advice: '' });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Agent');

  useEffect(() => {
    fetchInsights();

    const handleProfileUpdate = () => {
      setUsername(localStorage.getItem('username') || 'Agent');
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  const fetchInsights = async () => {
    try {
      const [reportRes, overviewRes, focusRes, burnoutRes, predictRes] = await Promise.all([
        api.get('/insights/report'),
        api.get('/insights/overview'),
        api.get('/analytics/focus-score'),
        api.get('/ai/burnout-analysis'),
        api.post('/ai/predict')
      ]);
      setReport(reportRes.data.data);
      setOverview(overviewRes.data.data);
      setFocusScore(focusRes.data);
      setBurnoutData(burnoutRes.data);
      setPrediction(predictRes.data);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      await api.post('/tasks/optimize');
      // Trigger update event for dashboard
      window.dispatchEvent(new Event('tasks-updated'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Optimization failed:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Optimization protocol failed.';
      alert(errorMsg);
    } finally {
      setOptimizing(false);
    }
  };

  const handleApplySchedule = async () => {
    try {
      setScheduling(true);
      const res = await api.post('/ai/schedule');

      // Notify user of the recommendation
      const summary = res.data.summary || 'AI Schedule applied successfully.';
      alert(`AI Scheduling: ${summary}`);

      // Trigger update event for dashboard
      window.dispatchEvent(new Event('tasks-updated'));

      // Dispatch a custom event for the specific priority message if dashboard listens to it
      window.dispatchEvent(new CustomEvent('ai-prioritized', {
        detail: { message: summary }
      }));

      navigate('/dashboard');
    } catch (error) {
      console.error('Scheduling failed:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Scheduling protocol failed.';
      alert(errorMsg);
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="w-16 h-16 rounded-full border-4 border-[#7d8dff]/20 border-t-[#7d8dff] animate-spin"></div>
        <p className="text-sm font-bold text-[#7d8dff] animate-pulse uppercase tracking-widest">Consulting Gemini Neural Network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-32">
      {/* Hero Welcome Section - Cinematic Overhaul */}
      <section className="relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-16 shadow-2xl backdrop-blur-3xl group">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#7d8dff]/10 via-transparent to-transparent pointer-events-none opacity-50" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#c084fc]/05 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="w-40 h-40 rounded-[3rem] bg-white text-black flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(255,255,255,0.3)] relative group-hover:scale-105 transition-transform duration-700">
              <span className="text-6xl group-hover:rotate-12 transition-transform">✨</span>
              <div className="absolute inset-0 rounded-[3rem] bg-white blur-2xl opacity-20" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[9px] font-black text-[#7d8dff] uppercase tracking-[0.4em]">Kernel Sync</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{overview?.optimization_status || 'Optimized'}</p>
            </div>
          </div>
          <div className="space-y-8 flex-1">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-6xl font-bold tracking-tight text-white">System Sync, <span className="text-gradient">{overview?.user_name || username}</span></h1>
              <p className="text-2xl text-slate-400 max-w-3xl leading-relaxed font-medium italic">
                "{overview?.summary || "Your workload is being analyzed for optimal cognitive flow."}"
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <div className="px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3 transition-colors hover:bg-white/[0.06]">
                <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${overview?.burnout_status === 'Low' ? 'bg-emerald-500 shadow-emerald-500/50' : overview?.burnout_status === 'Moderate' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-rose-500 shadow-rose-500/50'}`} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stability Index: {overview?.burnout_status || 'Analyzing'}</span>
              </div>
              <div className="px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3 transition-colors hover:bg-white/[0.06]">
                <div className="w-2 h-2 rounded-full bg-[#7d8dff] shadow-[0_0_8px_rgba(125,141,255,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency: {overview?.focus_score}%</span>
              </div>
              <div className="px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3 transition-colors hover:bg-white/[0.06]">
                <div className="w-2 h-2 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode: {overview?.productivity_state}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Insights Content */}
      <div className="grid grid-cols-12 gap-12">

        {/* Left Column (8 cols) */}
        <div className="col-span-8 space-y-16">

          {/* Smart Recommendations */}
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">AI Strategy Core</h3>
              <div className="h-px flex-1 mx-8 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="group relative overflow-hidden rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl transition-all hover:bg-white/[0.06] hover:border-[#ff4d4d]/20 shadow-2xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff4d4d]/05 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-center mb-10">
                  <span className="px-4 py-1.5 bg-[#ff4d4d]/10 text-[#ff4d4d] text-[10px] font-black rounded-xl border border-[#ff4d4d]/10 uppercase tracking-widest">Urgent Adjustment</span>
                  <span className="text-xl opacity-30 group-hover:opacity-100 transition-opacity">📈</span>
                </div>
                <div className="space-y-4 mb-10">
                  <h4 className="text-2xl font-bold text-white">Optimization Protocol</h4>
                  <p className="text-[15px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{report?.recommendation}</p>
                </div>
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl"
                >
                  {optimizing ? 'Executing Protocol...' : 'Adjust Dashboard'}
                </button>
              </div>

              <div className="group relative overflow-hidden rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl transition-all hover:bg-white/[0.06] hover:border-[#7d8dff]/20 shadow-2xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7d8dff]/05 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-center mb-10">
                  <span className="px-4 py-1.5 bg-[#7d8dff]/10 text-[#7d8dff] text-[10px] font-black rounded-xl border border-[#7d8dff]/10 uppercase tracking-widest">Smart Schedule</span>
                  <span className="text-xl opacity-30 group-hover:opacity-100 transition-opacity">📅</span>
                </div>
                <div className="space-y-4 mb-10">
                  <h4 className="text-2xl font-bold text-white">Neural Realignment</h4>
                  <p className="text-[15px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{report?.smart_move || "No scheduling shifts recommended at this time."}</p>
                </div>
                <button
                  onClick={handleApplySchedule}
                  disabled={scheduling}
                  className="w-full py-4 bg-[#7d8dff] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[#7d8dff]/20"
                >
                  {scheduling ? 'Syncing Schedule...' : 'Apply Alignment'}
                </button>
              </div>
            </div>
          </div>

          {/* Productivity Analysis Section */}
          <div className="rounded-[4rem] border border-white/5 bg-white/[0.02] p-16 shadow-2xl backdrop-blur-3xl space-y-12 relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#c084fc]/03 rounded-full blur-[100px] pointer-events-none" />
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold tracking-tight text-white">Productivity Matrix</h3>
              <div className="px-4 py-2 bg-white/[0.05] rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Forecast</div>
            </div>

            <div className="space-y-10">
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                {prediction?.neural_outlook || "Analyzing your cognitive workload and historical performance patterns..."}
              </p>

              {prediction && (
                <div className="grid grid-cols-2 gap-10">
                  <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4 hover:bg-white/[0.05] transition-all group">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Completion probability</p>
                    <p className="text-5xl font-bold text-[#7d8dff] tabular-nums group-hover:scale-105 transition-transform origin-left">{prediction.completion_probability}</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4 hover:bg-white/[0.05] transition-all group">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Objective Risk</p>
                    <p className={`text-5xl font-bold tabular-nums group-hover:scale-105 transition-transform origin-left ${prediction.deadline_risk === 'High' ? 'text-[#ff4d4d]' : prediction.deadline_risk === 'Moderate' ? 'text-amber-500' : 'text-emerald-400'}`}>
                      {prediction.deadline_risk}
                    </p>
                  </div>
                </div>
              )}

              <div className="p-10 rounded-[3rem] bg-white/[0.04] border border-white/10 shadow-inner group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-[#c084fc]/20 flex items-center justify-center text-[#c084fc]">✨</div>
                  <h5 className="text-[11px] font-black text-[#c084fc] uppercase tracking-[0.2em]">Neural Intelligence Projection</h5>
                </div>
                <p className="text-lg text-slate-300 font-medium italic leading-relaxed group-hover:text-white transition-colors">"{prediction?.prediction_message || "Synchronizing with your productivity patterns..."}"</p>
                {prediction && (
                  <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Projected Weekly Resolution</span>
                    <span className="text-2xl font-bold text-white tabular-nums">{prediction.weekly_estimate} Objectives</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) - Side Intelligence */}
        <div className="col-span-4 space-y-10">

          {/* Intelligence Section */}
          <div className="rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-12 space-y-12 backdrop-blur-3xl shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Core Metrics</h3>

            <div className="space-y-12">
              {/* Focus Score */}
              <div className="flex items-center gap-8 group">
                <div className="relative w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="44" fill="none" stroke="white" strokeWidth="4" className="opacity-5" />
                    <circle cx="48" cy="48" r="44" fill="none" stroke="#7d8dff" strokeWidth="4" strokeDasharray={`${focusScore.score * 2.76} 276`} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(125,141,255,0.5)]" />
                  </svg>
                  <span className="absolute text-2xl font-bold text-white tabular-nums">{focusScore.score}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-300 mb-1">Focus Score</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${focusScore.label === 'Optimized' ? 'text-[#7d8dff]' : focusScore.label === 'Stable' ? 'text-emerald-400' : 'text-[#ff4d4d]'}`}>
                    {focusScore.label}
                  </p>
                </div>
              </div>

              {/* Burnout Risk */}
              <div className="flex items-center gap-8 group">
                <div className="relative w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="44" fill="none" stroke="white" strokeWidth="4" className="opacity-5" />
                    <circle cx="48" cy="48" r="44" fill="none" stroke={burnoutData.risk_level === 'High' ? '#ff4d4d' : burnoutData.risk_level === 'Moderate' ? '#f59e0b' : '#10b981'} strokeWidth="4" strokeDasharray={`${(burnoutData.risk_level === 'High' ? 85 : burnoutData.risk_level === 'Moderate' ? 55 : 25) * 2.76} 276`} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                  </svg>
                  <span className="absolute text-[10px] font-black text-white uppercase tracking-widest">{burnoutData.risk_level}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-300 mb-1">Stability Level</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tighter max-w-[140px]">{burnoutData.workload_advice || "Optimal workload detected"}</p>
                </div>
              </div>

              {/* AI Advice Bubble */}
              <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col gap-6 group hover:bg-white/[0.06] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🧠</div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Recovery</p>
                </div>
                <p className="text-[13px] font-medium text-slate-400 italic leading-relaxed group-hover:text-white transition-colors">
                  "{burnoutData.recovery_recommendation || "Maintain current cognitive balance for peak execution."}"
                </p>
              </div>
            </div>
          </div>

          {/* Peak Flow Chart Placeholder */}
          <div className="rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-12 space-y-10 backdrop-blur-3xl shadow-2xl overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7d8dff]/03 rounded-full blur-[80px]" />
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-lg">🧘</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Balance</h3>
            </div>

            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Stress Profile</span>
                  <span className={`text-[10px] font-black uppercase ${report?.burnout_risk === 'High' ? 'text-[#ff4d4d]' : 'text-emerald-400'}`}>{report?.burnout_risk === 'High' ? 'High' : 'Managed'}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: report?.burnout_risk === 'High' ? '85%' : '35%' }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Recovery Momentum</span>
                  <span className="text-[10px] font-black uppercase text-[#7d8dff]">Optimal</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-[#7d8dff] to-[#c084fc] rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/[0.04] border border-white/5 rounded-[2.5rem] group-hover:bg-white/[0.06] transition-colors relative z-10">
              <p className="text-xs font-medium text-slate-500 leading-relaxed italic group-hover:text-slate-300 transition-colors">
                <span className="text-[#7d8dff] font-black not-italic uppercase tracking-widest text-[9px] mr-2">Pro Insight:</span> {report?.smart_move}
              </p>
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

export default Insights;
