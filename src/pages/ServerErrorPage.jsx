import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ServerCrash } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ServerErrorPage = () => {
  const { themeColors, isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 py-8 ${isDarkMode ? 'bg-primary-dark text-primary-light' : 'bg-gray-100 text-primary-dark'}`}>
      <div className={`p-8 md:p-12 rounded-xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <ServerCrash
          className="mx-auto mb-6 text-theme-danger"
          size={80}
          strokeWidth={1.5}
        />
        <h1
          className="text-6xl md:text-8xl text-theme-primary font-bold mb-4"
          style={{ color: themeColors.danger }}
        >
          500
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Oops! Something Went Wrong
        </h2>
        <p className={`text-md md:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-md mx-auto`}>
          We're experiencing some technical difficulties on our end. Our team has been notified and is working to fix it.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white rounded-lg shadow-md transition-colors duration-300 btn-primary"
        >
          <Home className="w-5 h-5 mr-2" />
          Go to Homepage
        </Link>
      </div>
      <p className={`mt-8 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Please try again later. We apologize for the inconvenience.
      </p>
    </div>
  );
};

export default ServerErrorPage;
