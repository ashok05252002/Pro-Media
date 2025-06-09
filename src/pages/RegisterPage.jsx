import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, UserCircle, CheckCircle, ArrowRight, ArrowLeft, Mail, Lock, ShieldCheck, RefreshCw } from 'lucide-react'; // Added ShieldCheck
import { useTheme } from '../contexts/ThemeContext';
import { extCompanyUserRegister, extCompanyUserRegVerifyOTP, extCompanyUserRegResendOTP, } from "../API/api";

const Stepper = ({ currentStep }) => {
  const steps = [
    { name: 'Company Details', icon: <Building className="w-5 h-5" /> }, // Icon color will be handled by class
    { name: 'Account Creation', icon: <UserCircle className="w-5 h-5" /> },
    { name: 'Verification', icon: <ShieldCheck className="w-5 h-5" /> }, // Changed icon and name
  ];

  return (
    <nav aria-label="Progress" className="mb-12">
      <ol role="list" className="flex items-center gap-24">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {stepIdx < currentStep - 1 ? ( // Completed step
              <>
                <div className="absolute inset-0 w-40 top-1/2 transform -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-theme-primary"></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-theme-primary hover:bg-opacity-90">
                  {React.cloneElement(step.icon, { className: "w-5 h-5 text-white" })}
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs text-center mt-2 text-theme-primary font-medium whitespace-nowrap">{step.name}</span>
              </>
            ) : stepIdx === currentStep - 1 ? ( // Current step
              <>
                <div className="absolute inset-0 top-1/2  transform -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${stepIdx === 0 ? 'bg-transparent' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-theme-primary bg-white dark:bg-gray-800">
                  {React.cloneElement(step.icon, { className: "w-5 h-5 text-theme-primary" })}
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs text-center mt-2 text-theme-primary font-medium whitespace-nowrap">{step.name}</span>
              </>
            ) : ( // Future step
              <>
                <div className="absolute inset-0 top-1/2 transform -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500">
                  {React.cloneElement(step.icon, { className: "w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" })}
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs text-center mt-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{step.name}</span>
              </>
            )}
            {stepIdx < steps.length - 1 && (
              <div className="absolute inset-0 w-24 top-1/2 left-full transform -translate-y-1/2 w-24 hidden sm:block" aria-hidden="true">
                <div className={`h-0.5 w-full ${stepIdx < currentStep - 1 ? 'bg-theme-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const InputField = ({ id, label, type, value, onChange, error, icon, required = true, placeholder, maxLength }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
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

const SelectField = ({ id, label, value, onChange, error, children, icon, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{React.cloneElement(icon, { className: "w-5 h-5 text-gray-400" })}</div>}
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm dark:bg-gray-700 dark:text-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-theme-primary focus:border-theme-primary'
          }`}
      >
        {children}
      </select>
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);


const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    employeeSize: '',
    companyEmail: '',
    fullName: '',
    userEmail: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });
  const [errors, setErrors] = useState({});
  const [codeVerified, setCodeVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResendCode, setCanResendCode] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const companyTypes = ["Software", "Marketing", "E-commerce", "Consulting", "Healthcare", "Education", "Other"];
  const employeeSizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

  useEffect(() => {
    let timerId;
    if (currentStep === 3 && !codeVerified && !canResendCode && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResendCode(true);
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [currentStep, codeVerified, canResendCode, resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!formData.companyType) newErrors.companyType = 'Company type is required.';
    if (!formData.employeeSize) newErrors.employeeSize = 'Employee size is required.';
    if (!formData.companyEmail.trim()) newErrors.companyEmail = 'Company email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) newErrors.companyEmail = 'Invalid email format.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.userEmail.trim()) newErrors.userEmail = 'User email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) newErrors.userEmail = 'Invalid email format.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyCode = () => {
    const newErrors = {};
    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = 'Verification code is required.';
    } else if (!/^\d{6}$/.test(formData.verificationCode)) {
      newErrors.verificationCode = 'Code must be 6 digits.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate API call for code verification
    console.log("Verifying code:", formData.verificationCode);
    const userData = {
      email: formData.userEmail,
      otp: formData.verificationCode,
    };
    console.log("Verifying code1:", userData);
    extCompanyUserRegVerifyOTP(userData)
      .then((response) => {
        console.log("OTP Verified", response);
        if (response.status === (200 || 201)) {
          // navigate("/")
          setCodeVerified(true);
          setErrors({});

        } else if (response.status === 401) {
          setCanResendCode(false);
          setErrors({ message: 'Invalid verification code. Pls Resend Code' });

        }

      }).catch(error => {
        console.error("Error registering verification Code:", error);
      });
    // For demo, assume code '123456' is correct
    // if (formData.verificationCode === '123456') {
    //   setCodeVerified(true);
    //   setErrors({});
    //   console.log("Registration Data (after code verification):", formData);
    // } else {
    //   setErrors({ message:'Invalid verification code. Try 123456.' });
    // }
  };

  const handleResendCode = () => {
    console.log("Simulating resending verification code to:", formData.userEmail);
    setResendTimer(30);
    setCanResendCode(false);
    setFormData(prev => ({ ...prev, verificationCode: '' })); // Clear previous code
    setErrors(prev => ({ ...prev, verificationCode: '' })); // Clear code error
    extCompanyUserRegResendOTP(formData)
      .then((response) => {
        console.log("OTP Resend Verified", response);
        if (response.status === (200 || 201)) {
          // navigate("/")
          setCanResendCode(false)
          setErrors({});
          console.log("ResendCode:", response)

        } else {
          setCanResendCode(true);
          console.log("ResendCode:", response)

        }

      }).catch(error => {
        console.error("Error registering verification Code:", error);
      });

    // Optionally, show a temporary message like "New code sent!"
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    } else if (currentStep === 2 && validateStep2()) {

      setCodeVerified(false); // Reset verification status when entering step 3
      extCompanyUserRegister(formData)
        .then((response) => {
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            console.log("Submitted successfully");
            setCurrentStep(3);
            setCodeVerified(false);
            setResendTimer(30); // Reset timer for step 3
            setCanResendCode(false);
            setErrors({});
            // const userData = {
            //       email: userInput.userEmail,
            //       otp: userInput.OTPCode,
            //     };

            //     extCompanyUserRegVerifyOTP(userInput)
            //       .then((response) => {
            //         console.log("OTP Verified", response);
            //         if (response.status === (200 || 201)){
            //           navigate("/")
            //         }

            //       }).catch(error => {
            //               console.error("Error registering company User:", error);
            //       });
          }
          else {
            setErrors({ message: "Error registering company User:" })
          }

          console.log();
          

        }).catch(error => {
          setErrors({ message: error?.response?.data?.error ?? error.message })
          // setErrors({ message: error.message })
          console.error("Error registering company User:", error);
        });
      setErrors({});
      // Simulate sending verification code email
      console.log("Simulating sending verification code to:", formData.userEmail);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCodeVerified(false); // Reset verification if going back from step 3
      setErrors({});
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join us and streamline your social media management.</p>
        </div>

        <div className={`py-8 px-6 sm:px-10 shadow-xl rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-center w-full">
            <Stepper currentStep={currentStep} />
          </div>
          <h5 className="text-red-500 text-sm mt-1 mb-2">
            {errors?.message ? errors.message : ""}
          </h5>

          {currentStep === 1 && (
            <form className="space-y-6" noValidate>
              <InputField id="companyName" label="Company Name" type="text" value={formData.companyName} onChange={handleChange} error={errors.companyName} icon={<Building />} placeholder="Your Company Inc." />
              <SelectField id="companyType" label="Company Type" value={formData.companyType} onChange={handleChange} error={errors.companyType} icon={<Building />}>
                <option value="">Select type...</option>
                {companyTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </SelectField>
              <SelectField id="employeeSize" label="Employee Size" value={formData.employeeSize} onChange={handleChange} error={errors.employeeSize} icon={<UserCircle />}>
                <option value="">Select size...</option>
                {employeeSizes.map(size => <option key={size} value={size}>{size}</option>)}
              </SelectField>
              <InputField id="companyEmail" label="Company Email ID" type="email" value={formData.companyEmail} onChange={handleChange} error={errors.companyEmail} icon={<Mail />} placeholder="contact@yourcompany.com" />
            </form>
          )}

          {currentStep === 2 && (
            <form className="space-y-6" noValidate>
              <InputField id="fullName" label="Full Name" type="text" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={<UserCircle />} placeholder="John Doe" />
              <InputField id="userEmail" label="Your Email" type="email" value={formData.userEmail} onChange={handleChange} error={errors.userEmail} icon={<Mail />} placeholder="you@example.com" />
              <InputField id="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} icon={<Lock />} placeholder="Min. 8 characters" />
              <InputField id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={<Lock />} placeholder="Re-enter your password" />
            </form>
          )}

          {currentStep === 3 && (
            <>
              {!codeVerified ? (
                <div className="space-y-6">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    A 6-digit verification code has been sent to {formData.userEmail}. Please enter it below. (Hint: try 123456)
                  </p>
                  <InputField
                    id="verificationCode"
                    label="Verification Code"
                    type="text"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    error={errors.verificationCode}
                    icon={<ShieldCheck />}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                  <div className="text-center">
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
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Verification Successful!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your account has been created and verified. You can now log in.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
                  >
                    Go to Login
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-10 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || (currentStep === 3 && codeVerified)}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary ${(currentStep === 1 || (currentStep === 3 && codeVerified)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
            {currentStep === 3 && !codeVerified && (
              <button
                type="button"
                onClick={handleVerifyCode}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
              >
                Verify Code
                <ShieldCheck className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
        {currentStep < 3 && (
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-theme-primary hover:text-opacity-80">
              Login here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
