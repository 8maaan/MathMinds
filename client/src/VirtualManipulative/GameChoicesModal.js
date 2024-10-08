import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import virtualManipulatives from './VirtualManipulativeList';

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

export default function GameChoicesModal({ openModal, handleModalClose, onManipulativeSelect }) {
  const open = openModal;

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
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
              Virtual Manipulative
            </Typography>
            <Typography sx={{fontSize:'0.8rem'}}>
              <span style={{fontWeight:'600'}}>Attribution:</span> 
              This simulation is used under the Creative Commons Attribution 4.0 International License (CC-BY 4.0). 
              More information is available at https://phet.colorado.edu/en/licensing.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {virtualManipulatives.map((manipulative) => (
                <Box
                  key={manipulative.id}
                  sx={{
                    border: 'solid #6acef5 1rem', borderRadius: '5px', padding: '10px', marginBottom: '10px', display:'flex', flexDirection:'column', alignItems:'center',
                  }}
                >
                  <Box sx={{ height: { xs: '75%', sm: '75%', md: '55%' }, border: 'solid #ffbf00 5px' }}>
                    <img src={manipulative.thumbnail} alt="thumbnail" style={{ width: '100%', height: '100%', display: 'block' }} loading="lazy"/>
                  </Box>
                  <Typography sx={{fontWeight:'600', fontSize:'1.15rem'}}>{manipulative.name}</Typography>
                  <Typography sx={{fontSize:'0.8rem'}}>{manipulative.tags}</Typography>
                  <Button 
                    variant="contained" 
                    color="primary" sx={{ mt: 1 }}  
                    onClick={() => { onManipulativeSelect(manipulative); handleModalClose(); }} 
                  >
                    Select
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
