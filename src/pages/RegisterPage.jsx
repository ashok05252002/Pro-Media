import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, MapPin, UserCircle, CheckCircle, ArrowRight, ArrowLeft, Mail, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Stepper = ({ currentStep }) => {
  const steps = [
    { name: 'Company Details', icon: <Building className="w-5 h-5 text-white" /> },
    { name: 'Account Creation', icon: <UserCircle className="w-5 h-5 text-white" /> },
    { name: 'Success', icon: <CheckCircle className="w-5 h-5 text-white" /> },
  ];

  const iconColorLogic = (stepIdx, currentStep) => {
    if (stepIdx < currentStep -1) return 'text-white'; // Completed step icon
    if (stepIdx === currentStep -1) return 'text-theme-primary'; // Current step icon (inside border)
    return 'text-gray-400 dark:text-gray-500'; // Future step icon
  };


  return (
    <nav aria-label="Progress" className="mb-12"> {/* Increased bottom margin for better spacing */}
      <ol role="list" className="flex items-center gap-4 sm:gap-6 lg:gap-20">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}> {/* Use flex-1 for li to distribute space */}
            {stepIdx < currentStep -1 ? ( // Completed step
              <>
                <div className="absolute inset-0 top-1/2 transform -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-theme-primary"></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-theme-primary hover:bg-opacity-90">
                   {React.cloneElement(step.icon, { className: "w-5 h-5 text-white"})}
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs text-center mt-2 text-theme-primary font-medium whitespace-nowrap">{step.name}</span>
              </>
            ) : stepIdx === currentStep -1 ? ( // Current step
              <>
                <div className="absolute inset-0 top-1/2 transform -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${stepIdx === 0 ? 'bg-transparent' : 'bg-gray-200 dark:bg-gray-700'}`}></div> {/* No line before first step */}
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-theme-primary bg-white dark:bg-gray-800">
                  {React.cloneElement(step.icon, { className: "w-5 h-5 text-theme-primary"})}
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs text-center mt-2 text-theme-primary font-medium whitespace-nowrap">{step.name}</span>
              </>
            ) : ( // Future step
              <>
                <div className="absolute inset-0 top-1/2 transform -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500">
                  {React.cloneElement(step.icon, { className: "w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"})}
                </div>
                 <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs text-center mt-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{step.name}</span>
              </>
            )}
             {/* Connector line for all but the last item */}
            {stepIdx < steps.length - 1 && (
              <div className="absolute inset-0 top-1/2 left-full transform -translate-y-1/2 w-24 hidden sm:block" aria-hidden="true"> {/* Hide on small screens if it causes overflow */}
                 <div className={`h-0.5 w-full ${stepIdx < currentStep - 1 ? 'bg-theme-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const InputField = ({ id, label, type, value, onChange, error, icon, required = true, placeholder }) => (
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
        className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm dark:bg-gray-700 dark:text-white ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-theme-primary focus:border-theme-primary'
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
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{React.cloneElement(icon, { className: "w-5 h-5 text-gray-400"})}</div>}
       <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm dark:bg-gray-700 dark:text-white ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-theme-primary focus:border-theme-primary'
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
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const companyTypes = ["Software", "Marketing", "E-commerce", "Consulting", "Healthcare", "Education", "Other"];
  const employeeSizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

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

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      // Simulate registration success
      console.log("Registration Data:", formData);
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors when going back
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
          <div className="flex justify-center  w-100px"> {/* Centering wrapper for Stepper */}
            <Stepper currentStep={currentStep} />
          </div>

          {currentStep === 1 && (
            <form className="space-y-6" noValidate>
              <InputField id="companyName" label="Company Name" type="text" value={formData.companyName} onChange={handleChange} error={errors.companyName} icon={<Building />} placeholder="Your Company Inc."/>
              <SelectField id="companyType" label="Company Type" value={formData.companyType} onChange={handleChange} error={errors.companyType} icon={<Building />}>
                <option value="">Select type...</option>
                {companyTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </SelectField>
              <SelectField id="employeeSize" label="Employee Size" value={formData.employeeSize} onChange={handleChange} error={errors.employeeSize} icon={<UserCircle />}>
                <option value="">Select size...</option>
                {employeeSizes.map(size => <option key={size} value={size}>{size}</option>)}
              </SelectField>
              <InputField id="companyEmail" label="Company Email ID" type="email" value={formData.companyEmail} onChange={handleChange} error={errors.companyEmail} icon={<Mail />} placeholder="contact@yourcompany.com"/>
            </form>
          )}

          {currentStep === 2 && (
            <form className="space-y-6" noValidate>
              <InputField id="fullName" label="Full Name" type="text" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={<UserCircle />} placeholder="John Doe"/>
              <InputField id="userEmail" label="Your Email" type="email" value={formData.userEmail} onChange={handleChange} error={errors.userEmail} icon={<Mail />} placeholder="you@example.com"/>
              <InputField id="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} icon={<Lock />} placeholder="Min. 8 characters"/>
              <InputField id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={<Lock />} placeholder="Re-enter your password"/>
            </form>
          )}

          {currentStep === 3 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Registration Successful!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your account has been created. You can now log in to manage your social media.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
              >
                Go to Login
              </button>
            </div>
          )}

          {currentStep < 3 && (
            <div className="mt-10 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-theme-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
              >
                {currentStep === 2 ? 'Complete Registration' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
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
