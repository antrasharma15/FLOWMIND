import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data.data);
    } catch (error) {
      console.error('Error fetching task details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeTask = async () => {
    setAnalyzing(true);
    try {
      const response = await api.post(`/tasks/${id}/analyze`);
      setTask({ ...task, ai_analysis: response.data.data });
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task intelligence?')) {
      try {
        await api.delete(`/tasks/${id}`);
        navigate('/dashboard');
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d8dff]"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="text-6xl animate-pulse">🔎</div>
        <h1 className="text-2xl font-bold opacity-50">Task intelligence not found</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold transition-all hover:bg-white/10"
        >
          Return to Nexus
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-32">
      {/* Cinematic Header */}
      <header className="flex flex-wrap items-center justify-between gap-10 pb-12 border-b border-white/5 relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#7d8dff]/03 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-10 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all group active:scale-95 shadow-2xl"
          >
            <span className="text-2xl transition-transform group-hover:-translate-x-1">←</span>
          </button>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border tracking-[0.2em] uppercase ${task.priority === 'HIGH PRIORITY' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-[#7d8dff]/10 text-[#7d8dff] border-[#7d8dff]/20'}`}>
                {task.priority}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.due}</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white leading-[1.1]">{task.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <button
            onClick={handleToggleStatus}
            className={`px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl active:scale-95 ${task.status === 'COMPLETED' ? 'bg-[#7d8dff] text-black shadow-[0_20px_50px_-10px_rgba(125,141,255,0.4)]' : 'bg-white/[0.05] text-white border border-white/10 hover:bg-white/[0.1]'}`}
          >
            {task.status === 'COMPLETED' ? 'Synchronized' : 'Execute Sync'}
          </button>
          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:border-rose-500/20 active:scale-95"
          >
            <span className="text-lg">🗑️</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8 space-y-12">
          {/* Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-16 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]"
          >
            <div className="space-y-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Node Overview</h3>
              <p className="text-2xl text-slate-300 leading-relaxed max-w-3xl font-medium italic">
                "{task.desc || "No detailed description provided for this neural objective."}"
              </p>
            </div>

            <div className="grid grid-cols-4 gap-12 pt-16 mt-16 border-t border-white/5">
              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Intensity</p>
                <p className="text-xl font-bold text-white tracking-tight">{task.priority.split(' ')[0]}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Temporal</p>
                <p className="text-xl font-bold text-white tracking-tight">{task.due || 'Open'}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Topology</p>
                <p className="text-xl font-bold text-white tracking-tight">{task.ai_analysis?.complexity || 'Stable'}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Quantum</p>
                <p className="text-xl font-bold text-white tracking-tight">{task.ai_analysis?.estimated_time || 'Variable'}</p>
              </div>
            </div>
          </motion.div>

          {/* AI Breakdown Card */}
          <div className="group relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-16 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Atomic Resolution</h3>
              <button
                onClick={handleAnalyzeTask}
                disabled={analyzing}
                className={`px-8 py-3 bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-white hover:text-black ${analyzing ? 'animate-pulse cursor-wait' : ''}`}
              >
                {analyzing ? '🤖 Parsing...' : '✨ Re-Project'}
              </button>
            </div>

            <div className="space-y-4">
              {task.ai_analysis?.subtasks ? task.ai_analysis.subtasks.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-8 p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all group/step"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-[10px] font-black text-[#7d8dff] group-hover/step:bg-white group-hover/step:text-black transition-colors shadow-inner">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <span className="text-[15px] font-bold text-slate-400 group-hover/step:text-white transition-colors">{step}</span>
                </motion.div>
              )) : (
                <div className="py-20 text-center space-y-10">
                  <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto text-3xl">🧩</div>
                  <p className="text-[13px] text-slate-600 font-medium italic">Gemini hasn't resolved the atomic breakdown for this node.</p>
                  <button
                    onClick={handleAnalyzeTask}
                    className="px-12 py-5 bg-white text-black rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-transform hover:scale-105 active:scale-95"
                  >
                    🚀 Resolve Breakdown
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-12">
          {/* Focus Intelligence Panel */}
          <div className="group relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-12 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7d8dff]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />

            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-[#7d8dff]/10 flex items-center justify-center text-xl text-[#7d8dff] shadow-inner">💡</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Insight</h3>
            </div>

            <div className="space-y-8">
              <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
                "{task.ai_analysis?.focus_tip || "Calculating the optimal cognitive strategy for this neural objective..."}"
              </p>
              <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#7d8dff] animate-pulse" />
                <p className="text-[11px] font-black text-[#7d8dff] uppercase tracking-widest italic">{task.aiLabel || 'Kernel Analysis Active'}</p>
              </div>
            </div>
          </div>

          {/* Neural Impact Visualization */}
          <div className="group relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-12 flex flex-col items-center justify-center text-center space-y-10 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 self-start">Neural Resolution</h3>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="128" cy="128" r="115" fill="none" stroke="currentColor" strokeWidth="16" className="text-white/[0.02]" />
                <motion.circle
                  initial={{ strokeDasharray: "0 1000" }}
                  animate={{ strokeDasharray: task.status === 'COMPLETED' ? "722 1000" : "180 1000" }}
                  transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
                  cx="128" cy="128" r="115" fill="none" stroke="url(#neuralGradient)" strokeWidth="16" strokeLinecap="round"
                  className="drop-shadow-[0_0_20px_rgba(125,141,255,0.4)]"
                />
                <defs>
                  <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7d8dff" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center text-center px-4">
                <span className="text-7xl font-bold tracking-tighter text-white tabular-nums">{task.status === 'COMPLETED' ? '100' : '25'}<span className="text-3xl text-slate-600">%</span></span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2">Resolved</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic max-w-[180px]">
              {task.status === 'COMPLETED' ? 'Nexus synchronization complete. High fidelity resolution achieved.' : 'Partial node activation detected. Awaiting synchronization sequence.'}
            </p>
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

export default TaskDetails;
