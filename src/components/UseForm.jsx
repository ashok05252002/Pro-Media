import React, { useState } from 'react';
import Stepper from 'react-stepper-horizontal';
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import LastStep from "./LastStep";
import { useNavigate, Link } from 'react-router-dom';
import { extCompanyUserRegister, extCompanyUserRegVerifyOTP } from '../API/api';

const StepperForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState({
    companyName: "Tostot",
    companyType: "IT and services",
    website: "www.tostot.com",
    phone_1: "9940661236",
    phone_2: "9500198386",
    email: "contact@tostot.com",
    addressLine1: "vishnu nagar",
    addressLine2: "Rajapalayam",
    state: "Tamilnadu",
    zipcode: "626108",
    country: "India",
    username: "Vijaya.k",
    firstname: "Vijaya",
    lastname: "Kumaran",
    userEmail: "vjkumaran12@gmail.com",
    pwd: "password123",
    OTPCode: "",
  });

  const steps = [
    { title: 'Company details' },
    { title: 'Company Address' },
    { title: 'Personal Details' },
  ];

  const handleChange = (input) => (e) => {
    setUserInput({ ...userInput, [input]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);

    const userData = {
      company: {
        name: userInput.companyName,
        type: userInput.companyType,
        website: userInput.website,
        status: "A",
        verification_flag: 1,
        verified_by_id: 1
      },
      company_address: {
        phone1: userInput.phone_1,
        phone2: userInput.phone_2,
        email: userInput.email,
        address_line1: userInput.addressLine1,
        address_line2: userInput.addressLine2,
        state: userInput.state,
        zipcode: userInput.zipcode,
        country: userInput.country,
        status: "A"
      },
      user: {
        username: userInput.username,
        first_name: userInput.firstname,
        last_name: userInput.lastname,
        phone: "",
        email: userInput.userEmail,
        password: userInput.pwd,
        role: "admin",
        status: "A"
      }
    };

    extCompanyUserRegister(userInput)
      .then((response) => {
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          console.log("Submitted successfully");
          return <ThirdStep handleChange={handleChange} />;
        }
        
      }).catch(error => {
              console.error("Error registering company User:", error);
      });

  };

  const handleOTPVerify = () => {
    const userData = {
      email: userInput.userEmail,
      otp: userInput.OTPCode,
    };

    extCompanyUserRegVerifyOTP(userInput)
      .then((response) => {
        console.log("OTP Verified", response);
        if (response.status === (200 || 201)){
          navigate("/")
        }
        
      }).catch(error => {
              console.error("Error registering company User:", error);
      });
  };

  const renderForm = () => {
    switch (currentStep) {
      case 0: return <FirstStep handleChange={handleChange} />;
      case 1: return <SecondStep handleChange={handleChange} />;
      case 2: return <ThirdStep handleChange={handleChange} />;
      case 3: return <LastStep handleChange={handleChange} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-8 space-y-6">
        {currentStep < 3 && (
          <Stepper steps={steps} activeStep={currentStep} activeColor="#9ACD32" completeColor="#9ACD32" />
        )}

        <div className="text-gray-800">
          {renderForm()}
        </div>

        {currentStep === 3 && (
          <div className="text-center">
            <button
              onClick={handleOTPVerify}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </div>
        )}

        {currentStep < 3 && (
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
              className={`px-6 py-2 rounded font-semibold ${
                currentStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={currentStep === 0}
            >
              Previous
            </button>

            <button
              onClick={currentStep === 2 ? handleSubmit : () => setCurrentStep(prev => prev + 1)}
              className="px-6 py-2 bg-theme-primary text-white font-semibold rounded hover:bg-green-700"
            >
              {currentStep === 2 ? 'Submit' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepperForm;
