import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const TopNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [userData, setUserData] = useState({
    username: localStorage.getItem('username') || 'Guest',
    avatar: localStorage.getItem('avatar') || ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserData({
        username: localStorage.getItem('username') || 'Guest',
        avatar: localStorage.getItem('avatar') || ''
      });
    };

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    navigate('/');
  };

  const handleAiPrioritize = async () => {
    setIsPrioritizing(true);
    try {
      const tasksRes = await api.get('/tasks');
      const activeTasks = (tasksRes.data.data || []).filter(
        (task) => task.status !== 'COMPLETED'
      );

      const payload = {
        tasks: activeTasks.map((task) => ({
          _id: task._id,
          title: task.title,
          due: task.due,
          desc: task.desc,
          priority: task.priority,
        })),
      };

      const response = await api.post('/tasks/prioritize', payload);
      const summary = response.data.summary || response.data.message;

      if (summary) {
        sessionStorage.setItem('aiPriorityMessage', summary);
      }

      window.dispatchEvent(new Event('tasks-updated'));
      window.dispatchEvent(
        new CustomEvent('ai-prioritized', { detail: { message: summary } })
      );
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'AI prioritization failed. Check backend logs.';
      sessionStorage.setItem('aiPriorityMessage', message);
      window.dispatchEvent(
        new CustomEvent('ai-prioritized', { detail: { message } })
      );
      console.error('AI Prioritization failed:', error);
    } finally {
      setIsPrioritizing(false);
    }
  };
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const response = await api.get(`/api/search?q=${query}`);
      setSearchResults(response.data.data || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (url) => {
    navigate(url);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#05070a]/40 backdrop-blur-3xl z-40">
      <div className="relative w-96 group" ref={searchRef}>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-white transition-colors">🔍</span>
        <input
          type="text"
          placeholder="Search anything..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-[11px] font-medium focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all placeholder:text-slate-600 text-white"
        />

        {showSearchResults && (
          <div className="absolute top-14 left-0 w-full bg-[#0a0d14]/95 border border-white/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-3xl z-50">
            {isSearching ? (
              <div className="p-4 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Scanning system...</div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.url)}
                    className="w-full p-4 flex items-start gap-4 hover:bg-white/[0.05] transition-all border-b border-white/5 last:border-0 text-left group/item"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-inner ${result.type === 'Task' ? 'bg-[#7d8dff]/10 text-[#7d8dff]' :
                        result.type === 'AI Insight' ? 'bg-[#c084fc]/10 text-[#c084fc]' :
                          'bg-emerald-500/10 text-emerald-400'
                      }`}>
                      {result.type === 'Task' ? '📋' : result.type === 'AI Insight' ? '✨' : '📊'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white group-hover/item:text-[#7d8dff] transition-colors truncate">{result.title}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{result.subtitle}</p>
                    </div>
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest group-hover/item:text-slate-500 transition-colors">{result.type}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">No matches found</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-8">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAiPrioritize}
          disabled={isPrioritizing}
          className={`flex items-center gap-2.5 px-6 py-2.5 bg-white text-black rounded-2xl text-[11px] font-bold shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)] transition-all ${isPrioritizing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_15px_30px_-10px_rgba(255,255,255,0.4)]'}`}
        >
          <span className="text-sm">{isPrioritizing ? '⏳' : '✨'}</span>
          {isPrioritizing ? 'Neural Syncing...' : 'AI Prioritize'}
        </motion.button>

        <div className="h-6 w-px bg-white/10"></div>

        <div className="flex items-center gap-4 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active</span>
        </div>

        <div ref={profileRef} className="relative flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-4 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-white group-hover:text-[#7d8dff] transition-colors">{userData.username}</p>
            
            </div>
            <div className="w-10 h-10 rounded-2xl border border-white/10 p-0.5 overflow-hidden group-hover:border-white/30 transition-all shadow-2xl">
              <img
                src={userData.avatar ? `${api.defaults.baseURL}${userData.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.username)}`}
                alt="User"
                className="w-full h-full rounded-[14px] bg-[#0a0d14] object-cover"
              />
            </div>
          </button>

          {isProfileOpen && (
            <div
              className="absolute right-0 top-14 w-48 rounded-2xl border border-white/10 bg-[#0a0d14]/95 p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] backdrop-blur-3xl"
            >
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl px-4 py-3 text-left text-[11px] font-bold text-slate-400 transition-all hover:bg-white/[0.05] hover:text-white flex items-center justify-between group"
              >
                Log out
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
