import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import PostCardCalendar from './PostCardCalendar';
import { ItemTypes } from '../../constants/ItemTypes';
// Removed ItemTypes import as it's no longer needed

const TimeSlotCell = ({ 
  date, 
  time, 
  postsInSlot, 
  onDropPost, 
  onAddPostClick, 
  onPostCardClick,
  platformDetails, 
  statusColors,
  isToday,
  themeColors
}) => {

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ItemTypes.POST_CARD,
      drop: (item) => {
        if (item.originalDate !== date || item.originalTime !== time) {
          onDropPost(item.id, item.platform, date, time);
        }
      },
      canDrop: (item) => item.originalDate !== date || item.originalTime !== time,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }));
  // Removed useDrop hook and related logic

  let hoverBgClass = 'hover:bg-gray-100/70 dark:hover:bg-gray-700/50';
  if (isToday) {
    hoverBgClass = `hover:bg-[${themeColors.primary}]/20 dark:hover:bg-[${themeColors.primary}]/25`; // Corrected dynamic class
  }
  // Removed isOver && canDrop condition for hoverBgClass as drag-drop is removed

  if (isOver && canDrop) {
    hoverBgClass = 'bg-green-100 dark:bg-green-900/40';
  }

  return (
    <div
      // Removed ref={drop}
      ref={drop}
      className={`min-h-[4rem] border-b border-gray-200 dark:border-gray-700 p-1.5 relative group 
                  ${hoverBgClass}
                  transition-colors duration-150 flex flex-col`}
      onClick={(e) => {
        // Simplified click logic as drag-drop is removed
        if (e.target === e.currentTarget || e.target.classList.contains('add-post-btn-slot') || e.target.closest('.add-post-btn-slot')) {
          if (postsInSlot.length === 0) { // Only allow adding if slot is empty, or adjust as needed
             onAddPostClick(date, time);
          }
        }
      }}
    >
      <div className="flex flex-col gap-1"> 
        {postsInSlot.map(post => (
          <PostCardCalendar
            key={post.id}
            post={post}
            platformDetails={platformDetails}
            statusColors={statusColors}
            onPreviewClick={onPostCardClick}
          />
        ))}
      </div>
      {postsInSlot.length === 0 && (
        <button 
          className="add-post-btn-slot absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-theme-primary dark:hover:text-theme-accent"
          title={`Add post for ${time}`}
          onClick={(e) => { e.stopPropagation(); onAddPostClick(date, time); }} // Ensure button click is specific
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );
};

export default TimeSlotCell;
