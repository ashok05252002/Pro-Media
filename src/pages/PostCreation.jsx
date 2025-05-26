import React, { useEffect, useState, useRef, use } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import {
  Image,
  Link,
  Smile,
  Calendar,
  Clock,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Save,
  Send,
  X,
  Eye,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  extCompanyProductDataById,
  extCompanyMstrDataSource,
  extCompanyProductData,
} from "../API/api";

const PostCreation = () => {
  const [postContent, setPostContent] = useState("");
  const [options, setOptions] = useState([]);
  const formRef = useRef();
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedPlatformId, setSelectedPlatformId] = useState(null);
  const [selectedExtPrdctDSId, setSelectedExtPrdctDSId] = useState(null);

  const [allDataSourceIds, setAllDataSourceIds] = useState([]);
  const [allPlaftformIds, setAllPlaftformIds] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [formattedDateAndTime, setFormattedDateAndTime] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPreviewModal, setShowPreviewMsodal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [idForPlatform, setIdForPlatform] = useState(null);
  const [selectionRange, setSelectionRange] = useState({
    field: null,
    start: 0,
    end: 0,
  });
  const [socialMediaDatas, setSocialMediaDatas] = useState([]);
  const [productDataSources, setProductsDataSources] = useState([]);
  
  // Keep track of which input field is currently active
  const [activeInputField, setActiveInputField] = useState(null);

  // Create refs for input elements
  const titleInputRef = useRef(null);
  const postContentRef = useRef(null);
  const mediaUrlRef = useRef(null);
  const fileInputRef = useRef(null);

  // State for uploaded images
  const [uploadedImages, setUploadedImages] = useState([]);

  const platformMap = new Map();
  const baseStyle =
    "flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer";
  const lightMode = "border-gray-300 hover:bg-gray-50";
  const darkMode = "dark:border-gray-600 dark:hover:bg-gray-700";
  const selectedStyle = "bg-gray-200 dark:bg-gray-800";
  const platformLookup = {
    6577: "amazon",
    8984: "youtube",
    8487: "twitter",
    7066: "facebook",
    7378: "instagram",
    7668: "linkedin",
  };
  let itemDataSourceId = {};

  const platformColors = {
    facebook: "#1877F2",
    instagram: "#E4405F",
    twitter: "#000000",
    linkedin: "#0A66C2",
    // ... keep existing others
  };

  // Helper function to get current date and time in the required format
  const getCurrentDateTime = () => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    const formattedDateTime = `${currentDate}T${currentTime}:00`;

    return {
      date: currentDate,
      time: currentTime,
      formatted: formattedDateTime,
    };
  };
 

  useEffect(() => {
    console.log("calling extCompanyMstrDataSource");
    extCompanyMstrDataSource()
      .then((response) => {
        if (response.status === (200 || 201)) {
          console.log("debugging Mstr_data_source", response.data);
          setSocialMediaDatas(response.data);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
    console.log("calling extCompanyProductData");
    extCompanyProductData() // testing must use user_id
      .then((response) => {
        console.log("hello1", response);
        console.log("debugging1", response);
        if (response.status === (200 || 201)) {
          console.log("debugging2", response.data);
          setOptions(response.data);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    console.log("calling extCompanyProductDataById");
    console.log("hello", selectedItem.id);
    console.log("hello22222", socialMediaDatas);
    if (selectedItem && selectedItem.id) {
      extCompanyProductDataById(selectedItem.id).then((response) => {
        console.log("hello");
            if (response.status === (200 || 201)) {
                // setProductsDataSource(response.data)
                const enrichedData = response.data.map(item => {
                    const masterDataSource = socialMediaDatas.find(
                        master => master.id === item.data_source_id
                    );
                    return {
                        ...item,
                        data_source_name: masterDataSource ? masterDataSource.type : 'Unknown'
                    };
                 });
        
                // Now you can use the enriched data
                setProductsDataSources(enrichedData);    



                // response.data.forEach((item) => {
                // console.log("item.data_source_id", item.data_source_id);
                // });
            // response.data.forEach((item) => {
            // console.log(
            //   "item.data_source_id:",
            //   item.data_source_id,
            //   "item.id:",
            //   item.id
            // );
            // itemDataSourceId = {
            //   [item.data_source_id]: item.id,
            // };
            // console.log("itemDataSourceId", itemDataSourceId);
            // });

          console.log("debugging ext_product", response.data);
          // setIdForPlatform(response.data[0].id);
          //   setIdForPlatform(response.data);
          //   const data = response.data;

          // const ids = data.map((item) => item.id);
        //   const data_source_id = data.map((item) => item.data_source_id);

        //   const idToSourceMap = {};
        //   data.forEach((item) => {
        //     idToSourceMap[item.id] = item.data_source_id;
        //   });
        //   setAllPlaftformIds(idToSourceMap);
        //   setAllDataSourceIds(data_source_id); // ✅ trigger re-render
          // setAllPlaftformIds(ids); // ✅ trigger re-render
          // setAllPlaftformIds({ [ids]: data_source_id });
        //   console.log("allPlaftformIds platfrom test", allPlaftformIds);

          // console.log("allDataSourceIds", ids);
        } else {
          console.log(response);
        }
      });
    }
  }, [selectedItem, selectedPlatform, allPlaftformIds]);
  

  const handleChange = (e) => {
     const selectedObj = JSON.parse(e.target.value);
    //   console.log("Selected ID:", selectedOption.id);
    //   console.log("Selected Product Name:", selectedOption.product_name);
    //     const selectedId = e.target.value;
    //     const selectedObj = options.find(
    //       (option) => option.id.toString() === selectedId
    //     );
    setSelectedItem(selectedObj);
    console.log("Selected ID:", selectedObj?.id);
    console.log("Selected Name:", selectedObj?.product_name);
    console.log("selectedPlatform", selectedPlatform);
  };

  // Handle file upload for images
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map((file) => {
      const imageUrl = URL.createObjectURL(file);
      return {
        file,
        url: imageUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      };
    });

    setUploadedImages((prev) => [...prev, ...newImages]);

    if (postContentRef.current) {
      const textarea = postContentRef.current;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;

      // Create placeholder text with filenames
      const placeholders = newImages
        .map((img) => `[Image: ${img.name}]`)
        .join(" ");

      // Insert at cursor position
      const newText =
        postContent.slice(0, startPos) +
        placeholders +
        postContent.slice(endPos);

      setPostContent(newText);

      // Move cursor to end of inserted text
      setTimeout(() => {
        const newCursorPos = startPos + placeholders.length;
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
        textarea.focus();
      }, 0);
    }
  };
  const platformPicker = (e) => {
    const selectedId = e;
    console.log("Selected ID:", selectedId);
  };

  // Remove an uploaded image
  const removeUploadedImage = (indexToRemove) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      const removedImage = newImages[indexToRemove];

      // Remove corresponding placeholder from text
      setPostContent((prevContent) =>
        prevContent.replace(`[Image: ${removedImage.name}]`, "")
      );

      URL.revokeObjectURL(removedImage.url);
      newImages.splice(indexToRemove, 1);
      return newImages;
    });
  };

  // Trigger file input click
  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Validation function to check required fields
  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = "Post Title is required";
    }

    if (!postContent.trim()) {
      errors.postContent = "Post Content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitPost = async (status) => {
    // For drafts, validate form first
    if (status === "draft" && !validateForm()) {
      return false;
    }

    setLoading(true);

    try {
      // Prepare the datetime for scheduled posts or drafts
      let scheduledDateTime = "";

      if (status === "draft") {
        // For drafts, always use current date/time
        const currentDateTime = getCurrentDateTime();
        setDate(currentDateTime.date);
        setTime(currentDateTime.time);
        scheduledDateTime = currentDateTime.formatted;
        setFormattedDateAndTime(scheduledDateTime);
      } else if (selectedOption === "schedule" && date && time) {
        // For scheduled posts with date and time set
        scheduledDateTime = `${date}T${time}:00`;
        setFormattedDateAndTime(scheduledDateTime);
      } else if (selectedOption === "postNow") {
        // For immediate posts, use current time
        const currentDateTime = getCurrentDateTime();
        scheduledDateTime = currentDateTime.formatted;
        setFormattedDateAndTime(scheduledDateTime);
      }

      // Handle file uploads first if there are any
      let mediaUrls = mediaUrl ? [mediaUrl] : [];

      if (uploadedImages.length > 0) {
        // Create a form data object to upload files
        const formData = new FormData();

        // Append each file to form data
        uploadedImages.forEach((img, index) => {
          formData.append("files", img.file);
        });

        // Here you would typically upload the images to your server
        // and get back URLs to use in your post
        try {
          // This is a placeholder - replace with your actual image upload API
          // const uploadResponse = await axios.post('your-upload-endpoint', formData);
          // const uploadedUrls = uploadResponse.data.urls;

          // For demonstration, we'll just use the local object URLs
          const uploadedUrls = uploadedImages.map((img) => img.url);
          mediaUrls = [...mediaUrls, ...uploadedUrls];
        } catch (error) {
          console.error("Error uploading images:", error);
          alert("Failed to upload images. Please try again.");
          setLoading(false);
          return false;
        }
      }

      // Create payload based on form data
      const payload = {
        ext_product_data_source_id: selectedExtPrdctDSId,
        post_title: title || "Untitled Post", // Default title if empty
        description: postContent || "", // Keep empty string if no content
        media_url: mediaUrls.join(",") || "", // Join all media URLs
        scheduled_time: scheduledDateTime,
        status: status, // Use the status parameter
        repeat_interval: repeatInterval,
      };

      console.log("Submitting payload:", payload);

      // Send API request
      const response = await axios.post(
        `http://192.168.80.100:5000/${selectedPlatform}_post/addposts`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        alert(
          `Post ${
            status === "draft" ? "saved as draft" : "submitted"
          } successfully!`
        );
        // Reset form errors
        setFormErrors({});
        // Reset form fields if needed
        if (status !== "draft") {
          setPostContent("");
          setTitle("");
          setDescription("");
          setMediaUrl("");
          setUploadedImages([]); // Clear uploaded images
        }
        return true;
      } else {
        alert("There was an issue with your post.");
        return false;
      }
    } catch (error) {
      console.error("Error with post:", error);
      alert("Failed to process post: " + (error.message || "Unknown error"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = selectedOption === "postNow" ? "post" : "scheduled";
    await submitPost(status);
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Uncheck both post options
    setSelectedOption("");

    // Set current date and time for the draft
    const currentDateTime = getCurrentDateTime();
    setDate(currentDateTime.date);
    setTime(currentDateTime.time);
    setFormattedDateAndTime(currentDateTime.formatted);

    // Save as draft with draft status
    await submitPost("draft");
  };

  // Handle focus on input fields to track which one is active
  const handleInputFocus = (inputName) => {
    setActiveInputField(inputName);
  };

  // Handle emoji picker toggle
  const handleAddEmoji = () => {
    const activeField = activeInputField;
    if (!activeField) return;

    // Get the current input reference
    let inputRef;
    switch (activeField) {
      case "title":
        inputRef = titleInputRef.current;
        break;
      case "postContent":
        inputRef = postContentRef.current;
        break;
      case "mediaUrl":
        inputRef = mediaUrlRef.current;
        break;
      default:
        return;
    }

    // Capture selection position
    if (inputRef) {
      setSelectionRange({
        field: activeField,
        start: inputRef.selectionStart,
        end: inputRef.selectionEnd,
      });
    }

    setShowEmojiPicker((prev) => !prev);
  };

  // Handle emoji selection and add to the active input field
  const handleEmojiClick = (emojiData) => {
    const { field, start, end } = selectionRange;
    if (!field) return;

    const emoji = emojiData.emoji;

    switch (field) {
      case "title":
        setTitle((prev) => {
          const newValue = prev.slice(0, start) + emoji + prev.slice(end);
          // Update cursor position after state update
          setTimeout(() => {
            titleInputRef.current?.setSelectionRange(
              start + emoji.length,
              start + emoji.length
            );
          }, 0);
          return newValue;
        });
        break;

      case "postContent":
        setPostContent((prev) => {
          const newValue = prev.slice(0, start) + emoji + prev.slice(end);
          setTimeout(() => {
            postContentRef.current?.setSelectionRange(
              start + emoji.length,
              start + emoji.length
            );
          }, 0);
          return newValue;
        });
        break;

      case "mediaUrl":
        setMediaUrl((prev) => {
          const newValue = prev.slice(0, start) + emoji + prev.slice(end);
          setTimeout(() => {
            mediaUrlRef.current?.setSelectionRange(
              start + emoji.length,
              start + emoji.length
            );
          }, 0);
          return newValue;
        });
        break;

      default:
        break;
    }

    setShowEmojiPicker(false);
    setSelectionRange({ field: null, start: 0, end: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <h1 className="text-2xl font-semibold">Create New Post</h1>
        <select
          required
          style={{ marginLeft: "30px", width: "20%" }}
          defaultValue=""
          onChange={handleChange}
          className="ml-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md"
        >
          <option value="">-- Select Product --</option>
          {options.map((option) => (
                <option key={option.id} value={JSON.stringify(option)}>
                {option.product_name}
                </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 border ${
                      formErrors.title
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700`}
                    placeholder="Enter post title"
                    value={title}
                    ref={titleInputRef}
                    onFocus={() => {
                      handleInputFocus("title");
                      titleInputRef.current?.setSelectionRange(
                        titleInputRef.current.selectionStart,
                        titleInputRef.current.selectionEnd
                      );
                    }}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (e.target.value.trim()) {
                        setFormErrors({ ...formErrors, title: null });
                      }
                    }}
                    required
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Post Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full p-4 border placeholder:text-gray-400 placeholder:italic ${
                    formErrors.postContent
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary min-h-[200px] dark:bg-gray-700 `}
                  placeholder="What would you like to share today?"
                  value={postContent}
                  ref={postContentRef}
                  onFocus={() => {
                    handleInputFocus("postContent");
                    postContentRef.current?.setSelectionRange(
                      postContentRef.current.selectionStart,
                      postContentRef.current.selectionEnd
                    );
                  }}
                  onChange={(e) => {
                    setPostContent(e.target.value);
                    if (e.target.value.trim()) {
                      setFormErrors({ ...formErrors, postContent: null });
                    }
                  }}
                  required
                ></textarea>
                {formErrors.postContent && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.postContent}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Media URL (optional)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                  placeholder="Enter image or video URL"
                  value={mediaUrl}
                  ref={mediaUrlRef}
                  onFocus={() => {
                    handleInputFocus("mediaUrl");
                    mediaUrlRef.current?.setSelectionRange(
                      mediaUrlRef.current.selectionStart,
                      mediaUrlRef.current.selectionEnd
                    );
                  }}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 relative">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={handleAddImageClick}
                >
                  <Image className="w-5 h-5 text-gray-500" />
                  <span>Add Image</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    setShowLinkModal(true);
                    // Capture current selection range
                    const activeField = activeInputField;
                    let selectionStart = 0;
                    let selectionEnd = 0;

                    if (activeField === "title" && titleInputRef.current) {
                      selectionStart = titleInputRef.current.selectionStart;
                      selectionEnd = titleInputRef.current.selectionEnd;
                    } else if (postContentRef.current) {
                      selectionStart = postContentRef.current.selectionStart;
                      selectionEnd = postContentRef.current.selectionEnd;
                    }

                    setSelectionRange({
                      field: activeField,
                      start: selectionStart,
                      end: selectionEnd,
                    });
                  }}
                >
                  <Link className="w-5 h-5 text-gray-500" />
                  <span>Add Link</span>
                </button>

                {/* Wrap the Add Emoji button + picker together in a relative container */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleAddEmoji}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Smile className="w-5 h-5 text-gray-500" />
                    <span>Add Emoji</span>
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute top-full left-0 mt-2 z-50">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        lazyLoadEmojis
                        height={400}
                        width={300}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Uploaded Images
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {uploadedImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative group border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="h-20 w-20 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white text-xs p-1 truncate">
                          {img.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-6">
                <label
                  className={`${baseStyle} ${lightMode} ${darkMode} ${
                    selectedOption === "postNow" ? selectedStyle : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="postOption"
                    value="postNow"
                    className="mr-2"
                    checked={selectedOption === "postNow"}
                    onChange={() => setSelectedOption("postNow")}
                  />
                  Post Now
                </label>

                <label
                  className={`${baseStyle} ${lightMode} ${darkMode} ${
                    selectedOption === "schedule" ? selectedStyle : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="postOption"
                    value="schedule"
                    className="mr-2"
                    checked={selectedOption === "schedule"}
                    onChange={() => setSelectedOption("schedule")}
                  />
                  Schedule
                </label>
              </div>
              {selectedOption === "schedule" && (
                <>
                  <h3 className="text-lg font-medium mb-4">Schedule Post</h3>
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required={selectedOption === "schedule"}
                          />
                          <Calendar
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required={selectedOption === "schedule"}
                          />
                          <Clock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Repeat Interval
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                        value={repeatInterval}
                        onChange={(e) => setRepeatInterval(e.target.value)}
                      >
                        <option value="none">No Repeat</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span>Time zone: Eastern Time (ET)</span>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-theme-primary hover:bg-opacity-90 text-white font-medium rounded-md flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Post"}
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-4">Platforms</h3>

              <div className="space-y-3">
                {console.log("allDataSourceIds inside jsx:", allDataSourceIds)}
                {/* {allPlaftformIds?.map((id) => {
                  const name = platformLookup[id]; */}
                  {productDataSources?.map(productDataSource => {
                  console.log("selected platforms", selectedPlatform);
                  if (!productDataSource.data_source_name) return;
                  const isSelected = selectedPlatform === productDataSource.data_source_name;
                  var color = platformColors[productDataSource.data_source_name] || "gray-400";
                  return (
                    <div
                      key={productDataSource.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${
                        isSelected
                          ? `border-${color} bg-opacity-10 bg-${color}`
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      onClick={() => {
                        setSelectedPlatform(productDataSource.data_source_name);
                        setSelectedExtPrdctDSId(productDataSource.id)
                        setSelectedPlatformId(productDataSource.data_source_id)
                        
                        // setIdForPlatform(id);
                        console.log(
                          "selected platform for my",
                          selectedPlatform
                        );
                        console.log("selected platform", productDataSource.data_source_name);
                        platformColors[productDataSource.data_source_name] || "gray-400";
                        console.log("selected platform", productDataSource.data_source_id);
                        console.log("selected platform , platformId, ExtDSId", 
                            productDataSource.data_source_name,
                            productDataSource.data_source_id,
                            productDataSource.id);
                        platformPicker();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full bg-${color} flex items-center justify-center text-white font-bold uppercase`}
                        >
                          {productDataSource.data_source_name}
                        </div>
                        <span className="font-medium capitalize">{productDataSource.data_source_name}</span>
                      </div>

                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-gray-300 dark:border-gray-500">
                        {isSelected && (
                          <div
                            className={`w-3 h-3 rounded-full bg-${color} border-green-300`}
                          >
                            <div
                              style={{
                                height: 13,
                                width: 13,
                                backgroundColor: color,
                                borderRadius: 100,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-4">Post Preview</h3>

              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[150px]">
                {title && (
                  <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                    {title}
                  </h4>
                )}
                {postContent ? (
                  <p className="text-gray-800 dark:text-gray-200">
                    {postContent}
                  </p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">
                    Your post preview will appear here...
                  </p>
                )}
                {mediaUrl && (
                  <div className="mt-3 italic text-sm text-gray-500">
                    Media: {mediaUrl}
                  </div>
                )}
              </div>
            </div> */}

            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={handleSaveDraft}
                disabled={loading}
              >
                <Save className="w-5 h-5" />
                <span>{loading ? "Saving..." : "Save Draft"}</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowPreviewMsodal(true)}
              >
                <Eye className="w-5 h-5 text-gray-500" />{" "}
                {/* Add Eye icon import */}
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>
      </form>
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Link</h3>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkInput("");
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Paste or type URL here"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkInput("");
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (linkInput) {
                    const activeField = activeInputField;
                    const linkText = ` ${linkInput} `; // Add spaces around the link

                    if (activeField === "title") {
                      const newValue =
                        title.slice(0, selectionRange.start) +
                        linkText +
                        title.slice(selectionRange.end);
                      setTitle(newValue);
                    } else {
                      const newValue =
                        postContent.slice(0, selectionRange.start) +
                        linkText +
                        postContent.slice(selectionRange.end);
                      setPostContent(newValue);
                    }
                  }
                  setShowLinkModal(false);
                  setLinkInput("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">Post Preview</h2>
              <h3 className="text-xl font-semibold">{selectedPlatform}</h3>

              <button
                onClick={() => setShowPreviewMsodal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Move the existing preview content here */}
            <div className="p-6">
              <div className="flex items-start mb-4">
                {selectedPlatform === "facebook" && (
                  <div className="border-l-4 border-blue-600 p-4">
                    {/* Facebook Preview Content */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="https://i.pravatar.cc/40"
                        className="w-10 h-10 rounded-full"
                        alt="Profile"
                      />
                      <div>
                        <p className="font-semibold">Social Media Page</p>
                        <p className="text-xs text-gray-500">
                          Sponsored · {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {title && (
                      <h2 className="font-bold text-xl mb-2">{title}</h2>
                    )}
                    <div className="text-base whitespace-pre-line">
                      {postContent}
                    </div>
                    {/* Add Facebook engagement buttons */}
                  </div>
                )}

                {selectedPlatform === "instagram" && (
                  <div className="border rounded-lg max-w-[400px] mx-auto">
                    {/* Instagram Preview Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src="https://i.pravatar.cc/40"
                          className="w-8 h-8 rounded-full"
                          alt="Profile"
                        />
                        <span className="font-semibold">yourinstagram</span>
                      </div>
                      {mediaUrl && (
                        <img
                          src={mediaUrl}
                          alt="Post"
                          className="w-full object-cover aspect-square"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex gap-4 text-gray-600">
                          <Heart size={24} />
                          <MessageCircle size={24} />
                          <Share2 size={24} />
                        </div>
                        <div className="mt-2 text-sm font-semibold">
                          1,234 likes
                        </div>
                        <div className="mt-2 text-sm whitespace-pre-line">
                          {postContent}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlatform === "twitter" && (
                  <div className="border rounded-lg p-4 max-w-[500px] mx-auto">
                    {/* Twitter/X Preview Content */}
                    <div className="flex gap-3 mb-4">
                      <img
                        src="https://i.pravatar.cc/40"
                        className="w-12 h-12 rounded-full"
                        alt="Profile"
                      />
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-gray-500">
                          @johndoe · {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-base whitespace-pre-line mb-4">
                      {postContent}
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <button className="hover:text-blue-400">
                        <MessageCircle size={18} /> 42
                      </button>
                      <button className="hover:text-green-500">
                        <Share2 size={18} /> 12
                      </button>
                      <button className="hover:text-red-500">
                        <Heart size={18} /> 234
                      </button>
                    </div>
                  </div>
                )}

                {selectedPlatform === "linkedin" && (
                  <div className="border rounded-lg p-4 max-w-[600px] mx-auto">
                    {/* LinkedIn Preview Content */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="https://i.pravatar.cc/40"
                        className="w-12 h-12 rounded-full"
                        alt="Profile"
                      />
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-gray-500">
                          Software Developer · 1st
                        </p>
                      </div>
                    </div>
                    <div className="text-base whitespace-pre-line mb-4">
                      {postContent}
                    </div>
                    <div className="flex gap-4 text-gray-500">
                      <button className="flex items-center gap-1">
                        <ThumbsUp size={18} /> Like
                      </button>
                      <button className="flex items-center gap-1">
                        <MessageCircle size={18} /> Comment
                      </button>
                    </div>
                  </div>
                )}

                {!selectedPlatform && (
                  /* Default preview when no platform selected */
                  <div className="border rounded-lg p-4">
                    {/* ... existing default preview ... */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCreation;
