import React from 'react';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import TimeSlotCell from './TimeSlotCell';

const DayColumnWithTimes = ({ 
  date, 
  isToday, 
  postsForDay, 
  timeSlots, 
  onDropPost, 
  onAddPostClick,
  onPostCardClick,
  platformDetails, 
  statusColors, 
  themeColors,
  isFirstColumn
}) => {
  const dayKey = format(date, 'yyyy-MM-dd');

  return (
    <div 
      className={`flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-[calc(100%/7)] min-w-[180px] 
                 ${!isFirstColumn ? 'border-l border-gray-200 dark:border-gray-700' : ''} 
                 flex flex-col ${
                   isToday ? `bg-theme-primary/5 dark:bg-theme-primary/15` : 'bg-white dark:bg-gray-800/80' // Adjusted today's column bg
                 }`}
    >
      <div className={`h-12 flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 ${isToday ? 'bg-theme-primary/10 dark:bg-theme-primary/20' : 'bg-white dark:bg-gray-800'}`}>
        <div className="flex flex-col text-left">
          <span className={`font-semibold text-xs ${isToday ? `text-theme-primary dark:text-yellow-400` : 'text-gray-600 dark:text-gray-400'}`}>
            {format(date, 'EEE')}
          </span>
          <span className={`text-xl font-bold ${isToday ? `text-theme-primary dark:text-yellow-300` : 'text-gray-800 dark:text-gray-100'}`}>
            {format(date, 'd')}
          </span>
        </div>
        <button 
          onClick={() => onAddPostClick(dayKey, null)}
          className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-theme-primary dark:hover:text-theme-accent transition-colors"
          title="Add post for this date"
        >
          <PlusCircle size={20} />
        </button>
      </div>
      
      <div className="flex-grow"> 
        {timeSlots.map(time => {
          const postsInSlot = postsForDay.filter(post => post.time === time);
          return (
            <TimeSlotCell
              key={`${dayKey}-${time}`}
              date={dayKey}
              time={time}
              postsInSlot={postsInSlot}
              onDropPost={onDropPost}
              onAddPostClick={onAddPostClick}
              onPostCardClick={onPostCardClick}
              platformDetails={platformDetails}
              statusColors={statusColors}
              isToday={isToday}
              themeColors={themeColors}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DayColumnWithTimes;
