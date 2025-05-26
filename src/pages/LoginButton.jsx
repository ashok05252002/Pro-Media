import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
    // Set authentication and redirect
    // localStorage.setItem('isAuthenticated', 'true');
    // localStorage.setItem('userEmail', 'ashok@gmail.com');
    // localStorage.setItem('userName', 'Ashok Kumar');
    
    // Force redirect to dashboard
    window.location.href = '/';
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleLogin}
        className="bg-[#F97316] hover:bg-[#F97316]/80 text-white px-4 py-2 rounded-md"
      >
        Login Directly
      </button>
    </div>
  );
};

export default LoginButton;
