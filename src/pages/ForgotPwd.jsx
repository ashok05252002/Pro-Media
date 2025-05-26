import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios";
import { extCompanyUserForgetpwd , extCompanyUserResetpwd } from "../API/api";

const ForgotPwd = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showResetInput, setShowResetInput] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");
   

    try {
      // const response = await axios.post("http://127.0.01:5000/company/forgetpasswrd", {
      //   email: email,
      // });
      const response = await extCompanyUserForgetpwd (email)
      if (response.data.success) {
        setShowOtpInput(true);
        setMessage("OTP sent to your mail");
        return;
       
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
    const userData = {
      "email":email,
      "otp":otp,
      "new_password": newPassword,
    }
    try {
      // const response = await axios.post("http://127.0.01:5000/company/reset-password", {
      //   "email":email,
      //   "otp":otp,
      //   "new_password": newPassword,
      // });
      const response = await extCompanyUserResetpwd(userData)
      if (response.data.success) {
        setMessage("Password reset successful!");
        setShowResetInput(false);
        setShowOtpInput(false);
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

  const handleCancel = () => {
    setShowOtpInput(false);
    setShowResetInput(false);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setMessage("");
    navigate ("/login")
    
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Forgot Password</h2>
      

      {/* Email Input */}
      {!showOtpInput && (
        <>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />
          <button onClick={handleSendOtp} style ={{marginBottom:"50px",backgroundColor:"skyblue", borderColor:"darkblue", borderWidth:"2px"}} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}
      <div>{message && <p style={{ color: "green" }}>{message}</p>}</div>

      {/* OTP and Reset Form */}
      {!showOtpInput && (
        <><div></div>
          <label style={{marginTop:100}}>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />

          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />

          <button onClick={handleResetPassword} style ={{backgroundColor:"skyblue", borderColor:"darkblue", borderWidth:"2px"}} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button onClick={handleCancel} style={{ marginLeft: "10px", backgroundColor:"grey", borderColor:"black", borderWidth:"2px" }}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPwd;
