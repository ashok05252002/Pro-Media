import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MyChannels from './pages/MyChannels';
import MyProducts from './pages/MyProducts';
import PostCreation from './pages/PostCreation';
import ContentScheduler from './pages/ContentScheduler';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Profile from './pages/Profile';

function App() {
  // For demo purposes, start as logged in

  const location = useLocation();
  const isAuthenticated = true;

  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !['/login', '/signup', '/'].includes(pathname);
  };

  return (
    <ThemeProvider>
     
        <Router>
        {shouldShowSidebar() && <SidebarProvider />}
          <Routes>
              <Route path="/" element={<Login />}/>  

              {/* <Route index path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} /> */}
              
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/channels" element={<MyChannels />} />
                <Route path="/products" element={<MyProducts />} />
                <Route path="/post-creation" element={<PostCreation />} />
                <Route path="/scheduler" element={<ContentScheduler />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/profile" element={<Profile />} />
              
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </Router>
        
    </ThemeProvider>
  );
}

export default App;
