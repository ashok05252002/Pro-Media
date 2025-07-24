import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Check, ChevronDown, Bell, Globe, Lock, Palette, Users, Moon, Sun, ExternalLink } from 'lucide-react'; // Added ExternalLink
import { useTheme, themeOptions } from '../contexts/ThemeContext';

const ThemePreview = ({ name, colors, isActive, onClick }) => {
  return (
    <div 
      className={`p-4 rounded-lg cursor-pointer transition-all ${isActive ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium capitalize">{name}</span>
        {isActive && <Check className="w-4 h-4 text-blue-500" />}
      </div>
      <div className="grid grid-cols-5 gap-1 mb-2">
        <div className="h-4 rounded" style={{ backgroundColor: colors.primary }}></div>
        <div className="h-4 rounded" style={{ backgroundColor: colors.secondary }}></div>
        <div className="h-4 rounded" style={{ backgroundColor: colors.accent }}></div>
        <div className="h-4 rounded" style={{ backgroundColor: colors.success }}></div>
        <div className="h-4 rounded" style={{ backgroundColor: colors.danger }}></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-8 rounded flex items-center justify-center text-xs text-white font-medium" style={{ backgroundColor: colors.primary }}>
          Primary
        </div>
        <div className="flex-1 h-8 rounded flex items-center justify-center text-xs text-white font-medium" style={{ backgroundColor: colors.accent }}>
          Accent
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const { isDarkMode, toggleTheme, colorScheme, changeColorScheme, availableThemes } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  
  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { id: 'account', name: 'Account', icon: <Users className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'privacy', name: 'Privacy & Security', icon: <Lock className="w-5 h-5" /> },
    { id: 'language', name: 'Language & Region', icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 p-4">
            <nav>
              <ul className="space-y-1">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-theme-primary text-white' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-medium mb-6">Appearance Settings</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Theme Mode</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => toggleTheme()}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                        !isDarkMode 
                          ? 'border-theme-primary bg-gray-50' 
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
                        <Sun className="w-6 h-6 text-yellow-500" />
                      </div>
                      <span className="font-medium">Light</span>
                    </button>
                    
                    <button
                      onClick={() => toggleTheme()}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                        isDarkMode 
                          ? 'border-theme-primary bg-gray-800' 
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-2 shadow-md">
                        <Moon className="w-6 h-6 text-blue-300" />
                      </div>
                      <span className="font-medium">Dark</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Color Scheme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableThemes.map((theme) => (
                      <ThemePreview
                        key={theme}
                        name={theme}
                        colors={themeOptions.colors[theme]}
                        isActive={colorScheme === theme}
                        onClick={() => changeColorScheme(theme)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-medium mb-6">Account Settings</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Manage your account settings, preferences, and view product information.
                </p>
                
                {/* Placeholder for other account settings */}
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">Subscription Details</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan: Pro</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Next Billing Date: August 15, 2025</p>
                  <button className="mt-2 text-sm text-theme-primary hover:underline">Manage Subscription</button>
                </div>

                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">Product Information</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Revisit our product's features, benefits, and pricing details on our landing page.
                  </p>
                  <Link
                    to="/landing"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-theme-secondary hover:bg-opacity-90 text-white rounded-md shadow-sm transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Product Landing Page</span>
                  </Link>
                </div>

                <div className="p-4 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-3">
                    Deleting your account is permanent and cannot be undone. All your data will be removed.
                  </p>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">
                    Delete My Account
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-medium mb-6">Notification Settings</h2>
                <p className="text-gray-500 dark:text-gray-400">Control when and how you receive notifications.</p>
                {/* Placeholder for notification settings */}
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                    <label htmlFor="emailNotifs" className="text-sm">Email Notifications</label>
                    <input type="checkbox" id="emailNotifs" className="form-checkbox h-5 w-5 text-theme-primary rounded focus:ring-theme-primary" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                    <label htmlFor="pushNotifs" className="text-sm">Push Notifications</label>
                    <input type="checkbox" id="pushNotifs" className="form-checkbox h-5 w-5 text-theme-primary rounded focus:ring-theme-primary" />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-medium mb-6">Privacy & Security</h2>
                <p className="text-gray-500 dark:text-gray-400">Manage your privacy settings and security preferences.</p>
                {/* Placeholder for privacy settings */}
                <div className="mt-4 space-y-4">
                    <button className="w-full text-left px-4 py-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">Change Password</button>
                    <button className="w-full text-left px-4 py-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">Two-Factor Authentication</button>
                    <button className="w-full text-left px-4 py-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">Download My Data</button>
                </div>
              </div>
            )}
            
            {activeTab === 'language' && (
              <div>
                <h2 className="text-xl font-medium mb-6">Language & Region</h2>
                <p className="text-gray-500 dark:text-gray-400">Choose your preferred language and regional settings.</p>
                {/* Placeholder for language settings */}
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="languageSelect" className="block text-sm font-medium mb-1">Language</label>
                        <select id="languageSelect" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700">
                            <option>English (US)</option>
                            <option>Español</option>
                            <option>Français</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="timezoneSelect" className="block text-sm font-medium mb-1">Timezone</label>
                        <select id="timezoneSelect" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700">
                            <option>(GMT-05:00) Eastern Time</option>
                            <option>(GMT-08:00) Pacific Time</option>
                            <option>(GMT+00:00) Greenwich Mean Time</option>
                        </select>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;