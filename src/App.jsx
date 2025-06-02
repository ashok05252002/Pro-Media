import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate , useLocation} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MyBusiness from './pages/MyBusiness';
import MyProducts from './pages/MyProducts';
import PostCreation from './pages/PostCreation';
import ContentScheduler from './pages/ContentScheduler';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Profile from './pages/Profile';
import ForgotPwd from "./pages/ForgotPwd.jsx";
import RegProduct from "./components/RegProduct.jsx";
import RegProductSuccess from "./components/RegProductSuccess.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx"
import UserForm from "./components/UseForm.jsx";
import PostTable from "./components/table.jsx";
import CommentsTable from './components/CommentsTable.jsx';
import PlatformTable from "./pages/PlatformTable.jsx";
import FacebookCallback from './components/FacebookCallback.jsx';
import YoutubeCallback from './components/YoutubeCallback.jsx';
import TWTCallbackWrapper from './components/TWTCallback.jsx';
import LinkedinCallback from './components/LinkedinCallback.jsx';
import ViewPosts from './pages/ViewPosts.jsx';
import ViewComments from './pages/ViewComments.jsx';
import NotFoundPage from './pages/NotFoundPage';
import ServerErrorPage from './pages/ServerErrorPage';
import AddBusinessPage from './pages/AddBusinessPage';
import Register from "./pages/RegisterPage.jsx";
import PostDetailsAndCommentsPage from './pages/PostDetailsAndCommentsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import axios from 'axios';
import "./styles.css";


function App() {
  // For demo purposes, start as logged in
  
  var isAuthenticated = localStorage.getItem('authToken') !== null;
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token if necessary
      isAuthenticated = true;
    }
  }, []);
  return (
    <ThemeProvider>
      <SidebarProvider >
        <Router future={{
                  v7_relativeSplatPath: true, // Opt into the new splat path behavior
                  v7_startTransition: true,   // If you also saw the previous warning
                }}>
          <Routes>
            <Route path = "/" element={<Login/>}/>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            {/* <Route path="/register" element={!isAuthenticated ? <UserForm /> : <Navigate to="/dashboard" />} /> */}
            {/* <Route path="/register" element={<UserForm/>}/> */}
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgotpwd" element = {<ForgotPwd/>} />
            <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
            <Route path="/oauth2callback" element={<YoutubeCallback />} />
            <Route path="/auth/twitter/callback" element={<TWTCallbackWrapper/>} />
            <Route path="/auth/linkedin/callback" element={<LinkedinCallback />} />
            <Route 
              path="/forgot-password" 
              element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/reset-password" 
              element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/" />} // Simplified: ResetPasswordPage will handle logic if state is missing
            />
              {/* ✅ Wrap authenticated routes inside Layout */}
              {isAuthenticated && (
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/regproduct" element={<RegProduct />} />
                <Route path="/reg_prdt_success" element={
                                                          <PrivateRoute isAuthenticated={isAuthenticated}>
                                                          <RegProductSuccess />
                                                        </PrivateRoute>
                                                        } />
                <Route path="/channels" element={<MyBusiness />} />
                                                                          
                <Route path="/platform/:name" element={<PlatformTable />} />                                                        
                <Route path="/ViewPost" element={<ViewPosts />} />
                <Route path="/ViewComments" element={<ViewComments />} />
                <Route path="/products" element={<MyProducts />} />
                <Route path="/post-creation" element={<PostCreation />} />
                <Route path="/scheduler" element={<ContentScheduler />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-business" element={<AddBusinessPage />} />
                <Route path="post/:postId/details-and-comments" element={<PostDetailsAndCommentsPage />} />
              </Route>
            )}

            {/* Redirect unknown routes */}
            {/* <Route path="*" element={<Navigate to="/" />} /> */}

            {/* error pages  */}
             <Route path="/500" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
            
          </Routes>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;



{/* <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}> */}
              {/* <Route exact path = "/dashboard" element={<Dashboard />} />
              <Route exact path="/channels" element={<MyBusiness />} />
              <Route exact path="/products" element={<MyProducts />} />
              <Route exact path="/post-creation" element={<PostCreation />} />
              <Route exact path="/scheduler" element={<ContentScheduler />} />
              <Route exact path="/analytics" element={<Analytics />} />
              <Route exact path="/users" element={<UserManagement />} />
              <Route exact path="/settings" element={<Settings />} />
              <Route exact path="/support" element={<Support />} />
              <Route exact path="/profile" element={<Profile />} /> */}
            {/* </Route> */}
            {/* <Route path="*" element={<Navigate to="/" />} /> */}