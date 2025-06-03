import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { extCompanyUserForgetpwd, extCompanyUserRegResendOTP, extCompanyUserRegVerifyOTP } from "../API/api";

const InputField = ({ id, label, type, value, onChange, error, icon, placeholder, maxLength }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {type !== 'checkbox' && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{React.cloneElement(icon, { className: "w-5 h-5 text-gray-400" })}</div>}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm dark:bg-gray-700 dark:text-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-theme-primary focus:border-theme-primary'
          }`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);


const ForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1 for email, 2 for OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResendCode, setCanResendCode] = useState(false);

  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    let timerId;
    if (currentStep === 2 && !canResendCode && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && currentStep === 2) {
      setCanResendCode(true);
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [currentStep, canResendCode, resendTimer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    // Simulate sending OTP
    console.log(`Simulating sending OTP to ${email}`);
    try {
      // const response = await axios.post("http://127.0.01:5000/company/forgetpasswrd", {
      //   email: email,
      // });
      const response = await extCompanyUserForgetpwd(email)
      console.log(response);

      if (response.status == 200) {
        setTimeout(() => {
          // No longer storing in localStorage
          setCurrentStep(2);
          setResendTimer(30);
          setCanResendCode(false);
          setIsLoading(false);
        }, 1000);
        setMessage("OTP sent to your mail");
        return;

      } else {
        setMessage(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setError(false);
    }

  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim() || !/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    console.log(`Verifying OTP ${otp} for email ${email}`);
    const userInput = {
      "email": email,
      "otp": otp
    }
    try {
      const result = await extCompanyUserRegVerifyOTP(userInput);
      console.log(result);
      if (result.status == 200) {
        navigate('/resetpwd', { state: { emailForReset: email } });
      } else {
        setError('Invalid OTP. Please try again. (Hint: 123456)');
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendCode) return;
    console.log(`Simulating resending OTP to ${email}`);
    try {
      const result = await extCompanyUserRegResendOTP(email); 
      if (result.status == 200) { 
        alert(`A new OTP has been sent to ${email}. (Check console)`);
        setResendTimer(30);
        setCanResendCode(false);
        setIsLoading(false);
        setOtp('');
        setError('');
      } else {
        // setError('Invalid OTP. Please try again. (Hint: 123456)');
      }
    } catch (error) {
      console.log(error);
      console.log(`error while resending OTP to ${email}`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-theme-primary" />
          <h2 className="mt-6 text-3xl font-bold">Forgot Your Password?</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {currentStep === 1
              ? "Enter your registered email address to receive a verification code."
              : `A 6-digit code was sent to ${email || 'your email'}. Enter it below.`}
          </p>
        </div>

        <div className={`mt-8 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {currentStep === 1 && (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <InputField
                id="email"
                label="Registered Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail />}
                placeholder="you@example.com"
              />
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-70"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <InputField
                id="otp"
                label="Verification Code (OTP)"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                icon={<ShieldCheck />}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-70"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
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
            </form>
          )}
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Remembered your password? <Link to="/login" className="font-medium text-theme-primary hover:text-opacity-80">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
