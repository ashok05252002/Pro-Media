import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  Globe, 
  ShoppingBag, 
  FileEdit, 
  Calendar, 
  BarChart3, 
  Users, 
  MessageSquare,
  Settings, 
  HelpCircle,
  LogOut,
  FileText,
  User
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = () => {
  const { isCollapsed } = useSidebar();
  const { isDarkMode, themeColors } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  // const userName = localStorage.getItem('userName') || "Vijaya";
  const userName = localStorage.getItem('username') || "";

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
    { path: '/channels', name: 'My Business', icon: <Globe className="w-5 h-5" /> },
    // { path: '/products', name: 'My Products', icon: <ShoppingBag className="w-5 h-5" /> },
    { path: '/calendar-view', name: 'Calendar View', icon: <FileEdit className="w-5 h-5" /> },
    // { path: '/ViewComments', name: 'View comments', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/ViewPost', name: 'View Post', icon: <FileText className="w-5 h-5" /> },
    // { path: '/post/:postId/details-and-comments', name: 'View ', icon: <FileText className="w-5 h-5" /> },   
    { path: '/post-creation', name: 'Post Creation', icon: <FileEdit className="w-5 h-5" /> },
    { path: '/scheduler', name: 'Content Scheduler', icon: <Calendar className="w-5 h-5" /> },
    { path: '/analytics', name: 'Analytics & Insights', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const bottomMenuItems = [
    { path: '/settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { path: '/support', name: 'Support', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem("authToken")
    
    navigate('/');
  };

  const handleViewProfile = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} h-full border-r border-[#FFC9CA]/20 flex flex-col transition-all duration-300 ease-in-out bg-white dark:bg-primary-dark`}>
      <div className="p-4 border-b border-[#FFC9CA]/20 flex items-center justify-center">
        <h1 className={`text-lg font-medium ${isCollapsed ? 'hidden' : 'block'}`}>Demo Name</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  isActive 
                    ? `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} py-4 ${isCollapsed ? 'px-2' : 'px-6'} bg-theme-light-accent text-[#112A46] font-medium rounded-lg`
                    : `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} py-4 ${isCollapsed ? 'px-2' : 'px-6'} ${isDarkMode ? 'text-white' : 'text-[#64748B]'} hover:bg-[#FFC9CA]/10 rounded-lg transition-colors duration-200`
                }
                end={item.path === '/'}
                title={isCollapsed ? item.name : ''}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t border-[#FFC9CA]/20 py-4">
        <ul className="space-y-1 px-3">
          {bottomMenuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  isActive 
                    ? `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} py-4 ${isCollapsed ? 'px-2' : 'px-6'} bg-theme-light-accent text-[#112A46] font-medium rounded-lg`
                    : `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} py-4 ${isCollapsed ? 'px-2' : 'px-6'} ${isDarkMode ? 'text-white' : 'text-[#64748B]'} hover:bg-[#FFC9CA]/10 rounded-lg transition-colors duration-200`
                }
                title={isCollapsed ? item.name : ''}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border-t border-[#FFC9CA]/20 p-4 relative">
        <div 
          className={`flex ${isCollapsed ? 'justify-center' : 'items-center'} cursor-pointer`}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img 
            src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/d565/9814/410c0e68cc5a1fddaf59dbaa4c8f4c01?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NJuUfBNqkkRBKsQRXkDw1otRahyF1W1KZOWcV1UdeBMVjDhBiES3oKt0AZSYa2AAwpyIudBUZ-c9x2S5ZLPjcgNxaWxaxFQZTMZ6f2kBSWdlwnWPTWHAYMQKpMU4PBXC75uy7rHrEOm3CfB2xTBTkTi8eIlDdFppLHHuh2rkR14CWS~2IRSOqCajDIYjKVKbJFCVDqFxG2YNFWgDQ84Mf8kE5ZffEUfC4GzeKHLJA~gn1mhopFAZ0jERz-HgmhkFZfZzbV-fiV1-AWtGL2l81G-w3TrFgxMe-Nof5KI6nECLT3F8RjxudsTLj3BHXBUVXS4C87iUdVzHTZha8kmsOA__" 
            alt={userName} 
            className={`${isCollapsed ? 'w-8 h-8' : 'w-10 h-10 mr-3'} rounded-full`}
            title={userName}
          />
          {!isCollapsed && <span className="font-medium">{userName}</span>}
        </div>
        
        {/* Profile dropdown menu */}
        {showProfileMenu && (
          <div className="absolute border-2 border-gray-600 bottom-16 left-0 w-full p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
            <button 
              onClick={handleViewProfile}
              className="flex items-center gap-2 w-full p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 w-full p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
