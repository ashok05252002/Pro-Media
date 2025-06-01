import React from 'react';
import { ThumbsUp, MessageSquare, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const platformIcons = {
  facebook: <Facebook className="w-4 h-4 text-blue-600" />,
  instagram: <Instagram className="w-4 h-4 text-pink-600" />,
  twitter: <Twitter className="w-4 h-4 text-blue-400" />,
  linkedIn: <Linkedin className="w-4 h-4 text-blue-700" />,
  youtube: <Youtube className="w-4 h-4 text-red-600" />,
  Unknown: <MessageSquare className="w-4 h-4 text-gray-500" />
};

const CommentItem = ({ comment, postTitle, platform, onReplyClick }) => {
  console.log("CommentITEM: ", comment, postTitle, platform)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const platformIcon = platformIcons[platform] || platformIcons.Unknown;

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <div className="flex">
        <img 
          src={comment?.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment?.reviewer_name)}&background=random`} 
          alt={comment.reviewer_name} 
          className="w-10 h-10 rounded-full mr-4 flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{comment.reviewer_name}</h3>
                {platform && (
                  <span className="ml-2 flex items-center text-xs text-gray-500 dark:text-gray-400" title={`Comment on ${platform}`}>
                    {platformIcon}
                    <span className="ml-1">{platform}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getTimeAgo(comment.review_date)}
                {postTitle && <span className="mx-1">•</span>}
                {postTitle && (
                  <span className="italic">on "{postTitle}"</span>
                )}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 break-words">{comment.review_text}</p>
          
          {/* Display First Reply */}
          {comment.reponse_status > 0 && (
            <div className="ml-0 md:ml-10 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex mb-2">
                <img 
                  src={comment?.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment?.responser_name)}&background=random`} 
                  alt={comment?.reponser_name || ""} 
                  className="w-8 h-8 rounded-full mr-3 flex-shrink-0"
                />
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200">{comment?.reponser_name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(comment?.reponseded_date)}</p>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{comment?.reponse_text}</p>
                </div>
              </div>
              {comment?.reponse_status> 1 && (
                <button className="text-xs text-theme-primary hover:underline font-medium">
                  View {comment?.reponse_status - 1} more replies
                </button>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center">
            <div className="flex items-center text-gray-500 dark:text-gray-400 mr-4">
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span className="text-xs">{comment?.likes}</span>
            </div>
            <button 
              onClick={() => onReplyClick(comment.id)}
              className="text-xs text-theme-primary hover:underline font-medium"
            >
              Reply
            </button>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {formatDate(comment.reponseded_date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
