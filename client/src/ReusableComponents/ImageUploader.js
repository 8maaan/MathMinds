import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';

const ImageUploader = ({ onImageUpload, reset }) => {
  const widgetRef = useRef(null);
  const [uploadedImgName, setUploadedImgName] = useState('');

  useEffect(() => {
    if (reset) {
      setUploadedImgName('');
    }
  }, [reset]);

  useEffect(() => {
    // Dynamically load the Cloudinary script
    const loadCloudinaryWidget = () => {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.onload = () => {
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
            if (!error && result && result.event === 'queues-end') {
              const fileName = result.info.files[0].name;
              setUploadedImgName(fileName);
            }
          }
        );
      };
      document.body.appendChild(script);

      // Cleanup to prevent memory leaks
      return () => {
        document.body.removeChild(script);
      };
    };

    loadCloudinaryWidget();
  }, [onImageUpload]);

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          ml: 1,
          backgroundColor: '#AA75CB',
          '&:hover': { backgroundColor: '#9163ad' },
        }}
        onClick={() => widgetRef.current.open()}
      >
        Add Image
      </Button>
    </div>
  );
};

export default ImageUploader;
