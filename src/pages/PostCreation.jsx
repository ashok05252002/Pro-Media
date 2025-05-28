import React, { useState, useEffect } from 'react';
import { Link as LinkIconLucide, Smile, Calendar, Clock, Globe, Facebook, Instagram, Twitter, Linkedin, Youtube, Save, Send, X, Check, Trash2, Video as VideoIcon, AlertTriangle, FileUp } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import VideoUploadModal from '../components/VideoUploadModal';
import MediaUploadModal from '../components/MediaUploadModal';

const PostCreation = () => {
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    instagram: true,
    twitter: false,
    linkedin: false,
    youtube: false
  });

  const [showMediaUploadModal, setShowMediaUploadModal] = useState(false);
  const [selectedMediaFile, setSelectedMediaFile] = useState(null);
  const [selectedMediaPreviewUrl, setSelectedMediaPreviewUrl] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState(null);

  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [selectedVideoPreviewUrl, setSelectedVideoPreviewUrl] = useState(null);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPostPreviewModal, setShowPostPreviewModal] = useState(false);
  
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [showDiscardConfirmModal, setShowDiscardConfirmModal] = useState(false);
  const [showSaveDraftConfirmModal, setShowSaveDraftConfirmModal] = useState(false);

  const [showPlatformWarning, setShowPlatformWarning] = useState(false);
  const [platformWarningMessage, setPlatformWarningMessage] = useState('');

  useEffect(() => {
    let timer;
    if (showPlatformWarning) {
      timer = setTimeout(() => {
        setShowPlatformWarning(false);
      }, 7000); 
    }
    return () => clearTimeout(timer);
  }, [showPlatformWarning]);
  
  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: '#2563eb', bgColor: 'rgba(37, 99, 235, 0.1)' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: '#db2777', bgColor: 'rgba(219, 39, 119, 0.1)' },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: '#60a5fa', bgColor: 'rgba(96, 165, 250, 0.1)' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: '#1d4ed8', bgColor: 'rgba(29, 78, 216, 0.1)' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: '#ff0000', bgColor: 'rgba(255, 0, 0, 0.1)' }
  ];
  
  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🙌', '👍', '🎉', '🔥', '❤️', '💯', '✨', '🌟', '💪', '🤔', '👏', 
                  '😊', '🥳', '😇', '🤩', '😋', '🙂', '😄', '😃', '😁', '😆', '😅', '🤣', '😭', '😘', '🤗', '😉'];
  
  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => {
      let newSelection = { ...prev };
      let warning = '';
      const isCurrentlySelected = prev[platformId];

      if (platformId === 'youtube') {
        if (!isCurrentlySelected) {
          newSelection = { youtube: true, facebook: false, instagram: false, twitter: false, linkedin: false };
          setSelectedMediaFile(null);
          setSelectedMediaPreviewUrl(null);
          setSelectedMediaType(null);
          warning = 'YouTube selected. Other platforms deselected. Only video uploads are supported for YouTube.';
        } else {
          newSelection.youtube = false;
           const anyOtherSelected = Object.keys(newSelection).some(key => key !== 'youtube' && newSelection[key]);
          if (!anyOtherSelected) newSelection.facebook = true; // Default back if nothing else selected
        }
      } else {
        newSelection[platformId] = !isCurrentlySelected;
        if (newSelection[platformId] && prev.youtube) {
          newSelection.youtube = false;
          setSelectedVideoFile(null);
          setSelectedVideoPreviewUrl(null);
          warning = `${platforms.find(p => p.id === platformId).name} selected. YouTube deselected. Image, Video, or GIF uploads are supported for this platform.`;
        }
      }

      if (warning) {
        setPlatformWarningMessage(warning);
        setShowPlatformWarning(true);
      } else if (showPlatformWarning && !Object.values(newSelection).some(v => v) && platformId === 'youtube' && isCurrentlySelected) {
        setShowPlatformWarning(false);
      }
      return newSelection;
    });
  };

  const handleAddEmoji = (emoji) => {
    setPostContent(prev => prev + emoji);
  };

  const handleAddLink = () => {
    if (linkUrl) {
      const linkText = linkTitle ? `[${linkTitle}](${linkUrl})` : linkUrl;
      setPostContent(prev => (prev ? prev + ' ' : '') + linkText + ' ');
      setLinkUrl('');
      setLinkTitle('');
      setShowLinkModal(false);
    }
  };

  const handleMediaUpload = (file, previewUrl) => {
    setSelectedMediaFile(file);
    setSelectedMediaPreviewUrl(previewUrl);
    if (file.type.startsWith('image/gif')) setSelectedMediaType('gif');
    else if (file.type.startsWith('image/')) setSelectedMediaType('image');
    else if (file.type.startsWith('video/')) setSelectedMediaType('video');
    else setSelectedMediaType('other');
    setShowMediaUploadModal(false);
  };

  const handleYouTubeVideoUpload = (videoFile, videoPreviewUrl) => {
    setSelectedVideoFile(videoFile);
    setSelectedVideoPreviewUrl(videoPreviewUrl);
    setShowVideoUploadModal(false);
  };

  const resetPostState = () => {
    setPostContent('');
    setSelectedMediaFile(null);
    setSelectedMediaPreviewUrl(null);
    setSelectedMediaType(null);
    setSelectedVideoFile(null);
    setSelectedVideoPreviewUrl(null);
    setSelectedPlatforms({ facebook: true, instagram: true, twitter: false, linkedin: false, youtube: false });
    setScheduleDate('');
    setScheduleTime('');
    setShowPlatformWarning(false);
  };

  const handleDiscard = () => {
    resetPostState();
    setShowDiscardConfirmModal(false);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', { postContent, selectedMediaFile, selectedVideoFile, selectedPlatforms });
    setShowSaveDraftConfirmModal(false);
  };

  const handleSchedule = () => {
    if (scheduleDate && scheduleTime) {
      console.log('Post scheduled for:', scheduleDate, scheduleTime, { postContent, selectedMediaFile, selectedVideoFile, selectedPlatforms });
      setShowScheduleModal(false);
      alert(`Post scheduled for ${scheduleDate} at ${scheduleTime}`);
    } else {
      alert('Please select both date and time for scheduling.');
    }
  };

  const handlePostNow = () => {
    console.log('Post published now:', { postContent, selectedMediaFile, selectedVideoFile, selectedPlatforms });
    setShowPostPreviewModal(false);
    alert('Post published successfully!');
  };

  const getSelectedPlatformsList = () => {
    return platforms
      .filter(platform => selectedPlatforms[platform.id])
      .map(platform => platform.name)
      .join(', ');
  };

  const isOnlyYouTubeSelected = selectedPlatforms.youtube && !selectedPlatforms.facebook && !selectedPlatforms.instagram && !selectedPlatforms.twitter && !selectedPlatforms.linkedin;
  const isAnyNonYouTubeSelected = selectedPlatforms.facebook || selectedPlatforms.instagram || selectedPlatforms.twitter || selectedPlatforms.linkedin;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Create New Post</h1>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowDiscardConfirmModal(true)} 
                className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500 dark:text-red-400"
            >
                <Trash2 className="w-4 h-4" />
                <span>Discard</span>
            </button>
            <button 
                onClick={() => setShowSaveDraftConfirmModal(true)} 
                className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
            </button>
            <button 
                onClick={() => setShowScheduleModal(true)} 
                className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-theme-secondary hover:bg-opacity-90 text-white rounded-md"
            >
                <Calendar className="w-4 h-4" />
                <span className='text-white'>Schedule</span>
            </button>
            <button 
                onClick={() => setShowPostPreviewModal(true)} 
                className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-theme-primary hover:bg-opacity-90 text-white rounded-md"
            >
                <Send className="w-4 h-4" />
                <span className='text-white'>Post Now</span>
            </button>
        </div>
      </div>
      
      {showPlatformWarning && (
        <div className="my-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600 rounded-md flex justify-between items-center shadow">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <p className="text-sm">{platformWarningMessage}</p>
          </div>
          <button onClick={() => setShowPlatformWarning(false)} className="ml-2 text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-500">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <textarea
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary min-h-[200px] dark:bg-gray-700"
                placeholder="What would you like to share today?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              ></textarea>
            </div>
            
            {selectedMediaPreviewUrl && isAnyNonYouTubeSelected && (
              <div className="mb-4 relative">
                {selectedMediaType === 'image' && <img src={selectedMediaPreviewUrl} alt="Uploaded media preview" className="w-full h-48 object-cover rounded-lg" />}
                {selectedMediaType === 'video' && <video controls src={selectedMediaPreviewUrl} className="w-full h-48 object-cover rounded-lg bg-black">Your browser does not support video.</video>}
                {selectedMediaType === 'gif' && <img src={selectedMediaPreviewUrl} alt="Uploaded GIF preview" className="w-full h-48 object-cover rounded-lg" />}
                <button 
                  onClick={() => { setSelectedMediaFile(null); setSelectedMediaPreviewUrl(null); setSelectedMediaType(null); }}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                >
                  <X className="w-4 h-4" />
                </button>
                {selectedMediaFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedMediaFile.name}</p>}
              </div>
            )}

            {selectedVideoPreviewUrl && isOnlyYouTubeSelected && (
              <div className="mb-4 relative">
                <video controls src={selectedVideoPreviewUrl} className="w-full h-48 object-cover rounded-lg bg-black">
                  Your browser does not support the video tag.
                </video>
                <button 
                  onClick={() => { setSelectedVideoFile(null); setSelectedVideoPreviewUrl(null); }}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                >
                  <X className="w-4 h-4" />
                </button>
                {selectedVideoFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedVideoFile.name}</p>}
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              {isAnyNonYouTubeSelected && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setShowMediaUploadModal(true)}
                >
                  <FileUp className="w-5 h-5 text-gray-500" />
                  <span>Add Media</span>
                </button>
              )}
              {isOnlyYouTubeSelected && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setShowVideoUploadModal(true)}
                >
                  <VideoIcon className="w-5 h-5 text-gray-500" />
                  <span>Add Video (for YouTube)</span>
                </button>
              )}
              <button 
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowLinkModal(true)}
              >
                <LinkIconLucide className="w-5 h-5 text-gray-500" />
                <span>Add Link</span>
              </button>
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                  <span>Add Emoji</span>
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 w-64">
                    <div className="grid grid-cols-8 gap-2">
                      {emojis.map((emoji, index) => (
                        <button 
                          key={index}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xl"
                          onClick={() => handleAddEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-4">Platforms</h3>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <div key={platform.id} className={`flex items-center justify-between p-4 rounded-lg transition-all ${selectedPlatforms[platform.id] ? 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-sm' : 'bg-white dark:bg-gray-800'} border ${selectedPlatforms[platform.id] ? `border-${platform.id}` : 'border-gray-200 dark:border-gray-700'} hover:shadow-md cursor-pointer`} onClick={() => togglePlatform(platform.id)} style={{ borderColor: selectedPlatforms[platform.id] ? platform.color : '', boxShadow: selectedPlatforms[platform.id] ? `0 2px 8px ${platform.bgColor}` : ''}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: platform.bgColor }}><div style={{ color: platform.color }}>{platform.icon}</div></div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: selectedPlatforms[platform.id] ? platform.color : 'rgb(209 213 219)' }}>
                    {selectedPlatforms[platform.id] && (<div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-4">Post Preview</h3>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[150px] overflow-auto max-h-[300px]">
              {postContent || (selectedMediaPreviewUrl && isAnyNonYouTubeSelected) || (selectedVideoPreviewUrl && isOnlyYouTubeSelected) ? (
                <div>
                  {postContent && <p className="text-gray-800 dark:text-gray-200 mb-3 break-words">{postContent}</p>}
                  {selectedMediaPreviewUrl && isAnyNonYouTubeSelected && (
                    selectedMediaType === 'image' ? 
                    <img src={selectedMediaPreviewUrl} alt="Media Preview" className="w-full max-h-48 object-contain rounded-md mb-2 bg-gray-100 dark:bg-gray-700"/> :
                    selectedMediaType === 'video' ?
                    <video controls src={selectedMediaPreviewUrl} className="w-full max-h-48 rounded-md bg-black">Your browser does not support video.</video> : 
                    selectedMediaType === 'gif' ?
                    <img src={selectedMediaPreviewUrl} alt="GIF Preview" className="w-full max-h-48 object-contain rounded-md mb-2 bg-gray-100 dark:bg-gray-700"/> : null
                  )}
                  {selectedVideoPreviewUrl && isOnlyYouTubeSelected && <video controls src={selectedVideoPreviewUrl} className="w-full max-h-48 rounded-md bg-black">Your browser does not support the video tag.</video>}
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">Your post preview will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <MediaUploadModal 
        isOpen={showMediaUploadModal} 
        onClose={() => setShowMediaUploadModal(false)} 
        onMediaUpload={handleMediaUpload}
        acceptTypes="image/*, video/*, image/gif"
      />
      <VideoUploadModal 
        isOpen={showVideoUploadModal} 
        onClose={() => setShowVideoUploadModal(false)} 
        onVideoUpload={handleYouTubeVideoUpload} 
      />
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h3 className="text-lg font-medium">Add Link</h3><button onClick={() => setShowLinkModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X className="w-5 h-5" /></button></div>
            <div className="p-5">
              <div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL</label><input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"/></div>
              <div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link Title (Optional)</label><input type="text" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Enter a title for your link" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"/></div>
              <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowLinkModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button><button onClick={handleAddLink} disabled={!linkUrl} className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md disabled:opacity-50">Add Link</button></div>
            </div>
          </div>
        </div>
      )}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h3 className="text-lg font-medium">Schedule Your Post</h3><button onClick={() => setShowScheduleModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X className="w-5 h-5" /></button></div>
            <div className="p-5">
              <div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label><input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700" min={new Date().toISOString().split('T')[0]}/></div>
              <div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Time</label><input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"/></div>
              <div className="mb-4"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platforms</label><div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md"><p className="text-sm">{getSelectedPlatformsList() || 'No platforms selected'}</p></div></div>
              <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button><button onClick={handleSchedule} disabled={!scheduleDate || !scheduleTime} className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md disabled:opacity-50">Schedule Post</button></div>
            </div>
          </div>
        </div>
      )}
      {showPostPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h3 className="text-lg font-medium">Post Preview</h3><button onClick={() => setShowPostPreviewModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X className="w-5 h-5" /></button></div>
            <div className="p-5">
              <div className="mb-6"><h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your post will appear like this:</h4><div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900"><p className="text-gray-800 dark:text-gray-200 mb-3 break-words">{postContent}</p>
              {selectedMediaPreviewUrl && isAnyNonYouTubeSelected && (
                selectedMediaType === 'image' ? 
                <img src={selectedMediaPreviewUrl} alt="Preview" className="w-full max-h-60 object-contain rounded-md mb-2 bg-gray-100 dark:bg-gray-700"/> :
                selectedMediaType === 'video' ?
                <video controls src={selectedMediaPreviewUrl} className="w-full max-h-60 rounded-md bg-black">Your browser does not support video.</video> : 
                selectedMediaType === 'gif' ?
                <img src={selectedMediaPreviewUrl} alt="GIF Preview" className="w-full max-h-60 object-contain rounded-md mb-2 bg-gray-100 dark:bg-gray-700"/> : null
              )}
              {selectedVideoPreviewUrl && isOnlyYouTubeSelected && (<video controls src={selectedVideoPreviewUrl} className="w-full max-h-60 rounded-md bg-black">Your browser does not support the video tag.</video>)}</div></div>
              <div className="mb-4"><h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Will be posted to:</h4><div className="flex flex-wrap gap-2">{platforms.map((platform) => (selectedPlatforms[platform.id] && (<div key={platform.id} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ backgroundColor: platform.bgColor, color: platform.color }}>{platform.icon}<span>{platform.name}</span></div>)))}</div></div>
              <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowPostPreviewModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button><button onClick={handlePostNow} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-1"><Check className="w-4 h-4" />Publish Now</button></div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal 
        isOpen={showDiscardConfirmModal}
        onClose={() => setShowDiscardConfirmModal(false)}
        onConfirm={handleDiscard}
        title="Discard Post"
        message="Are you sure you want to discard this post? All content and selections will be lost."
        confirmText="Discard"
      />
      <ConfirmationModal
        isOpen={showSaveDraftConfirmModal}
        onClose={() => setShowSaveDraftConfirmModal(false)}
        onConfirm={handleSaveDraft}
        title="Save as Draft"
        message="Are you sure you want to save this post as a draft?"
        confirmText="Save Draft"
        confirmButtonClass="bg-theme-secondary hover:bg-opacity-90 text-white"
        isDestructive={false}
        icon={<Save className="h-6 w-6 text-theme-secondary" />}
      />
    </div>
  );
};

export default PostCreation;
