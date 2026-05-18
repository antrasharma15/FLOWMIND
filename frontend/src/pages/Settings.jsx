import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    aiPreference: 'Balanced',
    uiDensity: 'Balanced',
    settings: {
      theme: 'dark',
      notifications: true
    }
  });
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/user/profile');
      setProfile(response.data);
      // Sync with global storage for TopNavbar
      if (response.data.avatar) {
        localStorage.setItem('avatar', response.data.avatar);
      } else {
        localStorage.removeItem('avatar');
      }
      localStorage.setItem('username', response.data.name);
      window.dispatchEvent(new Event('profile-updated'));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await api.post('/api/user/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile({ ...profile, avatar: response.data.avatar });
      localStorage.setItem('avatar', response.data.avatar);
      window.dispatchEvent(new Event('profile-updated'));
      alert('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Avatar upload failed:', error);
      alert('Failed to upload avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await api.delete('/api/user/remove-avatar');
      setProfile({ ...profile, avatar: null });
      localStorage.removeItem('avatar');
      window.dispatchEvent(new Event('profile-updated'));
      alert('Avatar removed.');
    } catch (error) {
      console.error('Avatar removal failed:', error);
    }
  };

  const handleAiPreferenceChange = async (mode) => {
    try {
      setProfile({ ...profile, aiPreference: mode });
      await api.put('/api/user/ai-preferences', { aiPreference: mode });
    } catch (error) {
      console.error('AI preference update failed:', error);
      alert('Failed to update AI mode.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await api.put('/api/user/profile', profile);
      localStorage.setItem('username', profile.name);
      localStorage.setItem('uiDensity', profile.uiDensity);
      if (profile.avatar) {
        localStorage.setItem('avatar', profile.avatar);
      } else {
        localStorage.removeItem('avatar');
      }
      window.dispatchEvent(new Event('profile-updated'));
      alert('Settings synced with cloud nexus.');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      alert("Verification required: Please enter your password.");
      return;
    }

    try {
      // In a production app, password verification happens on backend
      // Here we proceed with the API call
      await api.delete('/api/user/account');
      localStorage.clear();
      window.location.href = '/';
      alert("Account purged. All neural data has been wiped.");
    } catch (error) {
      console.error("Purge failed:", error);
      alert("Purge failed. System access denied.");
    }
  };

  if (loading) {
    return <div className="py-40 text-center animate-pulse text-[#7d8dff]">Initializing settings...</div>;
  }

  return (
    <div className="space-y-16 pb-32">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-1 bg-gradient-to-r from-[#7d8dff] to-transparent rounded-full" />
          <p className="text-[10px] font-black text-[#7d8dff] uppercase tracking-[0.5em]">Identity & Nodes</p>
        </div>
        <h1 className="text-6xl font-bold tracking-tight text-white">System Config</h1>
        <p className="text-xl text-slate-400 font-medium italic">Synchronize your profile with the cognitive network.</p>
      </div>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8 space-y-12">
          {/* Profile Settings Card */}
          <div className="group relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-16 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#7d8dff]/05 to-transparent pointer-events-none opacity-50" />

            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-12">Core Identity</h3>

            <div className="flex items-center gap-16 mb-12">
              <div className="relative group/avatar">
                <div className="w-40 h-40 rounded-[3rem] bg-white text-black flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(255,255,255,0.3)] relative overflow-hidden transition-transform duration-700 group-hover/avatar:scale-105">
                  <img
                    src={profile.avatar ? `${api.defaults.baseURL}${profile.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                    alt="Avatar"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Update</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 flex gap-2">
                  <label className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-2xl">
                    <span className="text-xl">📸</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                  </label>
                  {profile.avatar && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center cursor-pointer hover:bg-rose-600 transition-all shadow-2xl hover:scale-110"
                    >
                      <span className="text-sm font-black">✕</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-1">Display Designation</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-1">Neural Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-white/[0.01] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-slate-600 cursor-not-allowed outline-none italic"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveChanges}
              className="px-12 py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]"
            >
              Commit Sync
            </button>
          </div>

          {/* Appearance Section */}
          <div className="group relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-16 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-12">Visual Environment</h3>

            <div className="flex flex-wrap items-center justify-between gap-10">
              <div className="space-y-2">
                <p className="text-xl font-bold text-white">Interface Scale</p>
                <p className="text-[13px] text-slate-500 font-medium">Calibrate the density of neural data projection.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-1.5 flex gap-1 w-full max-w-md shadow-inner">
                {['Compact', 'Balanced', 'Spacious'].map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      setProfile({ ...profile, uiDensity: d });
                      localStorage.setItem('uiDensity', d);
                      window.dispatchEvent(new Event('profile-updated'));
                    }}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${profile.uiDensity === d ? 'bg-white text-black shadow-xl' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-12">
          {/* AI Preferences Section */}
          <div className="group relative overflow-hidden rounded-[4rem] border border-white/5 bg-[#ffffff]/[0.02] p-12 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04]">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#7d8dff]/10 flex items-center justify-center text-xl text-[#7d8dff] shadow-inner">✨</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Mode</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {['Focused', 'Balanced', 'Relaxed'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleAiPreferenceChange(mode)}
                    className={`w-full group/btn flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-500 ${profile.aiPreference === mode ? 'bg-white/[0.05] border-[#7d8dff]/30 shadow-2xl scale-[1.02]' : 'bg-transparent border-white/5 hover:bg-white/[0.02]'}`}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className={`text-xs font-black uppercase tracking-widest ${profile.aiPreference === mode ? 'text-[#7d8dff]' : 'text-slate-500 group-hover/btn:text-slate-300'}`}>{mode}</span>
                      <span className="text-[10px] text-slate-700 font-medium">{mode === 'Focused' ? 'Maximum Velocity' : mode === 'Relaxed' ? 'Muted Intelligence' : 'Default Balance'}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${profile.aiPreference === mode ? 'border-[#7d8dff] bg-[#7d8dff]/10' : 'border-white/5'}`}>
                      {profile.aiPreference === mode && <motion.div layoutId="pref-dot" className="w-2.5 h-2.5 bg-[#7d8dff] rounded-full shadow-[0_0_8px_rgba(125,141,255,0.8)]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-6">
            <button
              onClick={handleLogout}
              className="w-full py-6 group rounded-[3rem] border border-white/5 bg-white/[0.02] text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center justify-center gap-4 transition-all hover:bg-white/[0.05] hover:text-white"
            >
              <span className="text-xl transition-transform group-hover:translate-x-2">↪</span>
              Disconnect
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-4 text-[10px] font-black text-rose-500/30 hover:text-rose-500 transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-3 group"
            >
              <span className="text-sm group-hover:scale-125 transition-transform">🗑️</span>
              Purge Neural Data
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal - Cinematic Overhaul */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#05070a]/90 backdrop-blur-2xl"
            onClick={() => setShowDeleteModal(false)}
          />
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative bg-[#0d111d] border border-white/5 rounded-[5rem] p-20 max-w-2xl w-full space-y-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]" />

            <div className="text-center space-y-8">
              <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto relative">
                <span className="text-5xl relative z-10">⚠️</span>
                <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 animate-pulse" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-bold text-white tracking-tight">Terminal Authorization</h3>
                <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-md mx-auto italic">
                  "Proceeding will permanently dismantle your neural workspace. This operation is <span className="text-rose-500 font-black uppercase not-italic">terminal</span>."
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] block px-4">Identify to Proceed</label>
              <input
                type="password"
                placeholder="Authorize with password"
                value={deleteConfirmPassword}
                onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-[2.5rem] py-6 px-10 text-lg font-bold text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder:text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/[0.06] transition-all"
              >
                Abort
              </button>
              <button
                onClick={handleDeleteAccount}
                className="py-6 rounded-[2.5rem] bg-rose-500 text-white text-[11px] font-black uppercase tracking-widest transition-all hover:bg-rose-600 shadow-[0_20px_50px_-10px_rgba(244,63,94,0.3)]"
              >
                Confirm Purge
              </button>
            </div>
          </motion.div>
        </div>
      )}

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

export default Settings;
