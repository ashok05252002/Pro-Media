

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Filter,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react"; 


const PostCardItem = ({ post, onEdit, onDelete }) => {
  const getPlatformInfo = (dataSourceId) => {
    const platformMap = {
      6577: { icon: "AZ", color: "bg-yellow-600" },
      8984: { icon: "YT", color: "bg-red-600" },
      8487: { icon: "TW", color: "bg-blue-400" },
      7066: { icon: "FB", color: "bg-blue-600" },
      7378: { icon: "IG", color: "bg-pink-600" },
      7668: { icon: "LI", color: "bg-blue-700" },
    };
    return platformMap[dataSourceId] || { icon: "??", color: "bg-gray-500" };
  };

  const getStatusColor = (status) => {
    const statusMap = {
      scheduled: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
    };
    return statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    if (
      date.toDateString() ===
      new Date(today.setDate(today.getDate() + 1)).toDateString()
    )
      return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

        const platformInfo = getPlatformInfo(post.data_source_id);
        const statusColor = getStatusColor(post.status);
  return (
    <div
      key={post.id || idx}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${platformInfo.color}`}
          >
            <span className="text-white font-bold">
              {platformInfo.icon}
            </span>
          </div>
          <div>
            <h3 className="font-medium">
              {post.post_title} 
            </h3>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formatDate(post.scheduled_time)}</span>
              {post.scheduled_time && (
                <>
                  <Clock className="w-3 h-3 ml-3 mr-1" />
                  <span>{formatTime(post.scheduled_time)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${statusColor}`}
          >
            {post.status.charAt(0).toUpperCase() +
              post.status.slice(1)}
          </span>
          <button
            onClick={() => onEdit(post)}
            className="text-gray-500 hover:text-blue-600"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(post)}
            className="text-gray-500 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
        {post.description}
      </div>
      {post.media_url && (
        <div className="mt-3">
          <img
            src={post.media_url}
            alt="Post preview"
            className="rounded-md h-32 w-full object-cover"
          />
        </div>
      )}
    </div>
  )
}


export default PostCardItem;

