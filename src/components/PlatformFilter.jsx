import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, Facebook, Instagram, Twitter, Linkedin, Youtube, Check } from 'lucide-react';

const allPlatformDetails = {
  'facebook': { name: 'Facebook', icon: <Facebook size={16} className="text-blue-600" /> },
  'instagram': { name: 'Instagram', icon: <Instagram size={16} className="text-pink-600" /> },
  'twitter': { name: 'Twitter', icon: <Twitter size={16} className="text-blue-400" /> },
  'linkedin': { name: 'LinkedIn', icon: <Linkedin size={16} className="text-blue-700" /> },
  'youtube': { name: 'YouTube', icon: <Youtube size={16} className="text-red-600" /> },
};

const PlatformFilter = ({ selectedPlatforms, onChange, availablePlatforms = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const platformOptions = [
    { id: 'all', name: 'All Platforms', icon: <Filter size={16} /> },
    ...availablePlatforms.map(platformId => ({
      id: platformId,
      name: allPlatformDetails[platformId]?.name || platformId,
      icon: allPlatformDetails[platformId]?.icon || <Filter size={16} />
    }))
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleTogglePlatform = (platformId) => {
    if (platformId === 'all') {
      const allCurrentlySelected = availablePlatforms.every(pId => selectedPlatforms.includes(pId)) && selectedPlatforms.length === availablePlatforms.length;
      
      if (allCurrentlySelected) {
        onChange([]); 
      } else {
        onChange(availablePlatforms); 
      }
    } else {
      const newSelection = selectedPlatforms.includes(platformId)
        ? selectedPlatforms.filter(id => id !== platformId)
        : [...selectedPlatforms, platformId];
      onChange(newSelection);
    }
  };
  
  const getButtonLabel = () => {
    const numSelectablePlatforms = availablePlatforms.length;
    if (selectedPlatforms.length === 0 || selectedPlatforms.length === numSelectablePlatforms) {
        return 'All Platforms';
    }
    if (selectedPlatforms.length === 1) {
        return allPlatformDetails[selectedPlatforms[0]]?.name || 'Select Platforms';
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
                  {(platform.id === 'all' ? (selectedPlatforms.length === availablePlatforms.length) : selectedPlatforms.includes(platform.id)) && (
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
