import React from 'react';
import { X } from 'lucide-react';


const notifications1 = [
  {
    id: 1,
    title: 'New post scheduled',
    message: 'Your post for Facebook has been scheduled for tomorrow at 10:00 AM.',
    time: '5 minutes ago',
    read: false
  },
  {
    id: 2,
    title: 'Instagram post published',
    message: 'Your post on Instagram has been published successfully.',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    title: 'Analytics report ready',
    message: 'Your weekly analytics report is now available for review.',
    time: '3 hours ago',
    read: true
  },
  {
    id: 4,
    title: 'New follower milestone',
    message: 'Congratulations! You\'ve reached 10,000 followers on Twitter.',
    time: '1 day ago',
    read: true
  }
];



const NotificationPanel = ({ onClose, notifications = [], onClick, onMarkAllAsRead}) => {

  

  console.log('====================================');
  console.log(notifications);
  console.log('====================================');
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium">Notifications</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => onClick(notification.id)}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.read ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start">
                  {!notification.view_status && (
                    <div className="w-2 h-2 bg-theme-primary rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  )}
                  <div className={notification.read ? 'ml-4' : ''}>
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.created_on}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
        <button className="text-theme-primary hover:text-opacity-80 text-sm font-medium"
        onClick={onMarkAllAsRead}>
          Mark all as read
          
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
