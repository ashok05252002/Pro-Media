import React, { useState } from 'react';
import { Edit, Mail, Phone, User, Building, Globe, MapPin, Briefcase, ShieldCheck, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';


// Mock data based on the provided JSON structure
const profileData = {
  
  address: {
    address_line1: "123 Tech Street",
    address_line2: "Suite 200",
    country: "USA",
    email: "contact@techcorp.com",
    phone1: "123-456-7890",
    phone2: "098-765-4321",
    state: "California",
    status: "A",
    zipcode: "90001"
  },
  company: {
    id: 1,
    name: "TechCorp",
    status: "A",
    type: "Software",
    website: "https://www.techcorp.com"
  },
  user: {
    email: "demo@gmail.com",
    first_name: "John",
    id: 1,
    last_name: "Doe",
    phone: "123-456-7890",
    role: "Social Media Manager",
    status: "A",
    username: "Demouser"
  }
};

const ProfileSection = ({ title, icon, children }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6`}>
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
      <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center`}>
        {icon && React.cloneElement(icon, { className: "w-4 h-4 mr-2 opacity-70"})}
        {label}
      </label>
      <p className={`text-md ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} break-words`}>
        {value || '-'}
      </p>
    </div>
  );
};




const Profile = () => {
  const { user, company, address } = profileData;
  const { isDarkMode, themeColors } = useTheme();
  const [isEditing, setIsEditing] = useState(false); // Placeholder for edit functionality
  const userName = localStorage.getItem('username');
  const userEmail = localStorage.getItem('userEmail');
  const getStatusLabel = (status) => status === 'A' ? 'Active' : 'Inactive';
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)} // Placeholder
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
            src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=${themeColors.primary.substring(1)}&color=fff&size=96`}
            alt={userName} 
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold">{userName}</h2>
            <p className="text-theme-primary font-medium capitalize">{user.role}</p>
            <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user.email}</span>
            </div>
             <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 mr-2" />
              <span>{user.phone}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Details */}
      <ProfileSection title="User Information" icon={<User />}>
        <ProfileField label="First Name" value={userName} />
        <ProfileField label="Last Name" value={user.last_name} />
        <ProfileField label="Username" value={user.username} />
        <ProfileField label="Role" value={user.role} icon={<Briefcase />} />
        <ProfileField label="Email" value={user.email} icon={<Mail />} />
        <ProfileField label="Phone" value={user.phone} icon={<Phone />} />
        <ProfileField label="Status" value={getStatusLabel(user.status)} icon={<ShieldCheck />} />
      </ProfileSection>
      
      {/* Company Details */}
      <ProfileSection title="Company Information" icon={<Building />}>
        <ProfileField label="Company Name" value={company.name} />
        <ProfileField label="Company Type" value={company.type} />
        <ProfileField label="Website" value={company.website} icon={<Globe />} />
        <ProfileField label="Company Status" value={getStatusLabel(company.status)} icon={<ShieldCheck />} />
      </ProfileSection>
      
      {/* Address Details */}
      <ProfileSection title="Address Information" icon={<MapPin />}>
        <ProfileField label="Address Line 1" value={address.address_line1} colSpan="md:col-span-2" />
        {address.address_line2 && <ProfileField label="Address Line 2" value={address.address_line2} colSpan="md:col-span-2" />}
        <ProfileField label="City / State" value={`${address.state}`} />
        <ProfileField label="Zip Code" value={address.zipcode} />
        <ProfileField label="Country" value={address.country} />
        <ProfileField label="Contact Email" value={address.email} icon={<Mail />} />
        <ProfileField label="Primary Phone" value={address.phone1} icon={<Phone />} />
        {address.phone2 && <ProfileField label="Secondary Phone" value={address.phone2} icon={<Phone />} />}
        <ProfileField label="Address Status" value={getStatusLabel(address.status)} icon={<ShieldCheck />} />
      </ProfileSection>

      <div className="mt-8 text-center">
        <button 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition-colors mx-auto"
            onClick={() => {
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/login';
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
