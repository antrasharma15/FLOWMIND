import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from './DemoContext';

const DemoTasks = () => {
  const { tasks, addTask, deleteTask, updateTask } = useDemo();
  const [filter, setFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    if (filter === 'PENDING') return t.status === 'PENDING' || t.status === 'IN PROGRESS';
    return true;
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      desc: 'Simulated task description.',
      priority: 'MEDIUM',
      status: 'PENDING',
      due: new Date().toISOString().split('T')[0],
      tags: 'Demo',
      effort: '1h'
    });
    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'HIGH PRIORITY': return 'text-[#ff4d4d] bg-[#ff4d4d]/10';
      case 'MEDIUM': return 'text-[#7d8dff] bg-[#7d8dff]/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  return (
    <div className="space-y-8 md:space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Tasks</h1>
          <p className="text-sm md:text-base text-white/40">Manage your intelligent workflow simulation.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
        >
          + Quick Task
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-3 border-y border-white/5 py-6 md:py-8">
        {['ALL', 'PENDING', 'COMPLETED'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${filter === tab ? 'bg-white text-black border-white shadow-xl' : 'bg-white/[0.03] border-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode='popLayout'>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 md:p-8 flex items-center justify-between backdrop-blur-3xl transition-all hover:bg-white/[0.04] hover:border-white/10 shadow-2xl ${task.status === 'COMPLETED' ? 'opacity-40 grayscale' : ''}`}
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full transition-transform group-hover:scale-y-110 ${task.priority === 'HIGH PRIORITY' ? 'bg-[#ff4d4d]' : task.priority === 'MEDIUM' ? 'bg-[#7d8dff]' : 'bg-slate-700'}`} />
              
              <div className="flex items-center gap-6 relative z-10">
                <button
                  onClick={() => updateTask(task.id, { status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' })}
                  className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${task.status === 'COMPLETED' ? 'bg-white border-white text-black' : 'border-white/10 hover:border-white/30'}`}
                >
                  {task.status === 'COMPLETED' && <span className="text-[10px] font-black">✓</span>}
                </button>
                <div className="space-y-1">
                  <h4 className={`text-lg md:text-xl font-bold tracking-tight group-hover:text-white transition-colors ${task.status === 'COMPLETED' ? 'line-through text-slate-600' : 'text-slate-200'}`}>{task.title}</h4>
                  <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{task.tags} • {task.due}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8 relative z-10">
                <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5 ${task.priority === 'HIGH PRIORITY' ? 'bg-[#ff4d4d]/10 text-[#ff4d4d]' : 'bg-[#7d8dff]/10 text-[#7d8dff]'}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-700 hover:text-red-500 transition-colors group-hover:scale-125 duration-300"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#05070a]/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0d111d] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
              
              <div className="text-center space-y-6 md:space-y-8 mb-8 md:mb-10">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <span className="text-2xl md:text-3xl">🎯</span>
                 </div>
                 <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">New Demo Objective</h3>
              </div>

              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] block px-4">Identify Objective</label>
                   <input
                     autoFocus
                     type="text"
                     value={newTaskTitle}
                     onChange={(e) => setNewTaskTitle(e.target.value)}
                     placeholder="Establishing neural task..."
                     className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] py-5 md:py-6 px-8 md:px-10 text-base font-bold text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-slate-800"
                   />
                </div>
                <button type="submit" className="w-full py-5 md:py-6 bg-white text-black rounded-[1.5rem] md:rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Initialize Sync
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoTasks;
