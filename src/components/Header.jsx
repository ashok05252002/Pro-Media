import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSidebar } from '../contexts/SidebarContext';
import NotificationPanel from './NotificationPanel';

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const userName = localStorage.getItem('username');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  return (
    <header className="border-b border-[#FFC9CA]/20 py-4 px-6 flex justify-between items-center transition-colors duration-200 bg-white dark:bg-primary-dark">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-1 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-medium">{getGreeting()}, {userName}!</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-theme-danger rounded-full"></span>
          </button>
          
          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
