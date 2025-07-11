import React, { useState } from "react";
import { Lock, Eye, EyeOff } from 'lucide-react';
import { verify_password } from "../API/api";

const InputField = ({ id, label, type, value, onChange, error, icon, placeholder, toggleVisibility, showPassword }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(icon, { className: "w-5 h-5 text-gray-400" })}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm dark:bg-gray-700 dark:text-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-theme-primary focus:border-theme-primary'}`}
      />
      {toggleVisibility && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={toggleVisibility}
        >
          {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
        </button>
      )}
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const ShowChangePassword = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccessMessage("");

  if (!newPassword || !confirmPassword) {
    setError("Both password fields are required.");
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    setError("Password must be at least 8 characters long and include at least one letter and one number.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (password === newPassword) {
    setError("New password cannot be the same as the current password.");
    return;
  }

  setLoading(true);

  const payload = { password, new_password: newPassword };

  try {
    const verifyRes = await verify_password(payload);

    if (verifyRes.status === 200) {
      setSuccessMessage("Password updated successfully!");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError("Failed to update password.");
    }
  } catch (err) {
    if (err?.response?.status === 401 || err?.response?.status === 400) {
      setError("Current password is incorrect.");
    } else {
      setError(err?.response?.data?.error || "Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Change Your Password</h3>
        <Lock className="mx-auto h-12 w-12 text-theme-primary" />
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            id="password"
            label="Current Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock />}
            placeholder="Enter current password"
            toggleVisibility={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
          />

          <InputField
            id="newPassword"
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
            icon={<Lock />}
            placeholder="Enter new password (min. 8 chars)"
            toggleVisibility={() => setShowNewPassword(!showNewPassword)}
            showPassword={showNewPassword}
            error={error.includes("match") || error.includes("least") ? error : ""}
          />

          <InputField
            id="confirmPassword"
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            icon={<Lock />}
            placeholder="Re-enter new password"
            toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            showPassword={showConfirmPassword}
            error={error.includes("match") ? error : ""}
          />

          {error && !error.includes("match") && !error.includes("least") && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          {successMessage && (
            <p className="text-sm text-green-500 mt-2">{successMessage}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShowChangePassword;
