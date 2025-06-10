import React from 'react';
import { Tag } from 'lucide-react'; // Removed useDrag as it's no longer needed

const PostCardCalendar = ({ post, platformDetails, statusColors, onPreviewClick }) => {
  // Removed useDrag hook and related logic

  const platformInfo = platformDetails[post.platform] || platformDetails.Default;
  const statusColorClass = statusColors[post.status] || 'bg-gray-500 text-white';
  
  const handleCardClick = (e) => {
    e.stopPropagation(); 
    onPreviewClick(post);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`p-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer`}
      style={{ 
        backgroundColor: platformInfo.colorValue,
      }}
      title={`${post.title} - ${platformInfo.name} (${post.status}) at ${post.time}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {React.cloneElement(platformInfo.icon, { className: "w-4 h-4 flex-shrink-0" })}
          <span className="font-semibold text-xs truncate" title={post.title}>{post.title}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${statusColorClass} backdrop-blur-sm`}>
          {post.status}
        </span>
        <span className="text-xs opacity-90">{post.time}</span>
      </div>
    </div>
  );
};

export default PostCardCalendar;
