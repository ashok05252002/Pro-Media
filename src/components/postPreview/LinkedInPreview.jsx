import React from 'react';
import { ThumbsUp, MessageSquareText, Repeat, Send, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const LinkedInPreview = ({ userName, profilePicUrl, postContent, mediaUrl, mediaType, youtubeTitle }) => {
  const { isDarkMode } = useTheme();
  const platformUserName = userName || "Your Company Name";
  const userTitle = "Social Media Manager @ Your Company";
  const platformProfilePic = profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(platformUserName.substring(0,1))}&background=0077B5&color=fff&size=48&bold=true&rounded=true`;
  const timestamp = "1h • Edited"; 

  return (
    <div className={`w-full max-w-md mx-auto rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border`}>
      {/* Header */}
      <div className="p-3 flex items-start">
        <img src={platformProfilePic} alt="Profile" className="w-12 h-12 rounded-full mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className={`font-semibold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{platformUserName}</p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userTitle}</p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
            {timestamp} <Globe size={12} className="ml-1" />
          </p>
        </div>
      </div>

      {/* Content */}
      {postContent && (
        <div className={`px-3 pb-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-pre-wrap break-words`}>
          {postContent}
        </div>
      )}

      {/* Media */}
      {mediaUrl && (
        <div className="mt-2">
          {mediaType === 'image' && <img src={mediaUrl} alt="Post media" className="w-full max-h-80 object-cover" />}
          {mediaType === 'video' && <video controls src={mediaUrl} className="w-full max-h-80 object-cover bg-black">Your browser does not support video.</video>}
          {mediaType === 'gif' && <img src={mediaUrl} alt="Post GIF" className="w-full max-h-80 object-cover" />}
        </div>
      )}
      
      {/* Reactions (Placeholder) */}
      <div className={`px-3 pt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        👍❤️💡 123 • 45 comments
      </div>

      {/* Actions */}
      <div className={`flex justify-around items-center py-2 border-t mt-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <button className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}>
          <ThumbsUp size={18} /> Like
        </button>
        <button className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}>
          <MessageSquareText size={18} /> Comment
        </button>
        <button className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Repeat size={18} /> Repost
        </button>
        <button className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Send size={18} /> Send
        </button>
      </div>
    </div>
  );
};

export default LinkedInPreview;
