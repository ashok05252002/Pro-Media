import React, { useState } from 'react';
import { X, FileUp } from 'lucide-react';

const MediaUploadModal = ({ isOpen, onClose, onMediaUpload, acceptTypes = "image/*, video/*, image/gif" }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image', 'video', 'gif'

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!acceptTypes.split(', ').some(type => file.type.startsWith(type.replace('*', '')) || file.type === type)) {
        alert(`Invalid file type. Please select: ${acceptTypes}`);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileType(null);
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      if (file.type.startsWith('image/')) setFileType('image');
      else if (file.type.startsWith('video/')) setFileType('video');
      else setFileType('other');

    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileType(null);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onMediaUpload(selectedFile, previewUrl);
      handleClose();
    } else {
      alert('Please select a file to upload.');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium">Upload Media</h3>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Image, Video, or GIF
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept={acceptTypes}
                onChange={handleFileChange}
                className="hidden"
                id="media-upload-input"
              />
              <label htmlFor="media-upload-input" className="cursor-pointer">
                <FileUp className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supports: Images, Videos, GIFs
                </p>
              </label>
            </div>
          </div>

          {previewUrl && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview:</p>
              {fileType === 'image' && <img src={previewUrl} alt="Preview" className="w-full max-h-60 object-contain rounded-md bg-gray-100 dark:bg-gray-700"/>}
              {fileType === 'video' && <video controls src={previewUrl} className="w-full max-h-60 rounded-md bg-black">Your browser does not support the video tag.</video>}
              {selectedFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>}
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md disabled:opacity-50"
            >
              Upload Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadModal;
