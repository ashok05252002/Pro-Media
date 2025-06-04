import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, Facebook, Instagram, Twitter, Linkedin, Youtube, Check } from 'lucide-react';

const platformOptions = [
  { id: 'all', name: 'All Platforms', icon: <Filter size={16} /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook size={16} className="text-blue-600" /> },
  { id: 'instagram', name: 'Instagram', icon: <Instagram size={16} className="text-pink-600" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter size={16} className="text-blue-400" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={16} className="text-blue-700" /> },
  { id: 'youtube', name: 'YouTube', icon: <Youtube size={16} className="text-red-600" /> },
];

const PlatformFilter = ({ selectedPlatforms, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTogglePlatform = (platformId) => {
    if (platformId === 'all') {
      const allActualPlatforms = platformOptions.slice(1).map(p => p.id);
      const allCurrentlySelected = allActualPlatforms.every(pId => selectedPlatforms.includes(pId)) && selectedPlatforms.length === allActualPlatforms.length;
      
      if (allCurrentlySelected) {
        onChange([]); 
      } else {
        onChange(allActualPlatforms); 
      }
    } else {
      const newSelection = selectedPlatforms.includes(platformId)
        ? selectedPlatforms.filter(id => id !== platformId)
        : [...selectedPlatforms, platformId];
      onChange(newSelection);
    }
  };
  
  const getButtonLabel = () => {
    const numActualPlatforms = platformOptions.length - 1;
    if (selectedPlatforms.length === 0 || selectedPlatforms.length === numActualPlatforms) {
        return 'All Platforms';
    }
    if (selectedPlatforms.length === 1) {
        const platform = platformOptions.find(p => p.id === selectedPlatforms[0]);
        return platform ? platform.name : 'Select Platforms';
    }
    return `${selectedPlatforms.length} Platforms Selected`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
      >
        <Filter className="w-4 h-4" />
        <span>{getButtonLabel()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 p-2">
          <ul className="space-y-1">
            {platformOptions.map((platform) => (
              <li key={platform.id}>
                <button
                  onClick={() => handleTogglePlatform(platform.id)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {platform.icon}
                    {platform.name}
                  </span>
                  {(platform.id === 'all' ? (selectedPlatforms.length === platformOptions.length -1 || selectedPlatforms.length === 0) : selectedPlatforms.includes(platform.id)) && (
                    <Check size={16} className="text-theme-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlatformFilter;
