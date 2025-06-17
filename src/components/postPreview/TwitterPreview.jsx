import React from 'react';
import { MessageCircle, Repeat, Heart, BarChart2, Upload } from 'lucide-react'; // Using BarChart2 for views
import { useTheme } from '../../contexts/ThemeContext';

const TwitterPreview = ({ userName, profilePicUrl, postContent, mediaUrl, mediaType, youtubeTitle }) => {
  const { isDarkMode } = useTheme();
  const platformUserName = userName || "YourUsername";
  const displayName = "Your Display Name";
  const platformProfilePic = profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1DA1F2&color=fff&size=48`;
  const timestamp = "· 1m"; // Static timestamp

  return (
    <div className={`w-full max-w-md mx-auto rounded-lg shadow-md ${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border p-3`}>
      <div className="flex">
        <img src={platformProfilePic} alt="Profile" className="w-12 h-12 rounded-full mr-3 flex-shrink-0" />
        <div className="flex-1">
          {/* User Info */}
          <div className="flex items-center">
            <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{displayName}</p>
            <p className={`ml-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>@{platformUserName}</p>
            <p className={`ml-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{timestamp}</p>
          </div>

          {/* Content */}
          {postContent && (
            <div className={`mt-1 text-sm ${isDarkMode ? 'text-white' : 'text-black'} whitespace-pre-wrap break-words`}>
              {postContent}
            </div>
          )}

          {/* Media */}
          {mediaUrl && (
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {mediaType === 'image' && <img src={mediaUrl} alt="Post media" className="w-full max-h-72 object-cover" />}
              {mediaType === 'video' && <video controls src={mediaUrl} className="w-full max-h-72 object-cover bg-black">Your browser does not support video.</video>}
              {mediaType === 'gif' && <img src={mediaUrl} alt="Post GIF" className="w-full max-h-72 object-cover" />}
            </div>
          )}
          
          {/* Actions */}
          <div className={`flex justify-between items-center mt-3 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            <button className="flex items-center gap-1 hover:text-blue-500">
              <MessageCircle size={16} /> 123
            </button>
            <button className="flex items-center gap-1 hover:text-green-500">
              <Repeat size={16} /> 45
            </button>
            <button className="flex items-center gap-1 hover:text-pink-500">
              <Heart size={16} /> 678
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500">
              <BarChart2 size={16} /> 9.1K
            </button>
            <button className="hover:text-blue-500">
              <Upload size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterPreview;
