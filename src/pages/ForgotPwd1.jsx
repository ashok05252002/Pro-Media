import React, { useState } from "react";
import axios from "axios";

const ForgotPwd = () => {
  const [step, setStep] = useState(1);
  const [boolOTP, setBoolOTP] = useState(true)
  const [boolResetPwd, setBoolResetPwd] = useState(false)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(import.meta.env.VITE_BASE_API_URL  +"/company/forgetpasswrd", {
        email: email,
      });

      if (response.data.success) {
        setMessage("OTP sent to your mail");
        setStep(2)
        console.log("setStep")
       
      } else {
        setMessage(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setMessage("Please enter OTP and new password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(import.meta.env.VITE_BASE_API_URL +"/company/reset-password", {
        "email":email,
        "otp":otp,
        "new_password":newPassword,
      });

      if (response.data.success) {
        setMessage("Password reset successful!");
        // Optionally redirect to login
      } else {
        setMessage(response.data.message || "Invalid OTP or error occurred.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {console.log("return", step)}
      {step === 1 && (
        <>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />
          <button onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
           

          </button>
        </>
      )}
      <p>current Step: {step}</p>

      {step === 2 && (
      
        <>
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />

          <label>New Password:</label>

          {/* {message === 'OTP sent to your email' && ( */}
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPwd;
