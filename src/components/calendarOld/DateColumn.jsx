import React from 'react';
import { useDrop } from 'react-dnd';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import PostCardCalendar from './PostCardCalendar';
import { ItemTypes } from '../../constants/ItemTypes';

const DateColumn = ({ date, isToday, postsForDay, onDropPost, onAddPostClick, platformDetails, statusColors, themeColors }) => {
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
      className={`flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/7 p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[300px] flex flex-col ${
        isToday ? `bg-theme-primary/5 dark:bg-theme-primary/10` : 'bg-gray-50 dark:bg-gray-800/30'
      } ${isOver && canDrop ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
    >
      <div className="flex justify-between items-center mb-2 p-2 rounded-t-md">
        <div className="flex flex-col">
          <span className={`font-semibold text-sm ${isToday ? `text-[${themeColors.primary}]` : 'text-gray-700 dark:text-gray-300'}`}>
            {format(date, 'EEE')}
          </span>
          <span className={`text-2xl font-bold ${isToday ? `text-[${themeColors.primary}]` : 'text-gray-800 dark:text-gray-100'}`}>
            {format(date, 'd')}
          </span>
        </div>
        <button 
          onClick={() => onAddPostClick(dayKey)}
          className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-theme-primary dark:hover:text-theme-primary transition-colors"
          title="Add post for this date"
        >
          <PlusCircle size={22} />
        </button>
      </div>
      
      <div className="flex-grow rounded-md bg-white dark:bg-gray-800 p-2 min-h-[200px] max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar"> 
        {postsForDay.length === 0 && (
          <div className="flex items-center justify-center h-full text-xs text-gray-400 dark:text-gray-500 italic pt-10">
            No posts.
          </div>
        )}
        <div className="space-y-2">
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

export default DateColumn;
