import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action? This cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  confirmButtonClass = "bg-theme-danger hover:bg-opacity-90 text-white",
  isDestructive = true
}) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const IconComponent = icon || AlertTriangle;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-start">
            {isDestructive && (
              <div className="mr-3 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <IconComponent className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
            )}
            <div className="mt-0 text-left">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex flex-col sm:flex-row-reverse sm:gap-3 gap-2 rounded-b-lg`}>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${confirmButtonClass} ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
          >
            {confirmText}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} sm:text-sm`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
