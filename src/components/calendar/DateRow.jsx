import React from 'react';
import { useDrop } from 'react-dnd';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import PostCardCalendar from './PostCardCalendar';
import { ItemTypes } from '../../constants/ItemTypes';

const DateRow = ({ date, isToday, postsForDay, onDropPost, onAddPostClick, platformDetails, statusColors, themeColors }) => {
  const dayKey = format(date, 'yyyy-MM-dd');

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.POST_CARD,
    drop: (item) => {
      if (item.originalDate !== dayKey) {
        onDropPost(item.id, dayKey);
      }
    },
    canDrop: (item) => item.originalDate !== dayKey,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex flex-col p-3 mb-1 rounded-lg border ${
        isToday ? `border-2 !border-[${themeColors.primary}] dark:!border-[${themeColors.primary}] bg-theme-primary/5 dark:bg-theme-primary/10` : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'
      } ${isOver && canDrop ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className={`font-semibold text-sm ${isToday ? `text-[${themeColors.primary}]` : 'text-gray-700 dark:text-gray-300'}`}>
            {format(date, 'EEE, MMM d')}
          </span>
          {isToday && (
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full text-white bg-[${themeColors.primary}]`}>
              Today
            </span>
          )}
        </div>
        <button 
          onClick={() => onAddPostClick(dayKey)}
          className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-theme-primary dark:hover:text-theme-primary transition-colors"
          title="Add post for this date"
        >
          <PlusCircle size={20} />
        </button>
      </div>
      {/* Container for Post Cards - Changed to vertical stack and scrollable */}
      <div className="mt-1 flex-grow rounded-md bg-gray-50 dark:bg-gray-800/30 -m-1 p-2 max-h-52 overflow-y-auto custom-scrollbar min-h-[80px]"> 
        {postsForDay.length === 0 && (
          <div className="flex items-center justify-center h-full text-xs text-gray-400 dark:text-gray-500 italic">
            No posts scheduled. Drag posts here or click '+' to add.
          </div>
        )}
        <div className="space-y-2"> {/* Vertical stack for post cards */}
          {postsForDay.map(post => (
            <PostCardCalendar 
              key={post.id} 
              post={post} 
              platformDetails={platformDetails}
              statusColors={statusColors}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateRow;
