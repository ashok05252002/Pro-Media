import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../constants/ItemTypes';

  const PostCardCalendar = ({ post, platformDetails={}, statusColors ={}, onPreviewClick }) => {
    console.log('Rendering PostCard:', post.video_title, 'Platform:', post.platformName);
    console.log('Available platforms:', Object.keys(platformDetails));
    console.log('Facebook platform details:', platformDetails.facebook);

    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.POST_CARD,
      item: { id: post.id, originalDate: post.post_s_date, originalTime: post.post_s_time },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    // const platformInfo = platformDetails[post.platformName] || { type: 'Unknown', icon: '?', colorValue: '#A0AEC0' };
    // const statusColorClass = statusColors[post.status] || 'bg-gray-500 text-white';
    const platformInfo = {
    ...(platformDetails[post.platformName] || {}),
    type: post.platformName || 'Unknown',
    icon: platformDetails[post.platformName]?.icon || <span>?</span>,
    colorValue: platformDetails[post.platformName]?.colorValue || '#718096'
  };

  const statusColorClass = statusColors[post.status] || 'bg-gray-500 text-white';

  const handleCardClick = (e) => {
    e.stopPropagation(); 
    onPreviewClick?.(post);
  };
  console.log('Final platformInfo:', platformInfo);
  console.log('Status color class:', statusColorClass);

  return (
      <div
        ref={drag}
        onClick={handleCardClick}
        className={`p-2 rounded-lg text-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 ease-in-out mb-2`}
        style={{ 
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: platformInfo.colorValue,
          transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        }}
        title={`${post.video_title} - ${platformInfo.type} (${post.status}) at ${post.post_s_date}`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            {React.cloneElement(platformInfo.icon, { className: "w-4 h-4 flex-shrink-0" })}
            <span className="font-semibold text-xs truncate" title={post.video_title}>{post.video_title}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${statusColorClass} backdrop-blur-sm`}>
            {post.status}
          </span>
          <span className="text-xs opacity-90">{post.post_s_time}</span>
        </div>
      </div>
    );
  };

  export default PostCardCalendar;
