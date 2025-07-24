import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link as LinkIconLucide, Smile, Calendar, Facebook, Instagram, Twitter, Linkedin, Youtube, Save, Send, X, Check, Trash2, Video as VideoIcon, AlertTriangle, FileUp, Type as TypeIcon, Briefcase, Loader2, Crop, MapPin, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import VideoUploadModal from '../components/VideoUploadModal';
import MediaUploadModal from '../components/MediaUploadModal'; // This component will handle multi-file selection
import { useTheme } from '../contexts/ThemeContext';

import axios from 'axios';
import Tooltip from '../components/Tooltip';

import FacebookPreview from '../components/postPreview/FacebookPreview';
import InstagramPreview from '../components/postPreview/InstagramPreview';
import TwitterPreview from '../components/postPreview/TwitterPreview';
import LinkedInPreview from '../components/postPreview/LinkedInPreview';
import YouTubePreview from '../components/postPreview/YouTubePreview';

// Import Cropper from react-easy-crop
import Cropper from 'react-easy-crop';

// Helper function to create an image from a URL, handling cross-origin issues
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // Needed for cross-origin images
    image.src = url;
  });

// Helper function to get a cropped image blob and URL
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) { // rotation defaults to 0
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const rotRad = rotation * Math.PI / 180;

  // Set canvas size to the dimensions of the cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Translate canvas origin to center of the cropped area
  ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
  ctx.rotate(rotRad); // Apply rotation
  ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2); // Translate back

  // Draw the image onto the canvas, but only draw the cropped portion.
  // The drawImage method overload used here is:
  // drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
  ctx.drawImage(
    image,
    pixelCrop.x,        // Source X
    pixelCrop.y,        // Source Y
    pixelCrop.width,    // Source Width
    pixelCrop.height,   // Source Height
    0,         // Destination X (start at 0,0 of the new canvas)
    0,         // Destination Y (start at 0,0 of the new canvas)
    pixelCrop.width,    // Destination Width (fill the new canvas)
    pixelCrop.height    // Destination Height (fill the new canvas)
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve({ file, url: URL.createObjectURL(file) });
    }, 'image/jpeg'); // You can choose different image formats here
  });
}

// Define the aspect ratio options for image cropping
const ASPECT_RATIO_OPTIONS = [
  { name: "Freeform / Original", value: null }, // Null for original aspect ratio, allows freeform crop
  { name: "Instagram Post (1:1)", value: 1 / 1 },
  { name: "Instagram Story (9:16)", value: 9 / 16 },
  { name: "Facebook Post (1.91:1)", value: 1.91 / 1 },
  { name: "Facebook Cover (820x312)", value: 820 / 312 },
  { name: "YouTube Thumbnail (16:9)", value: 16 / 9 },
  { name: "LinkedIn Banner (1584:396)", value: 1584 / 396 },
];

// Define fit options for videos
const VIDEO_FIT_OPTIONS = [
  { name: "Original", value: null, class: "object-contain" }, // object-contain to show full video
  { name: "Portrait (9:16)", value: 9 / 16, class: "aspect-[9/16] object-cover" }, // 9:16 aspect ratio, cover to fill
  { name: "Square (1:1)", value: 1 / 1, class: "aspect-square object-cover" }, // 1:1 aspect ratio, cover to fill
];

