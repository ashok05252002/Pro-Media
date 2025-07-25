import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../constants/ItemTypes';
import { Tag } from 'lucide-react'; // Removed useDrag as it's no longer needed

const PostCardCalendar = ({ post, platformDetails, statusColors, onPreviewClick }) => {
  // Removed useDrag hook and related logic
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.POST_CARD,
    item: { id: post.id, originalDate: post.date, originalTime: post.time, platform: post.platform },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const platformInfo = platformDetails[post.platform] || platformDetails.Default;
  const statusColorClass = statusColors[post.status] || 'bg-gray-500 text-white';
  
  const handleCardClick = (e) => {
    e.stopPropagation(); 
    onPreviewClick(post);
  };

  return (
    <div
      ref={drag}
      onClick={handleCardClick}
      className={`p-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer`}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: platformInfo.colorValue,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
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
