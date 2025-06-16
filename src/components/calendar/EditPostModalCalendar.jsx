import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, Type, Clock } from 'lucide-react';
import { format, parse } from 'date-fns';

const EditPostModalCalendar = ({ isOpen, onClose, onSave, post, selectedDate, selectedTime, platforms, timeSlots }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [platform, setPlatform] = useState(Object.keys(platforms).find(key => key !== 'Default') || '');
  const [status, setStatus] = useState(post?.status);
  const [contentPreview, setContentPreview] = useState(post?.contentReview ||'');
  const [postTime, setPostTime] = useState(post?.time || selectedTime || '09:00');

  useEffect(() => {
    if (isOpen) {
      setPostTime(post?.time || selectedTime || '09:00'); // Reset time if modal reopens for a new slot
      setTitle(post?.title || '');
      setPlatform(Object.keys(platforms).find(key => key !== 'Default') || '');
      setStatus(post?.status);
      setContentPreview(post?.contentReview || '');
    }
  }, [isOpen, selectedTime, platforms]);


  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Post title is required.');
      return;
    }
    onSave({
      id: post.id,
      title,
      platform,
      status,
      date: selectedDate, 
      time: postTime,     
      contentPreview,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium">Update the Post to Calendar</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postDateModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <div className="flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <span>{format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')}</span>
                </div>
              </div>
              <div>
                <label htmlFor="postTimeModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <select
                  id="postTimeModal"
                  value={postTime}
                  onChange={(e) => setPostTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="postTitleModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                id="postTitleModal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                placeholder="Enter post title"
                required
              />
            </div>
            <div>
              <label htmlFor="postPlatformModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
              <select
                id="postPlatformModal"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
              >
                {Object.entries(platforms).filter(([key]) => key !== 'Default').map(([key, {name}]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="postStatusModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                id="postStatusModal"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
              >
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Posted">Posted</option>
              </select>
            </div>
             <div>
              <label htmlFor="contentPreviewModal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content Preview (Optional)</label>
              <textarea
                id="contentPreviewModal"
                value={contentPreview}
                onChange={(e) => setContentPreview(e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                placeholder="Short summary of the post..."
              />
            </div>
          </div>
          
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModalCalendar;
