
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';

const MobileLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 pb-16 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  );
};

export default MobileLayout;
