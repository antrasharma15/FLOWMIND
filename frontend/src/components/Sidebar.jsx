import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const sidebarItems = [
  { name: 'Dashboard', icon: '📊', path: '/dashboard' },
  { name: 'Tasks', icon: '✅', path: '/tasks' },
  { name: 'AI Insights', icon: '🧠', path: '/insights' },
  { name: 'Analytics', icon: '📈', path: '/analytics' },
  { name: 'Settings', icon: '⚙️', path: '/settings' },
];

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0a0d14]/95 lg:bg-[#0a0d14]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col p-6 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Brand */}
      <div
        className="flex items-center gap-4 mb-12 px-2 cursor-pointer group"
        onClick={() => navigate('/dashboard')}
      >
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-all">
          <span className="text-black text-xs font-black tracking-tighter">FM</span>
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white block">FlowMind</span>
          {/* <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Enterprise</span> */}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${isActive
                  ? 'bg-white/[0.05] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-200'
                }`}
            >
              <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-semibold tracking-tight">{item.name}</span>

              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
