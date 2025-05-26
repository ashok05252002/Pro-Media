import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const NotFoundPage = () => {
  const { themeColors, isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 py-8 ${isDarkMode ? 'bg-primary-dark text-primary-light' : 'bg-gray-100 text-primary-dark'}`}>
      <div className={`p-8 md:p-12 rounded-xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Frown
          className="mx-auto mb-6 text-theme-primary"
          size={80}
          strokeWidth={1.5}
        />
        <h1
          className="text-6xl md:text-8xl font-bold mb-4"
          style={{ color: themeColors.primary }}
        >
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Oops! Page Not Found
        </h2>
        <p className={`text-md md:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-md mx-auto`}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
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
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
};

export default NotFoundPage;
