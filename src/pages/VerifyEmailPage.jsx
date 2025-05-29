import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { extCompanyUserRegResendOTP,extCompanyUserRegVerifyOTP } from '../API/api';

const InputField = ({ id, label, type, value, onChange, error, icon, required = true, placeholder, maxLength }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
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
        maxLength={maxLength}
        className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm dark:bg-gray-700 dark:text-white ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-theme-primary focus:border-theme-primary'
        }`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const VerifyEmailPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResendCode, setCanResendCode] = useState(false);
  
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  localStorage.setItem("isAuthenticated", true)
  const emailForVerification = localStorage.getItem('emailForVerification');

  useEffect(() => {
    if (!emailForVerification) {
      navigate('/login'); // Redirect if no email is stored for verification
    }
  }, [emailForVerification, navigate]);

  useEffect(() => {
    let timerId;
    if (!canResendCode && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResendCode(true);
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [canResendCode, resendTimer]);

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
    if (error) setError('');
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!verificationCode.trim()) {
      setError('Verification code is required.');
      setIsLoading(false);
      return;
    } else if (!/^\d{6}$/.test(verificationCode)) {
      setError('Code must be 6 digits.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Verifying code:", verificationCode);
      const userData = {
                email: emailForVerification,
                otp: verificationCode,
              };
      console.log("Verifying code1:", userData);
      extCompanyUserRegVerifyOTP(userData)
        .then((response) => {
          console.log("OTP Verified", response);
          if (response.status === (200 || 201)){
            // navigate("/")
            setVerificationCode(true);
            setError('');
            navigate("/")
            
          }else if(response.status === 401)
          {
            setCanResendCode(false);  
            setError('Invalid verification code. Pls Resend Code');
              
          }
          
        }).catch(error => {
                console.error("Error registering verification Code:", error);
                setError('Invalid verification code. Pls Resend Code');
                setIsLoading(false)
        });

      // if (verificationCode === '123456') { // Mock correct code
      //   // localStorage.setItem('isAuthenticated', 'true');
      //   localStorage.setItem('userEmail', emailForVerification);
      //   // Assuming username is derived or was stored temporarily. For simplicity, using a default.
      //   localStorage.setItem('userName', emailForVerification.split('@')[0] || 'User'); 
      //   localStorage.removeItem('emailForVerification');
      //   window.location.href = '/'; // Force reload to update App state
      // } else {
      //   setError('Invalid verification code. Hint: try 123456');
      //   setIsLoading(false);
      // }
    }, 1000);
  };

  const handleResendCode = () => {
    if (!canResendCode) return;
    console.log("Simulating resending verification code to:", emailForVerification);
    // Add actual resend logic here if needed (e.g., API call)
    alert(`A new verification code has been sent to ${emailForVerification}. (Check console)`);
    setResendTimer(30);
    setCanResendCode(false);
    setVerificationCode('');
    setError('');
    const userData = {
                userEmail: emailForVerification,


              };
    extCompanyUserRegResendOTP(userData)
          .then((response) => {
            console.log("OTP Resend Verified", response);
            if (response.status === (200 || 201)){
              // navigate("/")
              setCanResendCode(false)
              setError('');
              console.log("ResendCode:", response)
             
            }else 
            {
              setCanResendCode(true);  
              console.log("ResendCode:", response)
                
            }
            
          }).catch(error => {
                  console.error("Error registering verification Code:", error);
          });
  };

  if (!emailForVerification) {
    return null; // Or a loading spinner while redirecting
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-theme-primary" />
          <h2 className="mt-6 text-3xl font-bold">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            A 6-digit verification code has been sent to <br />
            <span className="font-medium text-theme-primary">{emailForVerification}</span>.
          </p>
        </div>

        <div className={`mt-8 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleVerifyCode}>
            <InputField 
              id="verificationCode" 
              label="Verification Code" 
              type="text" 
              value={verificationCode} 
              onChange={handleChange} 
              error={null} // Error is handled globally for the form
              icon={<ShieldCheck />} 
              placeholder="Enter 6-digit code"
              maxLength={6}
            />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-70"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResendCode}
              disabled={!canResendCode}
              className={`text-sm font-medium ${canResendCode ? 'text-theme-primary hover:text-opacity-80' : 'text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
            >
              {canResendCode ? (
                <>
                  <RefreshCw className="inline w-3 h-3 mr-1" /> Resend Code
                </>
              ) : (
                `Resend in ${resendTimer}s`
              )}
            </button>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Entered the wrong email? <Link to="/login" className="font-medium text-theme-primary hover:text-opacity-80">Go back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
