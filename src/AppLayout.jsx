import { Outlet, Navigate } from "react-router-dom";

const AppLayout = () => {
  const isLoggedIn = localStorage.getItem('authToken');  // example check

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <div className="topbar">Topbar</div>
      <div className="sidebar">Sidebar</div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
