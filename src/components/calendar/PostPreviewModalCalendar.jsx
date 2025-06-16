import React from 'react';
import { X, Calendar, Clock, Tag, Type, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';
import { format, parse } from 'date-fns';

const PostPreviewModalCalendar = ({ isOpen, onClose, post, platformDetails, statusColors, onEditClick, onDeleteClick, initialBusinesses }) => {
  if (!isOpen || !post) return null;

  const platformInfo = platformDetails[post.platform] || platformDetails.Default;
  const statusColorClass = statusColors[post.status] || 'bg-gray-200 text-gray-700';
  const businessName = initialBusinesses.find(b => b.id === post.businessId)?.name || post.businessId || 'N/A';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-scale-in">
        <div 
          className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center rounded-t-xl"
          style={{ backgroundColor: `${platformInfo.colorValue}20`}} // Using platform color with opacity
        >
          <div className="flex items-center gap-2">
            {React.cloneElement(platformInfo.icon, { className: "w-5 h-5", style: {color: platformInfo.colorValue} })}
            <h3 className="text-lg font-semibold" style={{color: platformInfo.colorValue}}>{post.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            Scheduled for: <strong className="ml-1 text-gray-700 dark:text-gray-300">{format(parse(post.date, 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')}</strong>
            <Clock className="w-4 h-4 ml-3 mr-1 text-gray-500 dark:text-gray-400" />
            at <strong className="ml-1 text-gray-700 dark:text-gray-300">{post.time}</strong>
          </div>
          
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
            Status:
            <span className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${statusColorClass} border`} style={{borderColor: `${platformInfo.colorValue}80`}}>
              {post.status}
            </span>
          </div>

          {post.contentPreview && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Type className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"/> Content:
              </h4> 
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
                {post.contentPreview}
              </p>
            </div>
          )}

          {post.image && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"/> Image:
              </h4>
              <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700/50">
                <img 
                  src={post.image} 
                  alt="Post image preview" 
                  className="w-full max-h-60 object-contain rounded-md"
                />
              </div>
            </div>
          )}
          
          {post.businessId && (
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  For Business: <span className="font-medium text-gray-700 dark:text-gray-300">{businessName}</span>
              </p>
          )}

        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center rounded-b-xl border-t border-gray-200 dark:border-gray-700">
          <button
            // onClick={() => {alert('Edit functionality to be implemented.'); }}
            onClick= {onEditClick}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md border border-blue-300 dark:border-blue-700 font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDeleteClick}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md border border-red-300 dark:border-red-700 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md font-medium text-sm"
          >
            Close
          </button>
        </div>
        <style jsx="true" global="true">{`
          @keyframes modal-scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-modal-scale-in {
            animation: modal-scale-in 0.2s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default PostPreviewModalCalendar;
