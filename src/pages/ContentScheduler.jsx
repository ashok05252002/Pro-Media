import React, { useState, useEffect } from "react";
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
import { extCompanyPrdctCreatePost, extCompanyDeleteCreatedPost, extCompanyGetAllCreatePosts } from "../API/api";

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
      const response = await fetch(
       `${import.meta.env.VITE_BASE_API_URL} /${platform.name}_post/updateposts/${post.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const updatedPost = await response.json();
      onSave(updatedPost);
      onClose();
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

const ScheduledPost = ({ post, onEdit, onDelete }) => {
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
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${platformInfo.color}`}
          >
            <span className="text-white font-bold">{platformInfo.icon}</span>
          </div>
          <div>
            <h3 className="font-medium">{post.post_title}</h3>
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
          <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
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
  );
};

const ContentScheduler = () => {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [counts, setCounts] = useState({
    scheduled: 0,
    draft: 0,
    published: 0,
  });
  const navigate = useNavigate();

  const platforms = [
    { id: 6577, name: "amazon", postCode: "az", label: "Amazon" },
    { id: 8984, name: "youtube", postCode: "yt", label: "YouTube" },
    { id: 8487, name: "twitter", postCode: "twt", label: "Twitter" },
    { id: 7066, name: "facebook", postCode: "fb", label: "Facebook" },
    { id: 7378, name: "instagram", postCode: "insta", label: "Instagram" },
    { id: 7668, name: "linkedin", postCode: "ln", label: "LinkedIn" },
  ];

  const handleCreatePost = () => {
    window.location.href = "http://localhost:3000/post-creation";
    // navigate("/post-creation");
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleCloseEditModal = () => {
    setEditingPost(null);
  };

  const handleSaveEditedPost = (updatedPost) => {
    // Update post in the allPosts state
    setAllPosts((prev) =>
      prev.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );

    // Update counts if status changed
    fetchPostCounts();
  };

  const handleDeletePost = (post) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      // Find the platform info based on data_source_id
      const platform = platforms.find((p) => p.id === post.data_source_id);

      if (platform) {
        // fetch(
        //   `http://192.168.80.100:5000/${platform.name}_post/deleteposts/${post.id}`,
        //   { method: "DELETE" }
        // )

        extCompanyDeleteCreatedPost(platform.name, post.id)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return res.json();
          })
          .then(() => {
            // Remove the post from state
            setAllPosts((prev) => prev.filter((p) => p.id !== post.id));
            // Update counts
            fetchPostCounts();
          })
          .catch((error) => {
            console.error(`Error deleting post:`, error);
            alert("Failed to delete post. Please try again.");
          });
      } else {
        console.error(
          "Unknown platform for data_source_id:",
          post.data_source_id
        );
      }
    }
  };

  const fetchPostCounts = () => {
    const newCounts = { scheduled: 0, draft: 0, published: 0 };
    allPosts.forEach((post) => {
      const status = post.status?.toLowerCase();
      if (status in newCounts) newCounts[status]++;
    });
    setCounts(newCounts);
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      try {
        const fetchPromises = platforms.map(async (platform) => {
          try {
            console.log("platform name:", platform.name);
            console.log("platform postCode:", platform.postCode);
            // const res = await fetch(
            //   `http://192.168.80.100:5000/${platform.name}_post/${platform.postCode}posts`
            // );
            const res = await extCompanyGetAllCreatePosts (platform);

            // if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            if(res){
              const data = await res.data;
              return data.map((post) => ({
                ...post,
                data_source_id: platform.id,
            
              }));
            }
          } catch (error) {
            console.error(`Error fetching  posts:`, error);
            return [];
          }
        });

        const results = await Promise.all(fetchPromises);
        const combinedPosts = results.flat();
        setAllPosts(combinedPosts);

        const newCounts = { scheduled: 0, draft: 0, published: 0 };
        combinedPosts.forEach((post) => {
          const status = post.status?.toLowerCase();
          if (status in newCounts) newCounts[status]++;
        });
        setCounts(newCounts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const getFilteredAndSortedPosts = () => {
    let filtered = allPosts.filter(
      (post) => post.status?.toLowerCase() === activeTab
    );

    if (platformFilter !== "all") {
      filtered = filtered.filter(
        (post) => post.data_source_id === parseInt(platformFilter)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.scheduled_time || a.created_on || 0);
      const dateB = new Date(b.scheduled_time || b.created_on || 0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const filteredPosts = getFilteredAndSortedPosts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Content Scheduler</h1>
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-2 px-4 py-2 border ${
              showFilters
                ? "border-[#F97316] text-[#F97316]"
                : "border-gray-300 dark:border-gray-600"
            } rounded-md hover:bg-gray-50 dark:hover:bg-gray-700`}
            onClick={toggleFilters}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-md"
            onClick={handleCreatePost}
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Sort by Date
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Platform
              </label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Platforms</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {["scheduled", "draft", "published"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? "border-[#F97316] text-[#F97316]"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-10">Loading posts...</div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <ScheduledPost
                key={post.id || idx}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))
          ) : (
            <div className="text-center py-10">No {activeTab} posts found.</div>
          )}
        </div>
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedPost}
        />
      )}
    </div>
  );
};

export default ContentScheduler;
