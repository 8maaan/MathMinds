import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Lottie from 'lottie-react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 600,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

// Automatically import all Lottie files in the LottieFiles folder
const animationContext = require.context('../LottieFiles/LottieAnimations', false, /\.json$/);

const animations = animationContext.keys().map((fileName, index) => ({
  id: index + 1,
  name: `Animation ${index + 1}`, // Will change l8er for naming conventions
  path: fileName,
  data: animationContext(fileName),
}));

export default function AnimationChoicesModal({ openModal, handleModalClose, onAnimationSelect }) {
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
              Choose Animation to Add
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Select an animation from the list below:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', mt: 2 }}>
              {animations.map((animation) => (
                <Box
                  key={animation.id}
                  style={{ width: '25%', height: '25%', border: 'solid black 1px', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer' }}
                  onClick={() => { 
                    onAnimationSelect(animation.path.replace(".",""));  // Pass the selected animation data
                    handleModalClose();  // Close the modal after selection
                  }} 
                >
                  <Lottie animationData={animation.data} />
                  <Typography style={{textAlign:'center'}}>{animation.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
