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
import { useNavigate } from "react-router-dom"; 
import { extCompanyEditedCreateddPost } from "../../API/api";
import { toast } from "react-toastify";
 

const EditPostModal = ({ post, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ext_product_data_source_id: post?.ext_product_data_source_id || 2,
    post_title: post?.post_title || "",
    description: post?.description || "",
    scheduled_time: post?.scheduled_time
      ? new Date(post.scheduled_time).toISOString().slice(0, 16)
      : "",
    media_url: post?.media_url || "",
    status: post?.status || "draft",
    repeat_interval: post?.repeat_interval || "weekly",
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload according to the required format
    const payload = {
      ext_product_data_source_id:
        parseInt(formData.ext_product_data_source_id) || 2,
      post_title: formData.post_title,
      description: formData.description,
      media_url: formData.media_url,
      scheduled_time: formData.scheduled_time
        ? new Date(formData.scheduled_time)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
        : null,
      status: formData.status,
      repeat_interval: formData.repeat_interval || "weekly",
    };

    // Get platform info based on post_id
    const platformMap = {
      6577: { name: "amazon", postCode: "az" },
      8984: { name: "youtube", postCode: "yt" },
      8487: { name: "twitter", postCode: "twt" },
      7066: { name: "facebook", postCode: "fb" },
      7378: { name: "instagram", postCode: "insta" },
      7668: { name: "linkedin", postCode: "ln" },
    };

    const platform = platformMap[post.data_source_id];

    if (!platform) {
      console.error(
        "Unknown platform for data_source_id:",
        post.data_source_id
      );
      return;
    }

    try {
      console.log("Sending PATCH request with payload:", payload);
      console.log("platform name:", platform.name);
      console.log("post id:", typeof post.id);
      const token = localStorage.getItem("authToken")


        const response = await extCompanyEditedCreateddPost(platform.name, post.id, payload);
        console.log(response);
       
        if(response){
            toast.success(response.message ?? '');
            onSave(response);
            onClose();
        }
        else if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
 
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Post Title
            </label>
            <input
              type="text"
              name="post_title"
              value={formData.post_title}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Media URL
            </label>
            <input
              type="text"
              name="media_url"
              value={formData.media_url}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              name="scheduled_time"
              value={formData.scheduled_time}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Repeat Interval
            </label>
            <select
              name="repeat_interval"
              value={formData.repeat_interval}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Product Data Source ID
            </label>
            <input
              type="number"
              name="ext_product_data_source_id"
              value={formData.ext_product_data_source_id}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;