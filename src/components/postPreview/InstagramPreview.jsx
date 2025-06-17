import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const InstagramPreview = ({ userName, profilePicUrl, postContent, mediaUrl, mediaType, youtubeTitle }) => {
  const { isDarkMode } = useTheme();
  const platformUserName = userName || "your_username";
  const platformProfilePic = profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(platformUserName)}&background=E1306C&color=fff&size=32`;
  const likesCount = "1,234 likes"; // Static for preview
  const captionUser = platformUserName;

  return (
    <div className={`w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'} border`}>
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          <img src={platformProfilePic} alt="Profile" className="w-8 h-8 rounded-full mr-3" />
          <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{platformUserName}</p>
        </div>
        <button className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media */}
      {mediaUrl && (
        <div className="w-full aspect-square bg-black flex items-center justify-center">
          {mediaType === 'image' && <img src={mediaUrl} alt="Post media" className="w-full h-full object-cover" />}
          {mediaType === 'video' && <video controls src={mediaUrl} className="w-full h-full object-cover">Your browser does not support video.</video>}
          {mediaType === 'gif' && <img src={mediaUrl} alt="Post GIF" className="w-full h-full object-cover" />}
        </div>
      )}
      
      {/* Actions */}
      <div className={`p-3 flex items-center justify-between ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <div className="flex items-center space-x-4">
          <button><Heart size={24} /></button>
          <button><MessageCircle size={24} /></button>
          <button><Send size={24} /></button>
        </div>
        <button><Bookmark size={24} /></button>
      </div>

      {/* Likes & Caption */}
      <div className="px-3 pb-3">
        <p className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{likesCount}</p>
        {postContent && (
          <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'} whitespace-pre-wrap break-words`}>
            <span className="font-semibold">{captionUser}</span> {postContent}
          </p>
        )}
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>View all comments</p>
        <p className={`text-[10px] mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>1 HOUR AGO</p>
      </div>
    </div>
  );
};

export default InstagramPreview;
