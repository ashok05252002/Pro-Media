import React, { useState } from 'react';
import { X, Video } from 'lucide-react';

const VideoUploadModal = ({ isOpen, onClose, onVideoUpload }) => {
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedVideoFile(null);
      setVideoPreview(null);
      alert('Please select a valid video file.');
    }
  };

  const handleSubmit = () => {
    if (selectedVideoFile) {
      onVideoUpload(selectedVideoFile, videoPreview); // Pass file and preview URL
      onClose();
      // Reset state for next time
      setSelectedVideoFile(null);
      setVideoPreview(null);
    } else {
      alert('Please select a video file to upload.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium">Upload Video (for YouTube)</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Video File
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload-input"
              />
              <label htmlFor="video-upload-input" className="cursor-pointer">
                <Video className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  MP4, MOV, AVI, etc.
                </p>
              </label>
            </div>
          </div>

          {videoPreview && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview:</p>
              <video controls src={videoPreview} className="w-full max-h-60 rounded-md bg-black">
                Your browser does not support the video tag.
              </video>
              {selectedVideoFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedVideoFile.name}</p>}
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedVideoFile}
              className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md disabled:opacity-50"
            >
              Upload Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;
