import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

const ToastNotification = ({ notification, onDismiss }) => {
  const { isDarkMode, themeColors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  const borderColors = {
    success: 'border-green-500 dark:border-green-400',
    error: 'border-red-500 dark:border-red-400',
    warning: 'border-yellow-500 dark:border-yellow-400',
    info: 'border-blue-500 dark:border-blue-400',
  };
  
  const textColors = {
    success: 'text-green-700 dark:text-green-300',
    error: 'text-red-700 dark:text-red-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    info: 'text-blue-700 dark:text-blue-300',
  }

  return (
    <div 
      className={`max-w-sm w-full bg-white dark:bg-gray-800 shadow-2xl rounded-lg pointer-events-auto ring-1 ring-black dark:ring-gray-700 ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-out animate-toast-in
                  border-l-4 ${borderColors[notification.type] || 'border-gray-500 dark:border-gray-400'}`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[notification.type] || <Info className="w-6 h-6 text-gray-500" />}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-semibold ${textColors[notification.type] || 'text-gray-900 dark:text-gray-100'}`}>
              {notification.title || notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onDismiss(notification.id)}
              className="inline-flex text-gray-400 bg-white dark:bg-gray-800 rounded-md hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary dark:focus:ring-offset-gray-800"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Removed <style jsx="true" global="true"> block. Animation is now in index.css */}
    </div>
  );
};


export const NotificationProvider = ({ children }) => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const [panelNotifications, setPanelNotifications] = useState([
    { id: 'pn1', title: 'Welcome!', message: 'Thanks for joining our platform.', time: '10m ago', read: false, type: 'info' },
    { id: 'pn2', title: 'Feature Update', message: 'New calendar view is now live!', time: '1h ago', read: true, type: 'success' },
  ]);

  const addNotification = useCallback((notificationInput) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const newToast = { ...notificationInput, id };
    setToastNotifications(prev => [newToast, ...prev].slice(0, 5));

    const newPanelNotif = { 
      ...notificationInput, 
      id: `panel-${id}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      read: false 
    };
    setPanelNotifications(prev => [newPanelNotif, ...prev].slice(0, 20));
  }, []);

  const dismissToast = useCallback((id) => {
    setToastNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const markPanelNotificationAsRead = useCallback((id) => {
    setPanelNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  }, []);

  const markAllPanelNotificationsAsRead = useCallback(() => {
    setPanelNotifications(prev => prev.map(n => ({...n, read: true})));
  }, []);
  
  const clearAllPanelNotifications = useCallback(() => {
    setPanelNotifications([]);
  }, []);


  return (
    <NotificationContext.Provider value={{ addNotification, panelNotifications, markPanelNotificationAsRead, markAllPanelNotificationsAsRead, clearAllPanelNotifications }}>
      {children}
      <div className="fixed top-20 right-6 z-[1000] space-y-3 w-full max-w-sm">
        {toastNotifications.map(n => (
          <ToastNotification key={n.id} notification={n} onDismiss={dismissToast} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
