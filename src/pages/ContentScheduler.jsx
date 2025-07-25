import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Filter,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,LayoutList, CalendarDays
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { extCompanyPrdctCreatePost, extCompanyDeleteCreatedPost, extCompanyGetAllCreatePosts } from "../API/api";
import PostCardItem from "./post/PostCard"; 
import EditPostModal from "./post/EditPost";

// import ScheduledPostList from "./post/PostCard"


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
    window.location.href = import.meta.env.VITE_BASE_API_URL + "/post-creation";
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
    // setAllPosts((prev) =>
    //   prev.map((post) =>
    //     post.id === updatedPost.id ? { ...post, ...updatedPost } : post
    //   )
    // );

    // Update counts if status changed
    fetchPostCounts();
    fetchAllPosts();
  };

  const handleDeletePost = (post) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      // Find the platform info based on data_source_id
      const platform = platforms.find((p) => p.id === post.data_source_id);

      if (platform) {
        // fetch(
        //   `${import.meta.env.VITE_BASE_API_URL}/${platform.name}_post/deleteposts/${post.id}`,
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
            fetchAllPosts();
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
    fetchAllPosts();
  }, []);

    const fetchAllPosts = async () => {
      setLoading(true);
      try {
        const fetchPromises = platforms.map(async (platform) => {
          try {
            console.log("platform name:", platform.name);
            console.log("platform postCode:", platform.postCode);
            // const res = await fetch(
            //   `${import.meta.env.VITE_BASE_API_URL }/${platform.name}_post/${platform.postCode}posts`
            // );
            const res = await extCompanyGetAllCreatePosts(platform);

            // if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            if (res) {
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

        const newCounts = { scheduled: 0, draft: 0, posted: 0 };
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


  const getFilteredAndSortedPosts = () => {
    console.log("getFilteredAndSortedPosts");
    console.log(allPosts);

    let filtered = allPosts.filter(
      (post) => post.status?.toLowerCase() === activeTab);
    console.log(filtered);

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

  useEffect(() => {
    const filterobj = getFilteredAndSortedPosts();
    setFilteredPosts(filterobj);
  }, [allPosts, activeTab, platformFilter, sortOrder])

  const [filteredPosts, setFilteredPosts] = useState([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-2xl font-semibold">Content Scheduler</h1>
        <div className="flex gap-3">

          <div className="flex items-center gap-2 mt-3 sm:mt-0">
  <button
    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors bg-theme-primary text-white shadow-md"
  >
    <LayoutList className="w-4 h-4" />
    List View
  </button>
  <Link
    to="/calendar-view"
    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
  >
    <CalendarDays className="w-4 h-4" />
    Calendar View
  </Link>
</div>
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
                {platforms.map((platform, index) => (
                  <option key={platform.id + index} value={platform.id}>
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
            {["scheduled", "draft", "posted"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === tab
                  ? "border-[#F97316] text-[#F97316]"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab == 'posted' ? "Published" : tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-10">Loading posts...</div>
          ) : filteredPosts.length > 0 ?
            filteredPosts.map((post, idx) => (
              <PostCardItem key={post.id || idx} post={post} onEdit={handleEditPost} onDelete={handleDeletePost} />
            )) : (
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


