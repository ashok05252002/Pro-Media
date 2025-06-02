import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const InputField = ({ id, label, type, value, onChange, error, icon, placeholder, toggleVisibility, showPassword }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{React.cloneElement(icon, { className: "w-5 h-5 text-gray-400"})}</div>}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm dark:bg-gray-700 dark:text-white ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-theme-primary focus:border-theme-primary'
        }`}
      />
      {toggleVisibility && (
         <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={toggleVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
      )}
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation(); // Use location to get state
  const { isDarkMode } = useTheme();
  
  const emailForReset = location.state?.emailForReset; // Get email from route state

  useEffect(() => {
    if (!emailForReset && !successMessage) { 
      console.warn("No email found for password reset (from route state). Redirecting to login.");
      navigate('/login');
    }
  }, [emailForReset, successMessage, navigate]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        navigate('/login');
      }, 4000); 
    }
    return () => clearTimeout(timer);
  }, [successMessage, navigate]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    console.log(`Simulating password reset for ${emailForReset} with new password: ${newPassword}`);
    setTimeout(() => {
      setSuccessMessage('Your password has been reset successfully! Redirecting to login...');
      // No longer removing from localStorage as it's not set there
      setIsLoading(false);
    }, 1000);
  };

  if (!emailForReset && !successMessage) {
    return null; 
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-theme-primary" />
          <h2 className="mt-6 text-3xl font-bold">Reset Your Password</h2>
          {!successMessage && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create a new password for your account: <span className="font-medium text-theme-primary">{emailForReset}</span>
            </p>
          )}
        </div>

        <div className={`mt-8 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {successMessage ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-6">{successMessage}</p>
              <Link
                to="/login"
                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
              >
                Go to Login Now
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <InputField 
                  id="newPassword" 
                  label="New Password" 
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  icon={<Lock />} 
                  placeholder="Enter new password (min. 8 chars)"
                  toggleVisibility={() => setShowNewPassword(!showNewPassword)}
                  showPassword={showNewPassword}
                />
                <InputField 
                  id="confirmPassword" 
                  label="Confirm New Password" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  icon={<Lock />} 
                  placeholder="Re-enter new password"
                  toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                  showPassword={showConfirmPassword}
                />
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-70"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        {!successMessage && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Remembered your password? <Link to="/login" className="font-medium text-theme-primary hover:text-opacity-80">Login here</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
