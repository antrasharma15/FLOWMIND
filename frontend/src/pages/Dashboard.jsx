import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [distribution, setDistribution] = useState([]);
  const [systemStatus, setSystemStatus] = useState('Monitoring cognitive load...');
  const [aiPriorityMessage, setAiPriorityMessage] = useState(() => {
    return sessionStorage.getItem('aiPriorityMessage') || '';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    desc: '',
    due: '',
    priority: 'MEDIUM',
    tags: ''
  });
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const refreshHandler = () => {
      setSystemStatus('Gemini recommendations updated.');
      fetchInitialData();
      setTimeout(() => setSystemStatus('AI actively monitoring productivity.'), 3000);
    };
    window.addEventListener('tasks-updated', refreshHandler);
    return () => window.removeEventListener('tasks-updated', refreshHandler);
  }, [searchQuery]);

  useEffect(() => {
    const handleAiPrioritized = (event) => {
      const message = event?.detail?.message || '';
      setAiPriorityMessage(message);
      if (message) {
        sessionStorage.setItem('aiPriorityMessage', message);
      }
    };

    const handleProfileUpdate = () => {
      setUsername(localStorage.getItem('username') || 'Guest');
    };

    window.addEventListener('ai-prioritized', handleAiPrioritized);
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('ai-prioritized', handleAiPrioritized);
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchInitialData = async () => {
    try {
      setSystemStatus('Syncing neural task load...');
      const insightsRes = await api.get('/insights/report');
      setReport(insightsRes.data.data);
      const distRes = await api.get('/tasks/distribution');
      setDistribution(distRes.data.data || []);
      await fetchTasks('');
      setSystemStatus('Task sync completed.');
      setTimeout(() => setSystemStatus('AI actively monitoring productivity.'), 3000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (query) => {
    setSearchLoading(true);
    setSearchMessage('');
    try {
      const response = await api.get('/tasks', {
        params: query ? { search: query } : {},
      });
      setTasks(response.data.data || []);
      if (query && response.data.message) {
        setSearchMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const taskData = {
      ...newTask,
      aiLabel: 'AI: Analyzing task requirements...',
      color: newTask.priority === 'HIGH PRIORITY' ? 'border-l-[#ff4d4d]' : newTask.priority === 'MEDIUM' ? 'border-l-[#b7bdff]' : 'border-l-gray-500'
    };

    try {
      const response = await api.post('/tasks', taskData);
      setTasks([response.data.data, ...tasks]);
      setNewTask({ title: '', desc: '', due: '', priority: 'MEDIUM', tags: '' });
      setIsModalOpen(false);
      // Refresh insights after adding task
      const insightsRes = await api.get('/insights/report');
      setReport(insightsRes.data.data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleComplete = async (e, task) => {
    e.stopPropagation();
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.patch(`/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Logic for dynamic stats
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const productivityScore = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const highPriorityCount = tasks.filter(t => t.priority === 'HIGH PRIORITY').length;
  const workloadPercentage = report?.focus_score || 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const insightMatches = !normalizedQuery || [
    report?.recommendation,
    report?.smart_move,
    report?.burnout_risk,
    report?.urgency_message,
    aiPriorityMessage,
  ].filter(Boolean).some((text) => text.toLowerCase().includes(normalizedQuery));

  return (
    <div className="space-y-12 pb-20">
      <section className="flex flex-wrap justify-between items-end gap-10">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl font-bold tracking-tight text-white mb-4"
          >
            Cognitive Flow, <span className="text-gradient">{username}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-xl text-lg leading-relaxed"
          >
            Your neural task load is at <span className="text-[#c084fc] font-bold">{workloadPercentage}%</span> capacity.
            The system has optimized your path for peak focus.
          </motion.p>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-white transition-colors">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspace..."
              className="w-80 rounded-2xl border border-white/5 bg-white/[0.03] px-12 py-3 text-[11px] font-bold text-white outline-none transition-all focus:border-white/20 focus:bg-white/[0.05]"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-white text-black rounded-2xl text-[11px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)]"
          >
            Add Quick Task
          </button>
          <div className="text-right border-l border-white/10 pl-10">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">COMPLETION SCORE</p>
            <p className="text-6xl font-bold text-white tracking-tighter tabular-nums">{productivityScore}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Priority Queue</h3>
            <button onClick={() => navigate('/tasks')} className="text-[10px] font-black text-[#7d8dff] uppercase tracking-widest hover:text-white transition-colors">View All →</button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-2 py-32 flex justify-center">
                <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : tasks.length > 0 ? (
              tasks.slice(0, 4).map((task, idx) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  layout
                  onClick={() => navigate(`/task/${task._id}`)}
                  className={`group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl transition-all hover:bg-white/[0.06] hover:border-white/10 shadow-2xl ${task.status === 'COMPLETED' ? 'opacity-40' : ''}`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${task.priority === 'HIGH PRIORITY' ? 'bg-[#ff4d4d]' : task.priority === 'MEDIUM' ? 'bg-[#7d8dff]' : 'bg-slate-700'}`} />

                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/5 ${task.priority === 'HIGH PRIORITY' ? 'bg-[#ff4d4d]/10 text-[#ff4d4d]' : task.priority === 'MEDIUM' ? 'bg-[#7d8dff]/10 text-[#7d8dff]' : 'bg-white/5 text-slate-500'}`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={(e) => handleToggleComplete(e, task)}
                      className={`w-7 h-7 rounded-xl border border-white/10 flex items-center justify-center transition-all hover:scale-110 ${task.status === 'COMPLETED' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
                    >
                      {task.status === 'COMPLETED' ? '✓' : ''}
                    </button>
                  </div>
                  <h4 className={`text-2xl font-bold leading-snug group-hover:text-white transition-colors ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</h4>

                  <div className="pt-8 mt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs grayscale group-hover:grayscale-0 transition-all">✨</span>
                      <p className="text-[10px] font-bold text-slate-500 group-hover:text-[#7d8dff] transition-colors italic truncate max-w-[150px]">{task.aiLabel}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter">{task.due}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 py-32 rounded-[3rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 gap-4">
                <span className="text-3xl opacity-20">🎯</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">{searchQuery ? 'No objectives matched your search' : 'No active objectives'}</p>
              </div>
            )}
          </div>

          {/* Performance Graph */}
          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 backdrop-blur-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Cognitive Load Distribution</h3>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Weekly intensity metrics</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />)}
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-6 px-4">
              {distribution.length > 0 ? (
                distribution.map((item, i) => {
                  const maxCount = Math.max(...distribution.map(d => d.count), 1);
                  const height = (item.count / maxCount) * 90 + 10;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1.2, ease: "circOut", delay: i * 0.05 }}
                        className="w-full bg-gradient-to-t from-white/5 via-[#7d8dff]/20 to-[#c084fc]/40 rounded-2xl relative group-hover:scale-x-105 transition-transform"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 rounded-lg text-[9px] font-black opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-2xl">
                          {item.count}
                        </div>
                        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
                      </motion.div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{item.day}</span>
                    </div>
                  );
                })
              ) : (
                [20, 45, 60, 40, 35, 50, 25].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/[0.03] rounded-2xl h-12 animate-pulse" />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-10">
          {/* AI Insight Card */}
          <div className="relative group overflow-hidden rounded-[3rem] border border-white/5 bg-[#ffffff]/[0.02] p-10 backdrop-blur-3xl shadow-2xl">
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#7d8dff]/05 rounded-full blur-[100px] group-hover:bg-[#7d8dff]/10 transition-colors" />

            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">💡</div>
              <h3 className="text-xl font-bold tracking-tight text-white">AI Strategy Insight</h3>
            </div>

            <div className="space-y-8 relative z-10">
              {insightMatches ? (
                <>
                  <p className="text-lg font-medium leading-relaxed text-slate-300">
                    "{aiPriorityMessage || report?.urgency_message || report?.recommendation || "System analysis complete. Optimal focus path established."}"
                  </p>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      <span>Neural Intensity</span>
                      <span className="text-[#c084fc]">{workloadPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${workloadPercentage}%` }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-[#7d8dff] to-[#c084fc] rounded-full shadow-[0_0_15px_rgba(125,141,255,0.4)]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[2rem] bg-white/[0.02] p-6 text-center">
                  <p className="text-xs text-slate-500 italic">No intelligence matched this query.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 space-y-10 shadow-2xl backdrop-blur-3xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Optimization Metrics</h3>
            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🎯</div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold text-white">Peak Performance</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{report?.smart_move || "Neural balance is currently stable."}</p>
                </div>
              </div>
              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">⚖️</div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold text-white">Stability Index</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold ${report?.burnout_risk === 'High' ? 'text-[#ff4d4d]' : 'text-emerald-400'}`}>{report?.burnout_risk || 'Optimal'}</span>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest opacity-40">Risk Level</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 px-8 py-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
            <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
              <span className="animate-pulse">🧠</span>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kernel Status</p>
              <p className="text-[11px] text-white font-bold tracking-tight">{systemStatus}</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-[#0a0d14] border border-white/10 rounded-[3.5rem] p-12 shadow-[0_50px_100px_-30px_rgba(0,0,0,1)]"
            >
              <h2 className="text-4xl font-bold mb-10 tracking-tight text-white">New Objective</h2>
              <form onSubmit={handleAddTask} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Task Title</label>
                  <input
                    required
                    type="text"
                    placeholder="Focus objective..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Context</label>
                  <textarea
                    placeholder="Brief objective details..."
                    value={newTask.desc}
                    onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
                    rows="3"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-white/30 transition-all resize-none placeholder:text-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Deadline</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Friday"
                      value={newTask.due}
                      onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Intensity</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                    >
                      <option value="HIGH PRIORITY">High Priority</option>
                      <option value="MEDIUM">Medium Intensity</option>
                      <option value="LOW">Low Background</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-6 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Establish Objective
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
