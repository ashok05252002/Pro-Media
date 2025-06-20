import React from 'react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const FacebookPreview = ({ userName, profilePicUrl, postContent, mediaUrl, mediaType, youtubeTitle }) => {
  const { isDarkMode } = useTheme();
  const platformUserName = userName || "Your Page Name";
  const platformProfilePic = profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(platformUserName)}&background=4267B2&color=fff&size=40`;
  const timestamp = "Just now"; // Static timestamp for preview

  return (
    <div className={`w-full max-w-md mx-auto rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border`}>
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          <img src={platformProfilePic} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className={`font-semibold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{platformUserName}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{timestamp} · <i className="fas fa-globe-americas"></i></p>
          </div>
        </div>
        <button className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      {postContent && (
        <div className={`px-3 pb-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-pre-wrap break-words`}>
          {postContent}
        </div>
      )}

      {/* Media */}
      {mediaUrl && (
        <div className="bg-black">
          {mediaType === 'image' && <img src={mediaUrl} alt="Post media" className="w-full max-h-[400px] object-contain" />}
          {mediaType === 'video' && <video controls src={mediaUrl} className="w-full max-h-[400px] object-contain">Your browser does not support video.</video>}
          {mediaType === 'gif' && <img src={mediaUrl} alt="Post GIF" className="w-full max-h-[400px] object-contain" />}
        </div>
      )}
      
      {/* Actions */}
      <div className={`flex justify-around items-center py-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <button className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}>
          <ThumbsUp size={16} /> Like
        </button>
        <button className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}>
          <MessageCircle size={16} /> Comment
        </button>
        <button className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
};

export default FacebookPreview;
