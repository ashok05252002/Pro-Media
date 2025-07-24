import React from 'react';
import { Lightbulb, Clock, TrendingUp, Palette, MessageCircleReply, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const TipsCard = () => {
  const { themeColors, isDarkMode } = useTheme();
  
  const tips = [
    { icon: <Clock className="w-5 h-5" />, text: 'Best time to post on Instagram: 11AM - 1PM' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Engagement rate above 2% is considered good' },
    { icon: <Palette className="w-5 h-5" />, text: 'Use consistent branding across all platforms' },
    { icon: <MessageCircleReply className="w-5 h-5" />, text: 'Replying to comments boosts visibility' },
  ];

  return (
    <div 
      className="p-6 rounded-xl shadow-xl h-full flex flex-col bg-white dark:bg-gray-800 border-t-4"
      style={{ borderColor: themeColors.accent }}
    >
      <div className="flex items-center mb-5">
         <div className="p-2 rounded-full mr-3" style={{ backgroundColor: `${themeColors.accent}20`}}> {/* 20% opacity */}
          <Lightbulb className="w-6 h-6" style={{ color: themeColors.accent }} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Tips & Best Practices</h3>
      </div>
      
      <ul className="space-y-4 flex-grow mb-6">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: `${themeColors.accent}20` }} // 20% opacity
            >
              {React.cloneElement(tip.icon, { style: { color: themeColors.accent } })}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 pt-1">{tip.text}</span>
          </li>
        ))}
      </ul>
       <button 
        className="mt-auto w-full text-sm py-2.5 px-4 font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
        style={{ backgroundColor: themeColors.accent, color: themeColors.dark }} // Ensure good contrast for button text
      >
        <span>View More Tips</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TipsCard;
