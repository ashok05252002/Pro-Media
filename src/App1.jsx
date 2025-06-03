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
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  console.log(isAuthenticated);

  const router = createBrowserRouter([
    {
    path: "/",
    element: !isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/VerifyEmailPage",
    element: <VerifyEmailPage />
  },
  {
    path: "/forgotpwd",
    element: <ForgotPasswordPage />
  },
  {
    path: "/resetpwd",
    element: <ResetPasswordPage />
  },
  {
    path: "/auth/facebook/callback",
    element: <FacebookCallback />
  },
  {
    path: "/oauth2callback",
    element: <YoutubeCallback />
  },
  {
    path: "/auth/twitter/callback",
    element: <TWTCallbackWrapper />
  },
  {
    path: "/auth/linkedin/callback",
    element: <LinkedinCallback />
  },
  {
    path: "/forgot-password",
    element: !isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" />
  },
  {
    path: "/reset-password",
    element: !isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/" />
  },
  {
    path: "/",
    element: <PrivateRoute> <Layout /> </PrivateRoute>,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard  />
      },
      {
        path: "/regproduct",
        element: <RegProduct />
      },
      {
        path: "/reg_prdt_success",
        element: (
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <RegProductSuccess />
          </PrivateRoute>
        )
      },
      {
        path: "/channels",
        element: <MyBusiness />
      },
      {
        path: "/platform/:name",
        element: <PlatformTable />
      },
      {
        path: "/ViewPost",
        element: <ViewPosts />
      },
      {
        path: "/ViewComments",
        element: <ViewComments />
      },
      {
        path: "/products",
        element: <MyProducts />
      },
      {
        path: "/calendar-view",
        element: <CalendarViewPage />
      },
      {
        path: "/post-creation",
        element: <PostCreation />
      },
      {
        path: "/scheduler",
        element: <ContentScheduler />
      },
      {
        path: "/analytics",
        element: <Analytics />
      },
      {
        path: "/users",
        element: <UserManagement />
      },
      {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "/support",
        element: <Support />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/add-business",
        element: <AddBusinessPage />
      },
      {
        path: "post/:postId/details-and-comments",
        element: <PostDetailsAndCommentsPage />
      }
    ]
  },
  // Error pages
  {
    path: "/500",
    element: <ServerErrorPage />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
  ], {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }
  });

  return (
    <ThemeProvider>
      <SidebarProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <RouterProvider router={router} />
      </SidebarProvider>
    </ThemeProvider>
  );
}
export default App;


function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}