// Renamed from ImageEditModal to MediaEditModal to handle both images and videos
const MediaEditModal = ({ isOpen, onClose, mediaUrl, mediaType, onMediaEdit, mediaIndex }) => {
  // State for image cropping (used by react-easy-crop)
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // State for selected aspect ratio for images
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(ASPECT_RATIO_OPTIONS[0].value);
  
  // State for video fit option
  const [videoFitOption, setVideoFitOption] = useState(VIDEO_FIT_OPTIONS[0].value);

  // Zoom and rotation are fixed for this simplified version of image crop
  const zoom = 1;
  const rotation = 0;

  // Effect to reset state when modal closes or media type changes
  useEffect(() => {
    if (!isOpen) {
      // Reset all crop states and aspect ratio when modal closes
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
      setSelectedAspectRatio(ASPECT_RATIO_OPTIONS[0].value); // Reset image aspect ratio
      setVideoFitOption(VIDEO_FIT_OPTIONS[0].value); // Reset video fit option
    }
  }, [isOpen]);

  // Callback for react-easy-crop when crop is complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handle applying the edit (crop for image, conceptual fitting for videos)
  const handleApplyEdit = useCallback(async () => {
    if (mediaType === 'image') {
      if (!mediaUrl || !croppedAreaPixels) {
        console.error("No image or crop area selected.");
        return;
      }
      try {
        const { file, url } = await getCroppedImg(
          mediaUrl,
          croppedAreaPixels,
          rotation // Pass fixed rotation (0) to the cropping function
        );
        onMediaEdit(file, url, mediaIndex); // Pass index for specific media item
        onClose();
      } catch (e) {
        console.error("Failed to crop image:", e);
      }
    } else if (mediaType === 'video') {
      // This is a conceptual placeholder.
      // Actual video processing (re-encoding/trimming/fitting) requires FFmpeg.wasm or a similar library.
      console.log(`Video fitting requested for ${mediaUrl}.`);
      console.log(`Selected Video Fit: ${VIDEO_FIT_OPTIONS.find(o => o.value === videoFitOption)?.name}`);
      console.warn("Actual video file processing (fitting/re-encoding) is NOT performed by this code. It requires advanced client-side libraries like FFmpeg.wasm or backend processing.");
      
      // Pass original file and url, as no actual fitting is performed here.
      // In a real app, 'editedFile' and 'editedPreviewUrl' would be the result of FFmpeg.wasm.
      // For now, we pass the original file and URL, but include the conceptual fit data.
      onMediaEdit(null, mediaUrl, mediaIndex, { videoFitOption }); 
      onClose();
    } else if (mediaType === 'gif') {
      console.log("GIF editing is not supported in this version.");
      onClose(); // Just close the modal for GIFs
    }
  }, [mediaUrl, mediaType, croppedAreaPixels, onMediaEdit, onClose, mediaIndex, videoFitOption, rotation]);


  if (!isOpen) return null;

  // Determine the class for video based on selected fit option
  const videoClass = mediaType === 'video' 
    ? VIDEO_FIT_OPTIONS.find(o => o.value === videoFitOption)?.class || "object-contain" // Default to object-contain if not found
    : "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit {mediaType === 'image' ? 'Image' : mediaType === 'video' ? 'Video' : 'Media'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          {mediaUrl ? (
            <>
              <div className="mb-4">
                <label htmlFor="aspectRatioSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {mediaType === 'image' ? 'Crop Aspect Ratio' : 'Video Fit Option'}
                </label>
                {mediaType === 'image' && (
                  <select
                    id="aspectRatioSelect"
                    value={selectedAspectRatio === null ? "original" : selectedAspectRatio}
                    onChange={(e) => {
                      const newAspectRatio = e.target.value === "original" ? null : parseFloat(e.target.value);
                      setSelectedAspectRatio(newAspectRatio);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                  >
                    {ASPECT_RATIO_OPTIONS.map((option) => (
                      <option key={option.name} value={option.value === null ? "original" : option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
                {mediaType === 'video' && (
                  <select
                    id="videoFitSelect"
                    value={videoFitOption === null ? "original" : videoFitOption}
                    onChange={(e) => {
                      const newFitOption = e.target.value === "original" ? null : parseFloat(e.target.value);
                      setVideoFitOption(newFitOption);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                  >
                    {VIDEO_FIT_OPTIONS.map((option) => (
                      <option key={option.name} value={option.value === null ? "original" : option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {mediaType === 'image' && (
                <div className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                  <Cropper
                    image={mediaUrl}
                    crop={crop}
                    zoom={zoom} // Fixed zoom
                    rotation={rotation} // Fixed rotation
                    aspect={selectedAspectRatio} // Dynamic aspect ratio
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    showGrid={true}
                    restrictPosition={false}
                  />
                </div>
              )}
              {mediaType === 'video' && (
                <div className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                  <video 
                    src={mediaUrl} 
                    controls={false} 
                    loop 
                    muted 
                    playsInline 
                    crossOrigin="anonymous" 
                    className={`max-h-full max-w-full rounded-md bg-black border border-gray-600 ${videoClass}`} 
                    style={{ width: '100%', height: '100%' }} // Ensure video fills its container for object-fit to work
                    onError={(e) => console.error("Error loading video for preview:", e)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {mediaType === 'gif' && (
                <div className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex flex-col items-center justify-center">
                  <img src={mediaUrl} alt="GIF Preview" className="max-h-full max-w-full object-contain rounded-md" />
                  <p className="text-gray-700 dark:text-gray-300 mt-4">GIF editing is not supported in this version.</p>
                </div>
              )}
              {mediaType === 'video' && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                  Note: Video fit selection here is for **preview purposes only**. Actual video file processing (re-encoding/trimming) is not performed client-side.
                </p>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No media selected for editing.</p>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button onClick={handleApplyEdit} disabled={!mediaUrl || (mediaType === 'image' && !croppedAreaPixels)} className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md disabled:opacity-50">
              Apply Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const BASE_URL = import.meta.env.VITE_BASE_API_URL;

// Data source id -> platform mapping
const DATA_SOURCE_PLATFORM_MAP = {
  7066: 'facebook',
  7378: 'instagram',
  8984: 'youtube',
  7668: 'linkedin',
  8487: 'twitter',
};

const allPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: '#2563eb', PreviewComponent: FacebookPreview },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: '#db2777', PreviewComponent: InstagramPreview },
  { id: 'twitter', icon: <Twitter className="w-5 h-5" />, color: '#60a5fa', PreviewComponent: TwitterPreview },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: '#1d4ed8', PreviewComponent: LinkedInPreview },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: '#ff0000', PreviewComponent: YouTubePreview }
];

// New: Post types supported by each platform
const PLATFORM_POST_TYPES = {
  instagram: [
    { id: 'post', name: 'Post' },
    { id: 'story', name: 'Story' },
    { id: 'reel', name: 'Reel' },
  ],
  youtube: [
    { id: 'video', name: 'Video' },
    { id: 'short', name: 'Short' },
    { id: 'live', name: 'Live' },
  ],
  facebook: [
    { id: 'post', name: 'Post' },
    { id: 'story', name: 'Story' },
    { id: 'reel', name: 'Reel' }, // Added Reels for Facebook
  ],
  twitter: [
    { id: 'tweet', name: 'Tweet' },
  ],
  linkedin: [
    { id: 'post', name: 'Post' },
    { id: 'article', name: 'Article' },
    { id: 'reel', name: 'Reel' }, // Added Reels for LinkedIn
  ],
};


const initialFormState = {
  selectedBusinessId: '',
  postContent: '',
  youtubeTitle: '',
  selectedPlatforms: {
    facebook: true,
    instagram: true,
    twitter: false,
    linkedin: false,
    youtube: false
  },
  selectedMedia: [], // Changed to array of objects { file, url, type }
  selectedVideoFile: null,
  selectedVideoPreviewUrl: null,
  audioInput: '', // Changed from selectedAudioFile to audioInput (text)
  youtubeThumbnailFile: null, // New state for YouTube thumbnail
  youtubeThumbnailPreviewUrl: null, // New state for YouTube thumbnail
  scheduleDate: '',
  scheduleTime: '',
  postPrivacy: 'public', // New state for post privacy
  locationTag: '', // New state for location tagging
  selectedPostType: null, // New state for post type
};

// Generic Loading Modal Component
const UploadProcessingModal = ({ isOpen, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center">
        <Loader2 className="w-10 h-10 animate-spin text-theme-primary mb-4" />
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a moment...</p>
      </div>
    </div>
  );
};


const PostCreation = () => {
  // Business/Product selection
  const [businessList, setBusinessList] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(initialFormState.selectedBusinessId);
  const [dataSources, setDataSources] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);

  // Post form state
  const [postContent, setPostContent] = useState(initialFormState.postContent);
  const [youtubeTitle, setYoutubeTitle] = useState(initialFormState.youtubeTitle);
  const [selectedPlatforms, setSelectedPlatforms] = useState({ ...initialFormState.selectedPlatforms });
  const [selectedMedia, setSelectedMedia] = useState(initialFormState.selectedMedia); // Changed to array of objects
  const [selectedVideoFile, setSelectedVideoFile] = useState(initialFormState.selectedVideoFile);
  const [selectedVideoPreviewUrl, setSelectedVideoPreviewUrl] = useState(initialFormState.selectedVideoPreviewUrl);
  const [audioInput, setAudioInput] = useState(initialFormState.audioInput); // Changed to text input
  const [youtubeThumbnailFile, setYoutubeThumbnailFile] = useState(initialFormState.youtubeThumbnailFile); // New YouTube thumbnail state
  const [youtubeThumbnailPreviewUrl, setYoutubeThumbnailPreviewUrl] = useState(initialFormState.youtubeThumbnailPreviewUrl); // New YouTube thumbnail state
  const [scheduleDate, setScheduleDate] = useState(initialFormState.scheduleDate);
  const [scheduleTime, setScheduleTime] = useState(initialFormState.scheduleTime);
  const [postPrivacy, setPostPrivacy] = useState(initialFormState.postPrivacy); // New privacy state
  const [locationTag, setLocationTag] = useState(initialFormState.locationTag); // New location state
  const [selectedPostType, setSelectedPostType] = useState(initialFormState.selectedPostType); // New post type state


  // Modals and UI
  const [showMediaUploadModal, setShowMediaUploadModal] = useState(false);
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPostPreviewModal, setShowPostPreviewModal] = useState(false);
  const [showDiscardConfirmModal, setShowDiscardConfirmModal] = useState(false);
  const [showSaveDraftConfirmModal, setShowSaveDraftConfirmModal] = useState(false);
  const [showMediaEditModal, setShowMediaEditModal] = useState(false); // Renamed from showImageEditModal
  const [mediaToEdit, setMediaToEdit] = useState(null); // New state to hold media item being edited { url, type, index, file }
  const [showUploadProcessingModal, setShowUploadProcessingModal] = useState(false); // New state for upload processing modal
  const [showYoutubeThumbnailUploadModal, setShowYoutubeThumbnailUploadModal] = useState(false); // New state for YouTube thumbnail upload
  const [showRemoveMediaConfirmModal, setShowRemoveMediaConfirmModal] = useState(false); // New state for media removal confirmation
  const [mediaIndexToRemove, setMediaIndexToRemove] = useState(null); // Index of media to remove


  // Misc state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState(''); // Initialize linkTitle
  const [showPlatformWarning, setShowPlatformWarning] = useState(false);
  const [platformWarningMessage, setPlatformWarningMessage] = useState('');
  const [activePreviewPlatform, setActivePreviewPlatform] = useState('facebook');
  const [isLoadingPublish, setIsLoadingPublish] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0); // State for preview slider

  const [isFormDirty, setIsFormDirty] = useState(false);

  const { isDarkMode, themeColors } = useTheme();
  // const { addNotification } = useNotification();
  // const { blockNavigation, unblockNavigation } = useNavigationBlocker();


  // Notification (toast)
  // const { addNotification } = useNotification();

  // Emojis
  const emojis = ['😀', '😂', '😍', '😊', '😎', '🙌', '', '🙏', '🔥', '❤️', '💯', '✨', '�', '💪', '🤔', '👏', '🥳', '😇', '🤩', '😋', '😁', '', '😆', '😅', '🤣', '😭', '😘', '🤗', '😉'];
  const emojiPickerRef = useRef(null);

  // Ref for the hidden file input (for "Test Multi-Image Upload" button)
  const fileInputRef = useRef(null);

  // API: Fetch business/products (on mount)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    axios.get(`${BASE_URL}/ext-product/list`)
      .then(res => {
        setBusinessList(res.data);
        if (res.data.length > 0 && !selectedBusinessId) {
          setSelectedBusinessId(res.data[0].id);
        }
      })
      .catch(() => setBusinessList([]));
  }, []);

  // API: Fetch data sources for selected business/product
  useEffect(() => {
    if (selectedBusinessId) {
      axios.get(`${BASE_URL}/ext-product/list_datasource/${selectedBusinessId}`)
        .then(res => {
          setDataSources(res.data);
          const allowed = res.data.map(ds => DATA_SOURCE_PLATFORM_MAP[ds.data_source_id]).filter(Boolean);
          setAvailablePlatforms(allPlatforms.filter(p => allowed.includes(p.id)));
          // When business changes, clear platform selection and match only available
          const sel = {};
          allowed.forEach(p => sel[p] = false);
          setSelectedPlatforms(sel);
        })
        .catch(() => {
          setAvailablePlatforms([]);
          setSelectedPlatforms({});
          setDataSources([]);
        });
    } else {
      setAvailablePlatforms([]);
      setSelectedPlatforms({});
      setDataSources([]);
    }
  }, [selectedBusinessId]);

  // Platform selection logic
  const isOnlyYouTubeSelected = selectedPlatforms.youtube && !selectedPlatforms.facebook && !selectedPlatforms.instagram && !selectedPlatforms.twitter && !selectedPlatforms.linkedin;
  const isAnyNonYouTubeSelected = selectedPlatforms.facebook || selectedPlatforms.instagram || selectedPlatforms.twitter || selectedPlatforms.linkedin;

  useEffect(() => {
    // Clear general media when only YouTube is selected
    if (isOnlyYouTubeSelected) {
      selectedMedia.forEach(mediaItem => URL.revokeObjectURL(mediaItem.url)); // Revoke URLs
      setSelectedMedia([]); // Clear all general media
      setAudioInput('');
    } else {
      // Clear YouTube specific media when YouTube is not exclusively selected
      if (selectedVideoPreviewUrl) URL.revokeObjectURL(selectedVideoPreviewUrl);
      setSelectedVideoFile(null);
      setSelectedVideoPreviewUrl(null);
      setYoutubeTitle('');
      if (youtubeThumbnailPreviewUrl) URL.revokeObjectURL(youtubeThumbnailPreviewUrl);
      setYoutubeThumbnailFile(null);
      setYoutubeThumbnailPreviewUrl(null);
    }
  }, [isOnlyYouTubeSelected, selectedPlatforms]);

  // New: Set default post type based on active preview platform
  useEffect(() => {
    if (activePreviewPlatform && PLATFORM_POST_TYPES[activePreviewPlatform]) {
      // Set to first available post type if current is not valid or null
      if (!selectedPostType || !PLATFORM_POST_TYPES[activePreviewPlatform].some(type => type.id === selectedPostType)) {
        setSelectedPostType(PLATFORM_POST_TYPES[activePreviewPlatform][0]?.id || null);
      }
    } else {
      setSelectedPostType(null); // No platform selected or recognized
    }
  }, [activePreviewPlatform, selectedPlatforms, selectedPostType]); // Added selectedPostType to dependency array

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => {
      let newSelection = { ...prev };
      let warning = '';
      const isCurrentlySelected = prev[platformId];
      const currentlyOnlyYouTube = prev.youtube && !prev.facebook && !prev.instagram && !prev.twitter && !prev.linkedin;
      if (platformId === 'youtube') {
        if (!isCurrentlySelected) {
          newSelection = { youtube: true, facebook: false, instagram: false, twitter: false, linkedin: false };
          selectedMedia.forEach(mediaItem => URL.revokeObjectURL(mediaItem.url)); // Revoke URLs
          setSelectedMedia([]); // Clear all general media
          setAudioInput(''); // Clear audio input
          warning = 'YouTube selected. Other platforms deselected. Only video uploads are supported for YouTube, and custom thumbnail can be set.';
        } else {
          newSelection.youtube = false; setYoutubeTitle('');
          const anyOtherSelected = Object.keys(newSelection).some(key => key !== 'youtube' && newSelection[key]);
          if (!anyOtherSelected && availablePlatforms.length > 0) { newSelection[availablePlatforms[0].id] = true; }
          if (selectedVideoPreviewUrl) URL.revokeObjectURL(selectedVideoPreviewUrl);
          setSelectedVideoFile(null); setSelectedVideoPreviewUrl(null); // Clear YouTube video
          if (youtubeThumbnailPreviewUrl) URL.revokeObjectURL(youtubeThumbnailPreviewUrl);
          setYoutubeThumbnailFile(null); setYoutubeThumbnailPreviewUrl(null); // Clear YouTube thumbnail
        }
      } else {
        newSelection[platformId] = !isCurrentlySelected;
        if (newSelection[platformId] && currentlyOnlyYouTube) {
          newSelection.youtube = false; 
          if (selectedVideoPreviewUrl) URL.revokeObjectURL(selectedVideoPreviewUrl);
          setSelectedVideoFile(null); setSelectedVideoPreviewUrl(null); setYoutubeTitle(''); // Clear YouTube video/title
          if (youtubeThumbnailPreviewUrl) URL.revokeObjectURL(youtubeThumbnailPreviewUrl);
          setYoutubeThumbnailFile(null); setYoutubeThumbnailPreviewUrl(null); // Clear YouTube thumbnail
          warning = `${availablePlatforms.find(p => p.id === platformId)?.name || platformId} selected. YouTube deselected.`;
        } else if (!newSelection[platformId] && prev.youtube) {
          const otherSelectedCount = Object.values(newSelection).filter(v => v).length - (newSelection.youtube ? 1 : 0);
          if (newSelection.youtube && otherSelectedCount === 0) {
            selectedMedia.forEach(mediaItem => URL.revokeObjectURL(mediaItem.url)); // Revoke URLs
            setSelectedMedia([]); // Clear general media
            setAudioInput(''); // Clear audio input
            warning = `Only YouTube selected. General media cleared.`;
          }
        }
      }
      const isAnyPlatformSelected = Object.values(newSelection).some(isSelected => isSelected);
      if (!isAnyPlatformSelected && availablePlatforms.length > 0) {
        newSelection[availablePlatforms[0].id] = true;
        // Ensure media is cleared if default platform is non-YouTube after all were deselected
        if (selectedVideoPreviewUrl) URL.revokeObjectURL(selectedVideoPreviewUrl);
        setSelectedVideoFile(null); setSelectedVideoPreviewUrl(null); setYoutubeTitle('');
        if (youtubeThumbnailPreviewUrl) URL.revokeObjectURL(youtubeThumbnailPreviewUrl);
        setYoutubeThumbnailFile(null); setYoutubeThumbnailPreviewUrl(null);
        warning = 'At least one platform must be selected. Defaulting.';
      }
      if (warning) { setPlatformWarningMessage(warning); setShowPlatformWarning(true); }
      return newSelection;
    });
  };

  useEffect(() => {
    if (!isOnlyYouTubeSelected && youtubeTitle) setYoutubeTitle('');
  }, [selectedPlatforms, isOnlyYouTubeSelected, youtubeTitle]);

  // Modal auto-close warnings
  useEffect(() => {
    let timer;
    if (showPlatformWarning) {
      timer = setTimeout(() => setShowPlatformWarning(false), 7000);
    }
    return () => clearTimeout(timer);
  }, [showPlatformWarning]);

  // Emoji Picker auto-close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preview platform switching
  useEffect(() => {
    const firstSelectedPlatform = availablePlatforms.find(p => selectedPlatforms[p.id]);
    if (firstSelectedPlatform) {
      if (!activePreviewPlatform || !selectedPlatforms[activePreviewPlatform]) {
        setActivePreviewPlatform(firstSelectedPlatform.id);
      }
    } else {
      if (availablePlatforms.length > 0) {
        const defaultPlatformId = availablePlatforms[0].id;
        setSelectedPlatforms(prev => ({ ...prev, [defaultPlatformId]: true }));
      } else {
        setActivePreviewPlatform(null);
      }
    }
  }, [selectedPlatforms, availablePlatforms, activePreviewPlatform]);

  // Reset preview index when media changes
  useEffect(() => {
    setPreviewImageIndex(0);
  }, [selectedMedia.length]); // Changed dependency to selectedMedia.length

  // Cleanup for youtubeThumbnailPreviewUrl
  useEffect(() => {
    return () => {
      if (youtubeThumbnailPreviewUrl) {
        URL.revokeObjectURL(youtubeThumbnailPreviewUrl);
      }
    };
  }, [youtubeThumbnailPreviewUrl]);


  // Handlers
  const handleAddEmoji = (emoji) => setPostContent(prev => prev + emoji);
  const handleAddLink = () => {
    if (linkUrl) {
      const linkText = linkTitle ? `[${linkTitle}](${linkUrl})` : linkUrl;
      setPostContent(prev => (prev ? prev + ' ' : '') + linkText + ' ');
      setLinkUrl(''); setLinkTitle(''); setShowLinkModal(false);
    }
  };

  /**
   * Handles the upload of multiple media files (images, videos, gifs) from MediaUploadModal
   * or the direct file input. Appends new files to the existing arrays.
   * @param {File[]} files - An array of File objects.
   * @param {string[]} previewUrls - An array of object URLs for previewing the files.
   */
  const handleMediaUpload = (files, previewUrls) => {
    setShowUploadProcessingModal(true);
    console.log("handleMediaUpload: Received files:", files);
    console.log("handleMediaUpload: Received previewUrls:", previewUrls);

    if (!Array.isArray(files) || !Array.isArray(previewUrls) || files.length !== previewUrls.length) {
      console.error("handleMediaUpload: Invalid input. Files and previewUrls must be arrays of the same length.");
      setShowUploadProcessingModal(false);
      return;
    }

    setTimeout(() => {
      try {
        const newMediaItems = files.map((file, index) => {
          let type = 'other';
          if (file.type.startsWith('video/')) {
            type = 'video';
          } else if (file.type.startsWith('image/gif')) {
            type = 'gif';
          } else if (file.type.startsWith('image/')) {
            type = 'image';
          }
          return { file, url: previewUrls[index], type };
        });
        setSelectedMedia(prevMedia => [...prevMedia, ...newMediaItems]);
        console.log("handleMediaUpload: Successfully updated selectedMedia. New count:", [...selectedMedia, ...newMediaItems].length);
      } catch (error) {
        console.error("handleMediaUpload: Error processing media items:", error);
      } finally {
        setShowUploadProcessingModal(false); // This should hide the modal regardless of success or failure
      }
    }, 500); // Small delay for UX
  };

  // Handler for the direct hidden file input (used by "Test Multi-Image Upload" button)
  const handleDirectMultiFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    handleMediaUpload(files, previewUrls);
  };

  const handleYouTubeVideoUpload = (videoFile, videoPreviewUrl) => {
    setShowUploadProcessingModal(true); // Show loader
    if (selectedVideoPreviewUrl) URL.revokeObjectURL(selectedVideoPreviewUrl); // Revoke old URL
    setSelectedVideoFile(videoFile);
    setSelectedVideoPreviewUrl(videoPreviewUrl);
    setShowVideoUploadModal(false);
    setShowUploadProcessingModal(false); // Hide loader
  };

  const handleYouTubeThumbnailUpload = (file, previewUrl) => {
    setShowUploadProcessingModal(true); // Show loader
    // Log to verify file and previewUrl are received
    console.log("handleYouTubeThumbnailUpload received file:", file);
    console.log("handleYouTubeThumbnailUpload received previewUrl:", previewUrl);

    if (youtubeThumbnailPreviewUrl) URL.revokeObjectURL(youtubeThumbnailPreviewUrl); // Revoke old URL
    // Ensure file and previewUrl are treated as single items for thumbnail
    setYoutubeThumbnailFile(file);
    setYoutubeThumbnailPreviewUrl(previewUrl);
    setShowYoutubeThumbnailUploadModal(false); // Close the specific thumbnail upload modal
    setShowUploadProcessingModal(false); // Hide loader
  };

  /**
   * Handles the editing (cropping for images, conceptual fitting for videos) of a specific media item.
   * @param {File | null} editedFile - The File object of the edited media, or null if no file change (e.g., video conceptual crop).
   * @param {string} editedPreviewUrl - The object URL of the edited media for preview.
   * @param {number} index - The index of the media item in the arrays.
   * @param {object} [extraData] - Optional extra data like crop parameters for video.
   */
  const handleMediaEdit = (editedFile, editedPreviewUrl, index, extraData = {}) => {
    setShowUploadProcessingModal(true); // Show loader

    setSelectedMedia(prevMedia => {
      const newMedia = [...prevMedia];
      // Create a new object for the updated media item to ensure React detects state change
      const updatedMediaItem = { ...newMedia[index] };

      // Revoke the old URL if it's different from the new one
      if (updatedMediaItem.url && updatedMediaItem.url !== editedPreviewUrl) {
        URL.revokeObjectURL(updatedMediaItem.url);
      }

      if (editedFile) { // Only update file if a new one is provided (e.g., for image crop)
        updatedMediaItem.file = editedFile;
      }
      updatedMediaItem.url = editedPreviewUrl;
      // If extraData needs to be stored with the media item (e.g., video fit option),
      // add it to updatedMediaItem
      if (extraData) {
        updatedMediaItem.editData = extraData; // Store conceptual edit data (e.g., videoFitOption)
      }
      newMedia[index] = updatedMediaItem;
      return newMedia;
    });

    setShowMediaEditModal(false);
    setMediaToEdit(null); // Clear the media item being edited
    setShowUploadProcessingModal(false); // Hide loader
  };

  const handleRemoveMedia = (indexToRemove) => {
    setSelectedMedia(prev => {
      const newMedia = prev.filter((item, index) => {
        if (index === indexToRemove) {
          URL.revokeObjectURL(item.url); // Revoke object URL for the removed item
          return false;
        }
        return true;
      });
      return newMedia;
    });
    setMediaIndexToRemove(null); // Clear the index
    setShowRemoveMediaConfirmModal(false); // Close the confirmation modal
  };

  const resetPostState = () => {
    setPostContent(initialFormState.postContent);
    setYoutubeTitle(initialFormState.youtubeTitle);
    setSelectedPlatforms(initialFormState.selectedPlatforms);
    // Revoke object URLs to prevent memory leaks when resetting media
    selectedMedia.forEach(mediaItem => URL.revokeObjectURL(mediaItem.url));
    setSelectedMedia(initialFormState.selectedMedia); // Reset to empty array
    if (selectedVideoPreviewUrl) URL.revokeObjectURL(selectedVideoPreviewUrl);
    setSelectedVideoFile(initialFormState.selectedVideoFile);
    setSelectedVideoPreviewUrl(initialFormState.selectedVideoPreviewUrl);
    if (youtubeThumbnailPreviewUrl) URL.revokeObjectURL(youtubeThumbnailPreviewUrl);
    setAudioInput(initialFormState.audioInput);
    setYoutubeThumbnailFile(initialFormState.youtubeThumbnailFile);
    setYoutubeThumbnailPreviewUrl(initialFormState.youtubeThumbnailPreviewUrl);
    setScheduleDate(initialFormState.scheduleDate);
    setScheduleTime(initialFormState.scheduleTime);
    setPostPrivacy(initialFormState.postPrivacy);
    setLocationTag(initialFormState.locationTag);
    setSelectedPostType(initialFormState.selectedPostType); // Reset post type
    setShowPlatformWarning(false);
    setShowScheduleModal(false);
    setShowPostPreviewModal(false);
    setShowUploadProcessingModal(false);
    setShowYoutubeThumbnailUploadModal(false); // Reset thumbnail upload modal state
    setMediaToEdit(null); // Reset media to edit
    setShowMediaEditModal(false); // Close edit modal
    setShowRemoveMediaConfirmModal(false); // Close remove media confirm modal
    setMediaIndexToRemove(null); // Reset index to remove
    // keep selectedBusinessId as is (user can create multiple for that business)
  };

  const getDataSourceInfoByPlatform = (platformId) => {
    const mstr_id = Object.keys(DATA_SOURCE_PLATFORM_MAP).find(
      (k) => DATA_SOURCE_PLATFORM_MAP[k] === platformId
    );
    const obj = dataSources.find(ds => String(ds.data_source_id) === String(mstr_id));
    if (obj) {
      return {
        mstr_id: Number(mstr_id),
        ext_product_data_source_id: obj.id
      };
    }
    return null;
  };

  const getISOStringWithoutMilliseconds = (date) => new Date(date.getTime() - date.getMilliseconds()).toISOString().split('.')[0] + 'Z';

  // --- API POST: create post (for draft/schedule/publish) ---
  const makePostsArray = (status, scheduledTime) => {
    const postTitle = isOnlyYouTubeSelected ? youtubeTitle : postContent.split('\n')[0] || 'Untitled Post';
    const description = postContent;

    // Media for non-YouTube platforms
    // Extract URLs from the structured selectedMedia array
    const mediaUrls = selectedMedia.map(item => item.url);

    // YouTube specific media
    const youtubeVideoUrl = selectedVideoPreviewUrl;
    const youtubeThumbnailUrl = youtubeThumbnailPreviewUrl;

    // Audio (text input)
    const audioUrl = audioInput;


    return Object.entries(selectedPlatforms)
      .filter(([platform, selected]) => selected)
      .map(([platform]) => {
        const dsInfo = getDataSourceInfoByPlatform(platform);
        if (!dsInfo) return null;

        const postData = {
          mstr_id: dsInfo.mstr_id,
          post_title: postTitle,
          description,
          scheduled_time: scheduledTime,
          status: status,
          repeat_interval: 'none',
          ext_product_data_source_id: dsInfo.ext_product_data_source_id,
          post_privacy: postPrivacy, // Include privacy
          location_tag: locationTag, // Include location
          post_type: selectedPostType, // Include post type
        };

        if (platform === 'youtube') {
          postData.media_url = youtubeVideoUrl; // YouTube uses video_url
          if (youtubeThumbnailUrl) {
            postData.youtube_thumbnail_url = youtubeThumbnailUrl; // YouTube custom thumbnail
          }
        } else {
          if (mediaUrls.length > 1) {
            postData.media_urls = mediaUrls; // Use media_urls for multiple images/videos/gifs
          } else if (mediaUrls.length === 1) {
            postData.media_url = mediaUrls[0]; // Use media_url for a single image/video/gif
          }
          if (audioUrl) {
            postData.audio_url = audioUrl; // Include audio URL from text input
          }
        }

        return postData;
      })
      .filter(Boolean);
  };

  const handleSaveDraft = async () => {
    setIsLoadingDraft(true);
    try {
      const posts = makePostsArray('draft', getISOStringWithoutMilliseconds(new Date()));
      if (posts.length === 0) {
        // addNotification({ type: 'error', title: 'No Platform', message: 'Please select at least one platform!' });
        setIsLoadingDraft(false);
        return;
      }
      const response = await axios.post(`${BASE_URL}/post_system/addposts`, posts, { headers: { 'Content-Type': 'application/json' } });
      if (response.status === 207 || response.status === 200) {
        // addNotification({ type: 'info', title: 'Draft Saved!', message: 'Your post has been successfully saved as a draft.' });
        resetPostState();
        setShowSaveDraftConfirmModal(false);
      } else {
        // addNotification({ type: 'error', title: 'Save Draft Failed', message: JSON.stringify(response.data) });
      }
    } catch (error) {
      // addNotification({ type: 'error', title: 'API Error', message: error.message });
    }
    setIsLoadingDraft(false);
  };

  const handleSchedulePost = async () => {
    if (!scheduleDate || !scheduleTime) {
      // addNotification({ type: 'error', title: 'Scheduling Error', message: 'Please select both date and time for scheduling.' });
      return;
    }
    setIsLoadingSchedule(true);
    try {
      const isoString = `${scheduleDate}T${scheduleTime}:00Z`;
      const posts = makePostsArray('scheduled', isoString);
      if (posts.length === 0) {
        // addNotification({ type: 'error', title: 'No Platform', message: 'Please select at least one platform!' });
        setIsLoadingSchedule(false);
        return;
      }
      const response = await axios.post(`${BASE_URL}/post_system/addposts`, posts, { headers: { 'Content-Type': 'application/json' } });
      if (response.status === 207 || response.status === 200) {
        // addNotification({ type: 'success', title: 'Post Scheduled!', message: `Your post is scheduled for ${scheduleDate} at ${scheduleTime}.` });
        resetPostState();
        setShowScheduleModal(false);
      } else {
        // addNotification({ type: 'error', title: 'Schedule Failed', message: JSON.stringify(response.data) });
      }
    } catch (error) {
      // addNotification({ type: 'error', title: 'API Error', message: error.message });
    }
    setIsLoadingSchedule(false);
  };

  const handlePublishNow = async () => {
    setIsLoadingPublish(true);
    try {
      const posts = makePostsArray('posted', getISOStringWithoutMilliseconds(new Date()));
      if (posts.length === 0) {
        // addNotification({ type: 'error', title: 'No Platform', message: 'Please select at least one platform!' });
        setIsLoadingPublish(false);
        return;
      }
      const response = await axios.post(`${BASE_URL}/post_system/addposts`, posts, { headers: { 'Content-Type': 'application/json' } });
      if (response.status === 207 || response.status === 200) {
        // addNotification({ type: 'success', title: 'Post Published!', message: 'Your post has been published successfully.' });
        resetPostState();
        setShowPostPreviewModal(false);
      } else {
        // addNotification({ type: 'error', title: 'Publish Failed', message: JSON.stringify(response.data) });
      }
    } catch (error) {
      // addNotification({ type: 'error', title: 'API Error', message: error.message });
    }
    setIsLoadingPublish(false);
  };

  // Handlers for preview slider
  const handleNextPreviewImage = () => {
    setPreviewImageIndex(prevIndex => (prevIndex + 1) % selectedMedia.length);
  };

  const handlePrevPreviewImage = () => {
    setPreviewImageIndex(prevIndex => (prevIndex - 1 + selectedMedia.length) % selectedMedia.length);
  };

  // Preview
  const platforms = availablePlatforms.length > 0 ? availablePlatforms : allPlatforms;
  const getSelectedPlatformsList = () => platforms.filter(platform => selectedPlatforms[platform.id]).map(platform => platform.name).join(', ');
  const ActivePreviewComponent = platforms.find(p => p.id === activePreviewPlatform)?.PreviewComponent;
  const mockUserName = "Your Page Name";
  const mockProfilePicUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(mockUserName.substring(0, 2))}&background=random&color=fff&size=40`;

  // Determine post types to show based on activePreviewPlatform
  const postTypesToShow = activePreviewPlatform && PLATFORM_POST_TYPES[activePreviewPlatform]
    ? PLATFORM_POST_TYPES[activePreviewPlatform]
    : [];

  // Log the values being passed to ActivePreviewComponent for YouTube
  useEffect(() => {
    if (activePreviewPlatform === 'youtube') {
      console.log('--- YouTube Preview Props ---');
      console.log('youtubeThumbnailPreviewUrl:', youtubeThumbnailPreviewUrl);
      console.log('selectedVideoPreviewUrl:', selectedVideoPreviewUrl);
      console.log('mediaUrl (passed to preview):', isOnlyYouTubeSelected
        ? youtubeThumbnailPreviewUrl || selectedVideoPreviewUrl
        : (selectedMedia.length > 0 ? selectedMedia[previewImageIndex].url : null));
      console.log('mediaType (passed to preview):', isOnlyYouTubeSelected
        ? (youtubeThumbnailPreviewUrl ? 'image' : 'video')
        : (selectedMedia.length > 0 ? selectedMedia[previewImageIndex].type : null));
      console.log('-----------------------------');
    }
  }, [activePreviewPlatform, youtubeThumbnailPreviewUrl, selectedVideoPreviewUrl, isOnlyYouTubeSelected, selectedMedia, previewImageIndex]);


  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold mb-3 sm:mb-0">Create</h1>
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          <button onClick={() => setShowDiscardConfirmModal(true)} className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500 dark:text-red-400"><Trash2 className="w-4 h-4" /><span>Discard</span></button>
          <button onClick={() => setShowSaveDraftConfirmModal(true)} disabled={isLoadingDraft} className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-70">
            {isLoadingDraft ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Saving...</> : <><Save className="w-4 h-4" /><span>Save Draft</span></>}
          </button>
          <button onClick={() => setShowScheduleModal(true)} disabled={isLoadingSchedule} className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-theme-secondary hover:bg-opacity-90 text-white rounded-md disabled:opacity-70">
            {isLoadingSchedule ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Scheduling...</> : <><Calendar className="w-4 h-4" /><span>Schedule</span></>}
          </button>
          <button onClick={() => setShowPostPreviewModal(true)} disabled={isLoadingPublish || (isOnlyYouTubeSelected && !youtubeTitle.trim())} className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-theme-primary hover:bg-opacity-90 text-white rounded-md disabled:opacity-70">
            {isLoadingPublish ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Publishing...</> : <><Send className="w-4 h-4" /><span>Publish Now</span></>}
          </button>
        </div>
      </div>
      {showPlatformWarning && (
        <div className="my-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600 rounded-md flex justify-between items-center shadow">
          <div className="flex items-center"><AlertTriangle className="w-5 h-5 mr-2" /><p className="text-sm">{platformWarningMessage}</p></div>
          <button onClick={() => setShowPlatformWarning(false)} className="ml-2 text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-500"><X size={18} /></button>
        </div>
      )}

      {/* Business and Platform Selection Row */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto sm:flex-shrink-0">
          <label htmlFor="businessSelect" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
            Select Business
          </label>
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              id="businessSelect"
              value={selectedBusinessId}
              onChange={e => setSelectedBusinessId(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm"
            >
              <option value="">-- Select Business --</option>
              {businessList.map(biz => (
                <option key={biz.id} value={biz.id}>{biz.product_name || biz.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 text-left sm:text-right">
            Select Platforms
          </label>
          <div className="flex flex-wrap justify-start sm:justify-end gap-2">
            {platforms.map((platform) => (
              <Tooltip key={platform.id} text={platform.name} position="top">
                <button
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 flex items-center justify-center
                                ${selectedPlatforms[platform.id] ? 'shadow-inner scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'}
                                `}
                  style={{ borderColor: selectedPlatforms[platform.id] ? platform.color : '#e0e0e0' }}
                >
                  <div style={{ color: platform.color }}>{React.cloneElement(platform.icon, { size: 20 })}</div>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Post Privacy Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Post Privacy</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-theme-primary"
                  name="postPrivacy"
                  value="public"
                  checked={postPrivacy === 'public'}
                  onChange={() => setPostPrivacy('public')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Public</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-theme-primary"
                  name="postPrivacy"
                  value="private"
                  checked={postPrivacy === 'private'}
                  onChange={() => setPostPrivacy('private')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Private</span>
              </label>
            </div>
          </div>

          {/* Location Tagging */}
          <div className="mb-4">
            <label htmlFor="locationTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location (Optional)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="locationTag"
                value={locationTag}
                onChange={(e) => setLocationTag(e.target.value)}
                placeholder="Add a location tag"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
              />
            </div>
          </div>

          {/* New: Post Type Selection */}
          {postTypesToShow.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Post Type (for {activePreviewPlatform ? platforms.find(p => p.id === activePreviewPlatform)?.name : 'selected platform'})
              </label>
              <div className="flex flex-wrap gap-4">
                {postTypesToShow.map((type) => (
                  <label key={type.id} className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-theme-primary"
                      name="postType"
                      value={type.id}
                      checked={selectedPostType === type.id}
                      onChange={() => setSelectedPostType(type.id)}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* End New: Post Type Selection */}

          {isOnlyYouTubeSelected && (
            <div className="mb-4">
              <label htmlFor="youtubeTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (for YouTube) <span className="text-red-500">*</span></label>
              <div className="relative"><TypeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="text" id="youtubeTitle" value={youtubeTitle} onChange={(e) => setYoutubeTitle(e.target.value)} placeholder="Enter YouTube video title" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700" required={isOnlyYouTubeSelected} /></div>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{isOnlyYouTubeSelected ? 'Description (for YouTube)' : 'Post Content'}</label>
            <textarea id="postContent" className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary min-h-[150px] dark:bg-gray-700" placeholder={isOnlyYouTubeSelected ? "Describe your video..." : "What would you like to share today? Use #hashtags for categorization."} value={postContent} onChange={(e) => setPostContent(e.target.value)}></textarea>
          </div>

          {/* Display multiple media previews with horizontal scrolling for non-YouTube platforms */}
          {selectedMedia.length > 0 && isAnyNonYouTubeSelected && (
            <div className="mb-4 relative w-full overflow-x-auto custom-scrollbar">
              <div className="flex gap-2 pb-2"> {/* Added flex and gap for horizontal layout */}
                {selectedMedia.map((mediaItem, index) => {
                  return (
                    <div key={index} className="relative flex-shrink-0 w-48 h-48 group"> {/* Fixed size for each media item in scrollable view */}
                      {mediaItem.type === 'image' && <img src={mediaItem.url} alt={`Uploaded media preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/192x192/cccccc/000000?text=Image+Error"; console.error(`Failed to load image at index ${index}: ${mediaItem.url}`); }} />}
                      {mediaItem.type === 'video' && <video controls src={mediaItem.url} className="w-full h-full object-cover rounded-lg bg-black" onError={(e) => console.error(`Failed to load video at index ${index}: ${mediaItem.url}`)}>Your browser does not support video.</video>}
                      {mediaItem.type === 'gif' && <img src={mediaItem.url} alt={`Uploaded GIF preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/192x192/cccccc/000000?text=GIF+Error"; console.error(`Failed to load GIF at index ${index}: ${mediaItem.url}`); }} />}

                      {/* Delete button */}
                      <button onClick={() => {
                        setMediaIndexToRemove(index);
                        setShowRemoveMediaConfirmModal(true);
                      }} className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"><X className="w-4 h-4" /></button>

                      {/* Edit button for individual media item (image or video) */}
                      {(mediaItem.type === 'image' || mediaItem.type === 'video') && (
                        <button
                          onClick={() => {
                            setMediaToEdit({ url: mediaItem.url, type: mediaItem.type, index: index, file: mediaItem.file });
                            setShowMediaEditModal(true);
                          }}
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        >
                          <Crop className="w-3 h-3" /> Edit
                        </button>
                      )}
                      {mediaItem.file && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{mediaItem.file.name}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedVideoPreviewUrl && isOnlyYouTubeSelected && (
            <div className="mb-4 relative">
              <video controls src={selectedVideoPreviewUrl} className="w-full h-48 object-cover rounded-lg bg-black" onError={(e) => console.error(`Failed to load YouTube video: ${selectedVideoPreviewUrl}`)}>Your browser does not support the video tag.</video>
              <button onClick={() => { 
                if (selectedVideoPreviewUrl) URL.revokeObjectURL(selectedVideoPreviewUrl); // Revoke URL
                setSelectedVideoFile(null); setSelectedVideoPreviewUrl(null); 
              }} className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"><X className="w-4 h-4" /></button>
              {selectedVideoFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedVideoFile.name}</p>}
            </div>
          )}

          {/* Audio URL Input Field */}
          {isAnyNonYouTubeSelected && (
            <div className="mb-4">
              <label htmlFor="audioInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audio URL (Optional)</label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="audioInput"
                  value={audioInput}
                  onChange={(e) => setAudioInput(e.target.value)}
                  placeholder="Enter audio URL"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                />
                {audioInput && (
                  <button
                    onClick={() => setAudioInput('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {youtubeThumbnailPreviewUrl && isOnlyYouTubeSelected && (
            <div className="mb-4 relative">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube Custom Thumbnail:</p>
              <img
                src={youtubeThumbnailPreviewUrl}
                alt="YouTube Thumbnail Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1280x720/cccccc/000000?text=Thumbnail+Error"; console.error(`Failed to load YouTube thumbnail: ${youtubeThumbnailPreviewUrl}`); }}
              />
              <button onClick={() => { 
                if (youtubeThumbnailPreviewUrl) URL.revokeObjectURL(youtubeThumbnailPreviewUrl); // Revoke URL
                setYoutubeThumbnailFile(null); setYoutubeThumbnailPreviewUrl(null); 
              }} className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"><X className="w-4 h-4" /></button>
              {youtubeThumbnailFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{youtubeThumbnailFile.name}</p>}
            </div>
          )}


          <div className="flex flex-wrap gap-3">
            {/* The 'Add Media' button is removed as per request */}
            {/* New: Direct multi-file input for testing purposes. This button triggers a hidden input. */}
            {isAnyNonYouTubeSelected && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDirectMultiFileUpload}
                  multiple // Enable multiple file selection for this input
                  accept="image/*, video/*, image/gif"
                  style={{ display: 'none' }} // Hide the input
                />
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-300"
                  onClick={() => fileInputRef.current.click()} // Trigger click on hidden input
                >
                  <FileUp className="w-5 h-5" />
                  <span>Add Media</span>
                </button>
              </>
            )}
            {/* The "Edit Media" button is now removed here, as editing is done per-item in the preview list.
                If there's a need for a general "Edit" button that opens a selection UI, it can be re-added.
            */}
            {isOnlyYouTubeSelected && (<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setShowVideoUploadModal(true)}><VideoIcon className="w-5 h-5 text-gray-500" /><span>Add Video (for YouTube)</span></button>)}
            {isOnlyYouTubeSelected && (<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setShowYoutubeThumbnailUploadModal(true)}><FileUp className="w-5 h-5 text-gray-500" /><span>Add Thumbnail (for YouTube)</span></button>)}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setShowLinkModal(true)}><LinkIconLucide className="w-5 h-5 text-gray-500" /><span>Add Link</span></button>
            <div className="relative" ref={emojiPickerRef}>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Smile className="w-5 h-5 text-gray-500" /><span>Add Emoji</span></button>
              {showEmojiPicker && (<div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 w-64"><div className="grid grid-cols-8 gap-2">{emojis.map((emoji, index) => (<button key={index} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xl" onClick={() => handleAddEmoji(emoji)}>{emoji}</button>))}</div></div>)}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium mb-4">Post Preview</h3>
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Previewing for: <span className="font-semibold">{activePreviewPlatform ? platforms.find(p => p.id === activePreviewPlatform)?.name : 'Select a platform'}</span>
            </p>
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
              {platforms.filter(p => selectedPlatforms[p.id]).map(platform => (
                <Tooltip key={platform.id} text={`Preview for ${platform.name}`} position="top">
                  <button
                    onClick={() => setActivePreviewPlatform(platform.id)}
                    className={`p-1.5 rounded-md border-2 transition-all duration-150 ease-in-out
                                ${activePreviewPlatform === platform.id ? 'shadow-inner scale-105' : 'hover:opacity-80 hover:scale-105'}
                                `}
                    style={{ borderColor: activePreviewPlatform === platform.id ? platform.color : 'transparent' }}
                  >
                    <div style={{ color: platform.color }}>{React.cloneElement(platform.icon, { size: 18 })}</div>
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>
          <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
            {ActivePreviewComponent ? (
              <ActivePreviewComponent
                key={`${activePreviewPlatform}-${previewImageIndex}`}
                userName={mockUserName}
                profilePicUrl={mockProfilePicUrl}
                postContent={postContent}
                // --- FIX START ---
                // Prioritize showing the thumbnail in the preview if it exists.
                mediaUrl={
                  isOnlyYouTubeSelected
                    ? youtubeThumbnailPreviewUrl || selectedVideoPreviewUrl
                    : (selectedMedia.length > 0 ? selectedMedia[previewImageIndex].url : null)
                }
                mediaType={
                  isOnlyYouTubeSelected
                    ? (youtubeThumbnailPreviewUrl ? 'image' : 'video')
                    : (selectedMedia.length > 0 ? selectedMedia[previewImageIndex].type : null)
                }
                // --- FIX END ---
                youtubeTitle={youtubeTitle}
                youtubeThumbnailUrl={youtubeThumbnailPreviewUrl} // Explicitly pass youtubeThumbnailUrl
                selectedMediaItems={!isOnlyYouTubeSelected ? selectedMedia : []} // Pass the full selectedMedia array
                audioUrl={audioInput}
                postType={selectedPostType}
                // Pass videoFitOption to preview components
                videoFitOption={selectedMedia.length > 0 && selectedMedia[previewImageIndex].type === 'video' ? selectedMedia[previewImageIndex].editData?.videoFitOption : null}
              />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic p-4">
                {selectedPlatforms && Object.values(selectedPlatforms).some(v => v) ? 'Loading preview...' : 'Select a platform to see its specific preview.'}
              </p>
            )}
            {isAnyNonYouTubeSelected && selectedMedia.length > 1 && (
              <>
                <button
                    onClick={handlePrevPreviewImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 z-10 hover:bg-opacity-75 transition-opacity"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNextPreviewImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 z-10 hover:bg-opacity-75 transition-opacity"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
                {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {selectedMedia.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === previewImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                        />
                    ))}
                </div> */}
              </>
            )}
          </div>
        </div>
      </div>
      {/* MediaUploadModal for general media: Changed to allow multiple uploads */}
      {/* The `multiple={true}` prop enables multi-file selection in the file input. */}
      <MediaUploadModal isOpen={showMediaUploadModal} onClose={() => setShowMediaUploadModal(false)} onMediaUpload={handleMediaUpload} acceptTypes="image/*, video/*, image/gif" multiple={true} />
      <VideoUploadModal isOpen={showVideoUploadModal} onClose={() => setShowVideoUploadModal(false)} onVideoUpload={handleYouTubeVideoUpload} />

      {/* New MediaEditModal (formerly ImageEditModal) */}
      {mediaToEdit && (
        <MediaEditModal
          isOpen={showMediaEditModal}
          onClose={() => setShowMediaEditModal(false)}
          mediaUrl={mediaToEdit.url}
          mediaType={mediaToEdit.type}
          mediaIndex={mediaToEdit.index}
          onMediaEdit={handleMediaEdit}
        />
      )}
      {/* End New MediaEditModal */}

      {/* YouTube Thumbnail Upload Modal (Image only) */}
      <MediaUploadModal
        isOpen={showYoutubeThumbnailUploadModal}
        onClose={() => setShowYoutubeThumbnailUploadModal(false)}
        onMediaUpload={(files, previewUrls) => handleYouTubeThumbnailUpload(files[0], previewUrls[0])} // Only take the first file for thumbnail
        acceptTypes="image/*" // Only accept images for thumbnail
        isSingleUpload={true} // Ensure only one thumbnail can be uploaded
      />

      <UploadProcessingModal isOpen={showUploadProcessingModal} message="Processing media..." />

      {showLinkModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"><div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h3 className="text-lg font-medium">Add Link</h3><button onClick={() => setShowLinkModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X className="w-5 h-5" /></button></div><div className="p-5"><div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL</label><input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700" /></div><div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link Title (Optional)</label><input type="text" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Enter a title for your link" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700" /></div><div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowLinkModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button><button onClick={handleAddLink} disabled={!linkUrl} className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md disabled:opacity-50">Add Link</button></div></div></div></div>)}
      {showScheduleModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"><div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h3 className="text-lg font-medium">Schedule Your Post</h3><button onClick={() => setShowScheduleModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X className="w-5 h-5" /></button></div><div className="p-5"><div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label><input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus://theme-primary dark:bg-gray-700" min={new Date().toISOString().split('T')[0]} /></div><div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Time</label><input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700" /></div><div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platforms</label><div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md"><p className="text-sm">{getSelectedPlatformsList() || 'No platforms selected'}</p></div></div><div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button><button onClick={handleSchedulePost} disabled={isLoadingSchedule || !scheduleDate || !scheduleTime || (isOnlyYouTubeSelected && !youtubeTitle.trim())} className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md flex items-center justify-center">{isLoadingSchedule ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Scheduling...</> : 'Schedule Post'}</button></div></div></div></div>)}
      {showPostPreviewModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg"><div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h3 className="text-lg font-medium">Post Preview</h3><button onClick={() => setShowPostPreviewModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X className="w-5 h-5" /></button></div><div className="p-5"><div className="mb-6"><h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your post will appear like this:</h4><div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900">{isOnlyYouTubeSelected && youtubeTitle && <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{youtubeTitle}</h4>}<p className="text-gray-800 dark:text-gray-200 mb-3 break-words">{postContent}</p>{youtubeThumbnailPreviewUrl && isOnlyYouTubeSelected && (<div className="mb-2"><p className="text-xs text-gray-500 dark:text-gray-400 mb-1">YouTube Thumbnail:</p><img src={youtubeThumbnailPreviewUrl} alt="YouTube Thumbnail" className="w-full max-h-40 object-contain rounded-md bg-gray-100 dark:bg-gray-700" /></div>)}{selectedMedia.length > 0 && isAnyNonYouTubeSelected && (<div className="flex flex-wrap gap-2 mb-2">{selectedMedia.map((mediaItem, index) => {
                  return mediaItem.type === 'image' ? <img key={index} src={mediaItem.url} alt={`Preview ${index + 1}`} className="w-full sm:w-[calc(50%-4px)] max-h-40 object-contain rounded-md mb-2 bg-gray-100 dark:bg-gray-700" /> : mediaItem.type === 'video' ? <video key={index} controls src={mediaItem.url} className="w-full sm:w-[calc(50%-4px)] max-h-40 rounded-md bg-black">Your browser does not support video.</video> : mediaItem.type === 'gif' ? <img key={index} src={mediaItem.url} alt={`GIF Preview ${index + 1}`} className="w-full sm:w-[calc(50%-4px)] max-h-40 object-contain rounded-md mb-2 bg-gray-100 dark:bg-gray-700" /> : null;
                })}</div>)}{selectedVideoPreviewUrl && isOnlyYouTubeSelected && (<video controls src={selectedVideoPreviewUrl} className="w-full max-h-60 rounded-md bg-black">Your browser does not support the video tag.</video>)}{audioInput && isAnyNonYouTubeSelected && (<div className="mb-2"><audio controls src={audioInput} className="w-full rounded-md" /></div>)}</div></div><div className="mb-4"><h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Will be posted to:</h4><div className="flex flex-wrap gap-2">{platforms.map((platform) => (selectedPlatforms[platform.id] && (<div key={platform.id} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>{React.cloneElement(platform.icon, { size: 14 })}<span>{platform.name}</span></div>)))}</div></div><div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowPostPreviewModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button><button onClick={handlePublishNow} disabled={isLoadingPublish || (isOnlyYouTubeSelected && !youtubeTitle.trim())} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center gap-1 disabled:opacity-50">{isLoadingPublish ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Publishing...</> : <><Check className="w-4 h-4" />Publish Now</>}</button></div></div></div></div>)}
      <ConfirmationModal isOpen={showDiscardConfirmModal} onClose={() => setShowDiscardConfirmModal(false)} onConfirm={resetPostState} title="Discard Post" message="Are you sure you want to discard this post? All content and selections will be lost." confirmText="Discard" />
      <ConfirmationModal isOpen={showSaveDraftConfirmModal} onClose={() => setShowSaveDraftConfirmModal(false)} onConfirm={handleSaveDraft} title="Save as Draft" message="Are you sure you want to save this post as a draft?" confirmText={isLoadingDraft ? 'Saving...' : 'Save Draft'} confirmButtonClass="bg-theme-secondary hover:bg-opacity-90 text-white" isDestructive={false} icon={<Save className="h-6 w-6 text-theme-secondary" />} disabled={isLoadingDraft} />
      <ConfirmationModal
        isOpen={showRemoveMediaConfirmModal}
        onClose={() => setShowRemoveMediaConfirmModal(false)}
        onConfirm={() => handleRemoveMedia(mediaIndexToRemove)}
        title="Remove Media"
        message="Are you sure you want to remove this media item? This action cannot be undone."
        confirmText="Remove"
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
        isDestructive={true}
        icon={<Trash2 className="h-6 w-6 text-red-600" />}
      />
    </div>
  );
};

export default PostCreation;
