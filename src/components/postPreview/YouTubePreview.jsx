import React from 'react';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const YouTubePreview = ({ userName, profilePicUrl, postContent, mediaUrl, mediaType, youtubeTitle }) => {
  const { isDarkMode } = useTheme();
  const channelName = userName || "Your Channel Name";
  const subscribers = "1.23M subscribers"; // Static for preview
  const platformProfilePic = profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName.substring(0,1))}&background=FF0000&color=fff&size=40&bold=true`;
  const views = "10K views";
  const uploadTime = "1 hour ago";

  return (
    <div className={`w-full max-w-xl mx-auto ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Video Player Area */}
      {mediaUrl && mediaType === 'video' ? (
        <div className="aspect-video bg-black flex items-center justify-center">
          <video controls src={mediaUrl} className="w-full h-full object-contain">Your browser does not support video.</video>
        </div>
      ) : (
        <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-400">
          Video Preview Area
        </div>
      )}

      {/* Title */}
      <h1 className="text-xl font-bold mt-3 px-1 sm:px-0">{youtubeTitle || "Your Awesome Video Title"}</h1>

      {/* Video Info & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 px-1 sm:px-0">
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{views} • {uploadTime}</p>
        <div className={`flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <button className="flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full"><ThumbsUp size={18} /> 1.2K</button>
          <button className="flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full"><ThumbsDown size={18} /></button>
          <button className="flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full"><Share2 size={18} /> Share</button>
          <button className="flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full"><Download size={18} /> Download</button>
          <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      {/* Channel Info & Subscribe */}
      <div className={`flex items-center justify-between py-3 mt-2 border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} px-1 sm:px-0`}>
        <div className="flex items-center">
          <img src={platformProfilePic} alt="Channel" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold text-sm">{channelName}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subscribers}</p>
          </div>
        </div>
        <button className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-red-700">
          Subscribe
        </button>
      </div>

      {/* Description */}
      {postContent && (
        <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} px-1 sm:px-0`}>
          <p className="text-sm font-semibold mb-1">Description:</p>
          <p className={`text-sm whitespace-pre-wrap break-words ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {postContent}
          </p>
        </div>
      )}
    </div>
  );
};

export default YouTubePreview;
