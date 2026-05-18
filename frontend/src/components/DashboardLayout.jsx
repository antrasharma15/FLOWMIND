import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNavbar from './TopNavbar.jsx';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [density, setDensity] = React.useState(localStorage.getItem('uiDensity') || 'Balanced');

  React.useEffect(() => {
    const handleProfileUpdate = () => {
      setDensity(localStorage.getItem('uiDensity') || 'Balanced');
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  return (
    <div className={`flex min-h-screen bg-[#05070a] text-white font-sans selection:bg-[#7d8dff]/30 overflow-hidden density-${density.toLowerCase()}`}>
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[5%] h-[500px] w-[500px] rounded-full bg-[#7d8dff]/05 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[#c084fc]/03 blur-[140px]" />
      </div>

      {/* Fixed Sidebar */}
      <div className="relative z-20 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* Fixed Top Navbar */}
        <TopNavbar />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-[var(--app-padding)] space-y-[var(--app-gap)] max-w-[1600px] mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}} />
    </div>
  );
};

export default DashboardLayout;
