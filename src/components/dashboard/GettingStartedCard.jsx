import React from 'react';
import { CheckCircle2, Circle, Rocket, Link2, CalendarPlus, Target, Users2, BellRing, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const GettingStartedCard = () => {
  const { themeColors, isDarkMode } = useTheme();
  const progress = 60; // 3 out of 5 items checked
  
  const checklistItems = [
    { text: 'Connect social media accounts', checked: true, icon: <Link2 className="w-5 h-5" /> },
    { text: 'Schedule your first post', checked: true, icon: <CalendarPlus className="w-5 h-5" /> },
    { text: 'Set a weekly posting goal', checked: true, icon: <Target className="w-5 h-5" /> },
    { text: 'Add team members', checked: false, icon: <Users2 className="w-5 h-5" /> },
    { text: 'Enable notifications', checked: false, icon: <BellRing className="w-5 h-5" /> },
  ];

  return (
    <div 
      className="p-6 rounded-xl shadow-xl h-full flex flex-col bg-white dark:bg-gray-800 border-t-4"
      style={{ borderColor: themeColors.primary }}
    >
      <div className="flex items-center mb-5">
        <div className="p-2 rounded-full mr-3" style={{ backgroundColor: `${themeColors.primary}20` }}> {/* 20% opacity */}
          <Rocket className="w-6 h-6" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Getting Started</h3>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: themeColors.primary }}
          ></div>
        </div>
      </div>

      <ul className="space-y-3 flex-grow mb-6">
        {checklistItems.map((item, index) => (
          <li key={index} className="flex items-center">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3">
              {item.checked ? (
                <CheckCircle2 className="w-5 h-5" style={{ color: themeColors.primary }} />
              ) : (
                React.cloneElement(item.icon, { className: "w-5 h-5 text-gray-400 dark:text-gray-500" })
              )}
            </div>
            <span className={`text-sm ${item.checked ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      
      <button 
        className="mt-auto w-full text-sm py-2.5 px-4 font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 btn-primary"
      >
        <span>Complete Setup Guide</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default GettingStartedCard;
