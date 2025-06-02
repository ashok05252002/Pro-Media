import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, Check } from 'lucide-react'; // Filter is correctly imported

const platformOptions = [
  { id: 'all', name: 'All Platforms', icon: <Filter size={16} /> }, // Using Filter here for the 'All' option
  { id: 'facebook', name: 'Facebook', icon: <Facebook size={16} className="text-blue-600" /> },
  { id: 'instagram', name: 'Instagram', icon: <Instagram size={16} className="text-pink-600" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter size={16} className="text-blue-400" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={16} className="text-blue-700" /> },
  { id: 'youtube', name: 'YouTube', icon: <Youtube size={16} className="text-red-600" /> },
];

const PlatformFilterCalendar = ({ platforms, activeFilters, setActiveFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dynamically create options based on the passed 'platforms' prop
  const dynamicPlatformOptions = [
    { id: 'all', name: 'All Platforms', icon: <Filter size={16} /> },
    ...Object.entries(platforms).map(([id, { name, icon }]) => ({
      id,
      name,
      icon: React.cloneElement(icon, { size: 16 }) // Ensure icon size is consistent
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
      const allActualPlatforms = Object.keys(platforms);
      const allCurrentlySelected = allActualPlatforms.every(pId => activeFilters.includes(pId)) && activeFilters.length === allActualPlatforms.length;
      
      if (allCurrentlySelected) {
        setActiveFilters([]); 
      } else {
        setActiveFilters(allActualPlatforms); 
      }
    } else {
      setActiveFilters(prevFilters =>
        prevFilters.includes(platformId)
          ? prevFilters.filter(id => id !== platformId)
          : [...prevFilters, platformId]
      );
    }
  };
  
  const getButtonLabel = () => {
    if (activeFilters.length === 0 || activeFilters.length === Object.keys(platforms).length) {
      return 'All Platforms';
    }
    if (activeFilters.length === 1) {
      return platforms[activeFilters[0]]?.name || 'Select Platforms';
    }
    return `${activeFilters.length} Platforms Selected`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
      >
        <Filter className="w-4 h-4" /> {/* Corrected: Filter instead of FilterIcon */}
        <span>{getButtonLabel()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleTogglePlatform('all')}
                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between font-medium"
              >
                <span className="flex items-center gap-2">
                  {dynamicPlatformOptions.find(p => p.id === 'all').icon}
                  {dynamicPlatformOptions.find(p => p.id === 'all').name}
                </span>
                {(activeFilters.length === Object.keys(platforms).length) && (
                  <Check size={16} className="text-theme-primary" />
                )}
              </button>
            </li>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            {dynamicPlatformOptions.filter(p => p.id !== 'all').map(({ id, name, icon }) => (
              <li key={id}>
                <button
                  onClick={() => handleTogglePlatform(id)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {icon}
                    {name}
                  </span>
                  {activeFilters.includes(id) && (
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

// Need to import platform icons if they are not passed via props and are used directly here.
// For this fix, assuming `platforms` prop provides all necessary details including icons.
// If `platformOptions` constant was intended for internal use, ensure icons are imported:
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';


export default PlatformFilterCalendar;
