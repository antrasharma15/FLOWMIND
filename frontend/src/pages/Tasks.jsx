import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.patch(`/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task intelligence?')) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => t._id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.desc.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' ||
        (filter === 'High' && task.priority === 'HIGH PRIORITY') ||
        (filter === 'Medium' && task.priority === 'MEDIUM') ||
        (filter === 'Low' && task.priority === 'LOW') ||
        (filter === 'Completed' && task.status === 'COMPLETED');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'Oldest') return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-wrap items-end justify-between gap-10">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Intelligence Queue</h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed">Manage, filter, and analyze your neural objectives through the central nexus.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-white transition-colors">🔍</span>
            <input
              type="text"
              placeholder="Filter objectives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 rounded-2xl border border-white/5 bg-white/[0.03] py-3.5 pl-12 pr-4 text-[11px] font-bold text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
            />
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3.5 bg-white text-black rounded-2xl text-[11px] font-bold shadow-[0_15px_30px_-10px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create Task
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-8 border-y border-white/5 py-8">
        <div className="flex gap-3">
          {['All', 'High', 'Medium', 'Low', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-white text-black border-white shadow-xl' : 'bg-white/[0.03] border-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Sort sequence</span>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none cursor-pointer hover:text-white transition-colors"
            >
              <option value="Newest">Chronological</option>
              <option value="Oldest">Legacy First</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-white/[0.02] border border-white/5 rounded-[3rem] animate-pulse"></div>
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {filteredTasks.map((task, idx) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className={`group relative overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl transition-all hover:bg-white/[0.06] hover:border-white/10 shadow-2xl flex flex-col min-h-[300px] ${task.status === 'COMPLETED' ? 'opacity-40 grayscale' : ''}`}
                onClick={() => navigate(`/task/${task._id}`)}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full transition-transform group-hover:scale-y-110 ${task.priority === 'HIGH PRIORITY' ? 'bg-[#ff4d4d]' : task.priority === 'MEDIUM' ? 'bg-[#7d8dff]' : 'bg-slate-700'}`} />

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/5 ${task.priority === 'HIGH PRIORITY' ? 'bg-[#ff4d4d]/10 text-[#ff4d4d]' : task.priority === 'MEDIUM' ? 'bg-[#7d8dff]/10 text-[#7d8dff]' : 'bg-white/5 text-slate-500'}`}>
                    {task.priority}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleStatus(task); }}
                      className={`w-9 h-9 rounded-2xl border border-white/10 flex items-center justify-center transition-all hover:scale-110 ${task.status === 'COMPLETED' ? 'bg-white text-black border-white' : 'bg-white/[0.03] hover:bg-white/10'}`}
                    >
                      {task.status === 'COMPLETED' ? '✓' : ''}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}
                      className="w-9 h-9 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all hover:scale-110"
                    >
                      <span className="text-sm">🗑️</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <h4 className={`text-2xl font-bold leading-tight group-hover:text-white transition-colors ${task.status === 'COMPLETED' ? 'line-through text-slate-600' : 'text-slate-200'}`}>{task.title}</h4>
                  <p className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-3 group-hover:text-slate-400 transition-colors">{task.desc}</p>
                </div>

                <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-[#7d8dff] transition-colors">{task.ai_analysis ? 'System Optimized' : 'Cognitive Ready'}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{task.due || 'No Deadline'}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-48 space-y-8 rounded-[4rem] border border-dashed border-white/5 bg-white/[0.01]">
          <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] flex items-center justify-center text-4xl grayscale opacity-20 border border-white/5">📋</div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white/40">Zero objectives identified</h3>
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mt-3">Adjust filters or initialize a new neural task load</p>
          </div>
          <button
            onClick={() => { setFilter('All'); setSearch(''); }}
            className="px-10 py-4 bg-white/[0.03] border border-white/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          >
            Reset Nexus
          </button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
