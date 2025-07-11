import React, { useState } from 'react';
import { Check, ChevronDown, Bell, Globe, Lock, Palette, Users, Moon, Sun } from 'lucide-react';
import { useTheme, themeOptions } from '../contexts/ThemeContext';
import ShowChangePassword from '../components/ShowChangePassword';
import ShowLanguageAndRegion from '../components/ShowLanguageAndRegion';

const ThemePreview = ({ name, colors, isActive, onClick }) => {
  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-all ${isActive
          ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-blue-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
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
        <div
          className="flex-1 h-8 rounded flex items-center justify-center text-xs text-white font-medium"
          style={{ backgroundColor: colors.primary }}
        >
          Primary
        </div>
        <div
          className="flex-1 h-8 rounded flex items-center justify-center text-xs text-white font-medium"
          style={{ backgroundColor: colors.accent }}
        >
          Accent
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const { isDarkMode, toggleTheme, colorScheme, changeColorScheme, availableThemes } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLanguageAndRegion, setShowLanguageAndRegion] = useState(true);

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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
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
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${!isDarkMode
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
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${isDarkMode
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
                <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-medium mb-6">Notification Settings</h2>
                <p className="text-gray-500 dark:text-gray-400">Control when and how you receive notifications.</p>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-medium mb-6">Privacy & Security</h2>
                <p className="text-gray-500 dark:text-gray-400">Manage your privacy settings and security preferences.</p>
                <div className="mt-4 space-y-4">
                  <button
                    className="w-full text-left px-4 py-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setShowChangePassword(true)}
                  >
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Two-Factor Authentication
                  </button>
                  <button className="w-full text-left px-4 py-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Download My Data
                  </button>
                </div>
                {showChangePassword && (
                  <ShowChangePassword onClose={() => setShowChangePassword(false)} />
                )}
              </div>
            )}

            {activeTab === 'language' && (
              <ShowLanguageAndRegion />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
