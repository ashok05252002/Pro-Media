import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Tooltip = ({ text, children, position = 'top', className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { themeColors, isDarkMode } = useTheme();
  
  let positionClasses = '';
  let arrowClasses = '';
  
  const tooltipBgColor = isDarkMode ? themeColors.dark : themeColors.light;
  const tooltipTextColor = isDarkMode ? themeColors.light : themeColors.dark;
  const arrowBorderColor = isDarkMode ? themeColors.dark : themeColors.light;
  const borderColor = isDarkMode ? themeColors.secondary : '#e5e7eb'; // Tailwind gray-300 or a theme color

  switch (position) {
    case 'top':
      positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      arrowClasses = `absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-x-4 border-x-transparent border-t-4`;
      break;
    case 'bottom':
      positionClasses = 'top-full left-1/2 -translate-x-1/2 mt-2';
      arrowClasses = `absolute left-1/2 -translate-x-1/2 top-[-4px] w-0 h-0 border-x-4 border-x-transparent border-b-4`;
      break;
    case 'left':
      positionClasses = 'right-full top-1/2 -translate-y-1/2 mr-2';
      arrowClasses = `absolute top-1/2 -translate-y-1/2 right-[-4px] w-0 h-0 border-y-4 border-y-transparent border-l-4`;
      break;
    case 'right':
      positionClasses = 'left-full top-1/2 -translate-y-1/2 ml-2';
      arrowClasses = `absolute top-1/2 -translate-y-1/2 left-[-4px] w-0 h-0 border-y-4 border-y-transparent border-r-4`;
      break;
    default:
      positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      arrowClasses = `absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-x-4 border-x-transparent border-t-4`;
  }
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0} // Make it focusable for keyboard users
    >
      {children}
      {showTooltip && text && (
        <div 
          role="tooltip"
          className={`absolute ${positionClasses} px-3 py-1.5 text-xs font-medium rounded-md shadow-lg z-[100] whitespace-nowrap transition-opacity duration-150 border
                     ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundColor: tooltipBgColor, 
            color: tooltipTextColor,
            borderColor: borderColor
          }}
        >
          {text}
          <div className={arrowClasses} style={{ 
              borderTopColor: position === 'top' ? arrowBorderColor : 'transparent',
              borderBottomColor: position === 'bottom' ? arrowBorderColor : 'transparent',
              borderLeftColor: position === 'left' ? arrowBorderColor : 'transparent',
              borderRightColor: position === 'right' ? arrowBorderColor : 'transparent',
           }}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
