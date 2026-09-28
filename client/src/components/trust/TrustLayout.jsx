import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TrustSidebar from './TrustSidebar';
import TrustHeader from './TrustHeader';

const TrustLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased overflow-x-hidden">
      {/* Trust Portal Sidebar */}
      <TrustSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Trust Workspace Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-h-screen min-w-0">
        <TrustHeader setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrustLayout;
