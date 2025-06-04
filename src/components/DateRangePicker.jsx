import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const predefinedRanges = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'This Month', special: 'this_month' },
  { label: 'Last Month', special: 'last_month' },
];

const DateRangePicker = ({ onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRangeLabel, setSelectedRangeLabel] = useState('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const dropdownRef = useRef(null);

  const today = new Date();

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

  const handlePredefinedRange = (range) => {
    setSelectedRangeLabel(range.label);
    setShowCustom(false);
    setCustomStartDate('');
    setCustomEndDate('');
    
    let startDate, endDate = new Date(today); 

    if (range.days) {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - range.days + 1);
    } else if (range.special === 'this_month') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (range.special === 'last_month') {
      endDate = new Date(today.getFullYear(), today.getMonth(), 0); 
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    }
    
    onRangeChange({ 
      startDate: startDate.toISOString().split('T')[0], 
      endDate: endDate.toISOString().split('T')[0],
      label: range.label 
    });
    setIsOpen(false);
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      if (start > end) {
        alert("Start date cannot be after end date.");
        return;
      }
      setSelectedRangeLabel(`Custom: ${customStartDate} to ${customEndDate}`);
      onRangeChange({ 
        startDate: customStartDate, 
        endDate: customEndDate,
        label: `Custom: ${customStartDate} to ${customEndDate}`
      });
      setIsOpen(false);
    } else {
      alert("Please select both start and end dates for custom range.");
    }
  };
  
  const toggleCustom = () => {
    setShowCustom(!showCustom);
    if (!showCustom) {
      setSelectedRangeLabel('Custom Range'); 
    } else if (selectedRangeLabel.startsWith('Custom:')) { 
      handlePredefinedRange(predefinedRanges.find(r => r.days === 30)); 
    }
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
      >
        <Calendar className="w-4 h-4" />
        <span>{selectedRangeLabel}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Select Date Range</h4>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          <ul className="space-y-2 mb-3">
            {predefinedRanges.map((range) => (
              <li key={range.label}>
                <button
                  onClick={() => handlePredefinedRange(range)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedRangeLabel === range.label && !showCustom ? 'bg-theme-primary/10 text-theme-primary' : ''}`}
                >
                  {range.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <button
              onClick={toggleCustom}
              className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center ${showCustom ? 'bg-theme-primary/10 text-theme-primary' : ''}`}
            >
              Custom Range <ChevronDown className={`w-4 h-4 transition-transform ${showCustom ? 'rotate-180' : ''}`} />
            </button>
            {showCustom && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                    max={today.toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                    max={today.toISOString().split('T')[0]}
                  />
                </div>
                <button
                  onClick={handleCustomRangeApply}
                  className="w-full mt-2 px-3 py-2 bg-theme-primary text-white text-sm rounded-md hover:bg-opacity-90"
                >
                  Apply Custom Range
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
