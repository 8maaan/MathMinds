import React from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Typography, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    fontFamily: 'Poppins',
    minWidth: '400px',
    backgroundColor: '#ffec86',
    borderRadius:'15px',
  },
});

const ModalTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#ffec86',
  color: '#181a52',
});

const ModalContent = styled(DialogContent)({
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
  color: '#181a52',
});

const ModalActions = styled(DialogActions)({
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
});

const buttonColors = ['#f94848'];
const buttonHoverColors = ['darkred'];

const StyledButton = styled(Button)(({ theme, colorIndex }) => ({
  margin: theme.spacing(1),
  fontFamily: 'Poppins',
  backgroundColor: buttonColors[colorIndex % buttonColors.length],
  color: 'white',
  borderRadius:'8px',
  '&:hover': {
    backgroundColor: buttonHoverColors[colorIndex % buttonHoverColors.length],
  },
  '&:first-child': {
    marginRight: theme.spacing(1),
  },
}));

const CongratulatoryModal = ({ open, handleClose, message, handleConfirm }) => {
  return (
    <StyledDialog open={open} onClose={handleClose}>
      <ModalTitle>{message.title}</ModalTitle>
      <ModalContent>
        <Typography>{message.content}</Typography>
      </ModalContent>
      <ModalActions>
        <StyledButton onClick={handleConfirm} colorIndex={0}>OK</StyledButton>
      </ModalActions>
    </StyledDialog>
  );
};

export default CongratulatoryModal;
