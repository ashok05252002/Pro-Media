import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { extCompanyLogin, extCompanyUserRegResendOTP } from '../API/api';

const Login = () => {
  const [formData, setFormData] = useState({
    // email: "demo@gmail.com",
    // password: "DemoPassword",

    email: "kdharini25@gmail.com",
    password: "Password@123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const requestSent = useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!requestSent.current) {
      requestSent.current = true;
      console.log(formData)
      extCompanyLogin(formData)
        .then((response) => {
          const { user, token } = response.data;
          if (response.status === (200 || 201)){
            localStorage.setItem("username", user.fullName);
            localStorage.setItem("authToken", token);

            console.log("Login successful");
            navigate("/dashboard");
          }
          
          else if (response.status === 203)
          {
            localStorage.setItem("emailForVerification", formData.email);
            const userData = {
                            userEmail: formData.email,
            
            
                          };
                extCompanyUserRegResendOTP(userData)
                      .then((response) => {
                        console.log("OTP Resend Verified", response);
                        if (response.status === (200 || 201)){
                          // navigate("/")
                          
                          // setError('');
                          console.log("ResendCode:", response)
                          navigate("/VerifyEmailPage",  { replace: true });
                         
                        }else 
                        {
                          
                          console.log("ResendCode:", response)
                            
                        }
                        
                      }).catch(error => {
                              console.error("Error registering verification Code:", error);
                      });

          }
        })
        .catch((err) => {
          console.error("Login failed 1:", err);
          console.error("Login failed 2:", err.message);
          console.error("Login failed 3:", err.status);
          // setError("Invalid Username and Password");
          // setError(err?.response?.data?.error)
          setError((err?.response?.data?.error)?(err?.response?.data?.error):err.message)
          console.log("VerificationEmail :", formData.email)
          
        })
        .finally(() => {
          setIsLoading(false);
          requestSent.current = false;
        });
    } else {
      console.log("API request already sent");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onClickRegister = () => {
    navigate("/register");
  };

  return (
   <div
  className={`bg-gray-100`}>
  <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-b;ack">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-900">Sign in to your social media management account</p>
      </div>

      <div className={`mt-8 bg-white/30 backdrop-blur-md py-10 px-6 shadow-2xl border border-orange-200 sm:rounded-3xl sm:px-12 transition-all duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 text-white' : ''}`}>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-900' : 'text-gray-700'}`}>Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-900' : 'text-gray-700'}`}>Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
              />
              <span className={`${isDarkMode ? 'text-gray-900' : 'text-gray-700'}`}>Remember me</span>
            </label>
            <Link to="/forgotpwd" className="text-orange-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg transition disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="w-full flex justify-center text-gray-800 text-sm">or</div>

          {/* Sign Up */}
          {/* <button
            type="button"
            onClick={onClickRegister}
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold shadow-md transition disabled:opacity-70"
          >
            {isLoading ? 'Redirecting...' : 'Sign Up'}
          </button> */}
          <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[#F97316] hover:text-[#F97316]/80">
                Register here
              </Link>
            </div>
        </form>

        {/* Social */}
        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href="#"
              className={`w-full flex justify-center items-center py-2 px-4 rounded-xl border shadow-sm text-sm font-medium transition-all ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Google
            </a>
            <a
              href="#"
              className={`w-full flex justify-center items-center py-2 px-4 rounded-xl border shadow-sm text-sm font-medium transition-all ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Login;