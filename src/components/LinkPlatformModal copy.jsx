import React, { useState } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';

const LinkPlatformModal = ({ platformName, platformIcon, initialPageName = '', initialProductPageUrl = '', onSubmit, onClose }) => {
  const [pageName, setPageName] = useState(initialPageName);
  const [productPageUrl, setProductPageUrl] = useState(initialProductPageUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ pageName, productPageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {platformIcon && React.cloneElement(platformIcon, { className: `w-6 h-6` })}
            <h3 className="text-lg font-medium">Link {platformName}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <div>
              <label htmlFor="pageName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Name / Username
              </label>
              <input
                type="text"
                id="pageName"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                placeholder={`Enter ${platformName} page name or username`}
                required
              />
            </div>
            
            <div>
              <label htmlFor="productPageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product/Shop Page URL (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="url"
                  id="productPageUrl"
                  value={productPageUrl}
                  onChange={(e) => setProductPageUrl(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                  placeholder={`e.g., ${platformName.toLowerCase()}.com/yourshop`}
                />
              </div>
            </div>
          </div>
          
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md"
            >
              Save Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkPlatformModal;
