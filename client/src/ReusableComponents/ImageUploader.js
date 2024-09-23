import React, { useRef } from 'react';
import { Button } from '@mui/material';

const ImageUploader = ({ onImageUpload }) => {
  const widgetRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  const createCloudinaryWidget = () => {
    const cloudinary = window.cloudinary;
    widgetRef.current = cloudinary.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_IMAGE_UPLOADER_CLOUDNAME,
        uploadPreset: process.env.REACT_APP_IMAGE_UPLOADER_UPLOADPRESET,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          onImageUpload(result.info.secure_url);
        }
        if (!error && result && result.event === 'close') {
          console.log('closed');
          widgetRef.current.destroy();
        }
      }
    );
  };

  const loadCloudinaryWidget = () => {
    if (!scriptLoadedRef.current) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.onload = () => {
        scriptLoadedRef.current = true;
        createCloudinaryWidget(); // Create the widget once the script loads
        widgetRef.current.open(); // Open the widget
      };
      document.body.appendChild(script);
    } else {
      createCloudinaryWidget(); // Create the widget if the script is already loaded
      widgetRef.current.open(); // Open the widget
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          ml: 1,
          backgroundColor: '#AA75CB',
          '&:hover': { backgroundColor: '#9163ad' },
        }}
        onClick={loadCloudinaryWidget}
      >
        Add Image
      </Button>
    </div>
  );
};

export default ImageUploader;
