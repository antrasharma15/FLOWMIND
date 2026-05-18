import React from 'react';
import { Outlet } from 'react-router-dom';
import DemoSidebar from './DemoSidebar';
import DemoTopNavbar from './DemoTopNavbar';
import { DemoProvider } from './DemoContext';

const DemoLayout = () => {
  return (
    <DemoProvider>
      <div className="flex min-h-screen bg-[#05070a] text-white font-sans selection:bg-[#7d8dff]/30">
        <DemoSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <DemoTopNavbar />
          
          {/* Demo Banner */}
          <div className="bg-white text-black py-2.5 text-center relative z-20 shadow-2xl">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">
              Synchronized Simulation — Neural Workspace Demo Mode
            </p>
          </div>

          <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 relative">
             {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              <div className="absolute -top-[10%] -left-[5%] h-[500px] w-[500px] rounded-full bg-[#7d8dff]/05 blur-[120px]" />
              <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[#c084fc]/03 blur-[140px]" />
            </div>
            
            <div className="relative z-10 max-w-[1400px] mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </DemoProvider>
  );
};

export default DemoLayout;
