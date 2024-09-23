import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '75%', sm: '80%', md: 500 }, 
  height: { xs: '80%', sm: '70%', md: 600 }, 
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto'
};

// Automatically import all image files in the Background folder
const backgroundContext = require.context('../LottieFiles/Background', false, /\.(jpg|png)$/);

const backgrounds = backgroundContext.keys().map((fileName, index) => ({
  id: index + 1,
  name: `Background ${index + 1}`, // Customize the name based on index
  src: backgroundContext(fileName).default || backgroundContext(fileName), // Use .default for Webpack images
}));

export default function BackgroundChoicesModal({ openModal, handleModalClose, onBackgroundSelect }) {
  const [open, setOpen] = useState(openModal);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleModalClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Choose Background to Add
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Select a background from the list below:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', mt: 2 }}>
              {backgrounds.map((background) => (
                <Box
                  key={background.id}
                  style={{
                    width: '45%', height: 'auto', border: 'solid black 1px', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer'
                  }}
                  onClick={() => { // Handle the click event here
                    onBackgroundSelect(background.src);  // Pass the selected background URL
                    handleModalClose();  // Close the modal after selection
                  }} 
                >
                  <img
                    src={background.src}
                    alt={background.name}
                    style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                    loading="lazy"
                  />
                  <Typography style={{ textAlign: 'center' }}>{background.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
