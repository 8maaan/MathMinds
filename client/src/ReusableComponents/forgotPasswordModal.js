import {Button, Box, Modal, Typography, Fade, Backdrop, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';

export default function ForgotPasswordModal({ open, onClose }) {
  const theme = useTheme();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
    [theme.breakpoints.down('sm')]: {
      width: '75%',
    },
    [theme.breakpoints.up('md')]: {
      width: 400,
    },
  };
  

  const { sendPasswordReset } = UserAuth();
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async(event) =>{
    event.preventDefault();
    console.log(email);
    try{
      await sendPasswordReset(email);
      setConfirmed(true);
    }catch(e){
      console.log(e);
    }
  }
  
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
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
            <Typography id="transition-modal-title" variant="h5" component="h2">
              Forgot your password?
            </Typography>
            {!confirmed ?
              <div>
                <Typography id="transition-modal-description" sx={{ mt: 2, mb: 5, fontSize: 14}}>
                  We'll send you a link to reset your password
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField 
                    label='Email'
                    type='email'
                    required
                    onChange={(event) => {setEmail(event.target.value)}}
                    sx={{mb: 2,}} 
                    InputProps={{style:{borderRadius:'15px'}}} 
                    fullWidth/>
                    <Button type='submit' variant='contained'fullWidth sx={{backgroundColor:'#ffb100', height:'6vh', fontWeight:'600', borderRadius:'15px'}}>Send link</Button>
                </form> 
              </div>
              :
              <div>
                <Typography id="transition-modal-description" sx={{ mt: 2, mb: 5, fontSize: 12}}>
                  Great! We've sent an email to {email} with instructions on how to reset your password.
                </Typography>
              </div>
            }
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
