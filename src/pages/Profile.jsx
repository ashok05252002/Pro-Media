import React, { useEffect, useState } from 'react';
import { Edit, Mail, Phone, User, Building, Globe, Briefcase, ShieldCheck, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const ProfileSection = ({ title, icon, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        {React.cloneElement(icon, { className: "w-6 h-6 mr-3 text-theme-primary" })}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, icon, colSpan = "md:col-span-1" }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className={colSpan}>
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
        {icon && React.cloneElement(icon, { className: "w-4 h-4 mr-2 opacity-70" })}
        {label}
      </label>
      <p className={`text-md ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} break-words`}>
        {value || '-'}
      </p>
    </div>
  );
};

const Profile = () => {
  const { isDarkMode, themeColors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem('username');

  const getStatusLabel = (status) => status === 'A' ? 'Active' : 'Inactive';

  useEffect(() => {
  const authToken = localStorage.getItem('authToken'); // Or your specific token key

  axios.get("http://127.0.0.1:5001/company/profile-info", {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then((res) => {
      setProfileData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch profile data:", err);
      setLoading(false);
    });
}, []);


  if (loading) return <div className="text-center text-lg mt-10">Loading...</div>;
  if (!profileData) return <div className="text-center text-red-600 mt-10">Failed to load profile data</div>;

  const { user, company } = profileData;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md shadow-md transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span className='text-white'>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Header */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.fullName}&background=${themeColors.primary.substring(1)}&color=fff&size=96`}
            alt={user.fullName} 
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold">{userName || user.fullName}</h2>
            <p className="text-theme-primary font-medium capitalize">{user.role}</p>
            <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <ProfileSection title="User Information" icon={<User />}>
        <ProfileField label="Full Name" value={user.fullName} />
        <ProfileField label="Email" value={user.email} icon={<Mail />} />
        <ProfileField label="Role" value={user.role} icon={<Briefcase />} />
        <ProfileField label="Status" value={getStatusLabel(user.status)} icon={<ShieldCheck />} />
      </ProfileSection>

      {/* Company Info */}
      <ProfileSection title="Company Information" icon={<Building />}>
        <ProfileField label="Company Name" value={company.name} />
        <ProfileField label="Company Email" value={company.companyEmail} icon={<Mail />} />
        <ProfileField label="Company Type" value={company.type} />
        <ProfileField label="Status" value={getStatusLabel(user.status)} icon={<ShieldCheck />} />
      </ProfileSection>

      <div className="mt-8 text-center">
        <button 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition-colors mx-auto"
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('authToken')
            window.location.href = '/';
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className='text-white'>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;