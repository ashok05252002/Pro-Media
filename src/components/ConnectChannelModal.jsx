import React, { useState } from 'react';
import { X, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const ConnectChannelModal = ({ onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5 text-blue-600" /> },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5 text-pink-600" /> },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5 text-blue-400" /> },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5 text-blue-700" /> },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5 text-red-600" /> },
  ];

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium">Connect Social Media Account</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Platform
            </label>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  className={`flex items-center gap-2 p-3 border rounded-md ${
                    selectedPlatform === platform.id 
                      ? 'border-[#F97316] bg-[#F97316]/10' 
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  {platform.icon}
                  <span>{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Type
            </label>
            <div className="flex gap-3">
              <button className="flex-1 p-2 border border-[#F97316] bg-[#F97316]/10 rounded-md text-center">
                Personal
              </button>
              <button className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-700">
                Business
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            By connecting your account, you authorize our platform to access and manage your social media content according to our terms of service.
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-md disabled:opacity-70"
            >
              {isConnecting ? 'Connecting...' : 'Connect Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectChannelModal;
