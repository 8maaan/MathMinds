import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
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

const buttonColors = ['#518bbc','#f94848'];
const buttonHoverColors = ['darkblue','darkred'];

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

const PracticeAnswerModal = ({
  open,
  handleClose,
  message,
  handleConfirm,
  handleContinue,
  handleCancelWrongAnswer,
  handleEndOfPractice,
  handleContinuePractice,
  isEndOfPractice
}) => {
  return (
    <StyledDialog open={open} onClose={handleClose}>
      <ModalTitle>{message.title}</ModalTitle>
      <ModalContent>
        <Typography>{message.content}</Typography>
      </ModalContent>
      <ModalActions>
  {isEndOfPractice ? (
    <>
      <StyledButton onClick={handleEndOfPractice} colorIndex={0}>No</StyledButton>
      <StyledButton onClick={handleContinuePractice} colorIndex={1}>Yes</StyledButton>
    </>
  ) : handleContinue ? (
    <>
      <StyledButton onClick={handleContinue} colorIndex={2}>Continue</StyledButton>
      <StyledButton onClick={handleCancelWrongAnswer} colorIndex={3}>No, Redirect me to Practice</StyledButton>
    </>
  ) : (
    <>
      <StyledButton onClick={handleClose} colorIndex={0}>No</StyledButton>
      <StyledButton onClick={handleConfirm} colorIndex={1}>Yes</StyledButton>
    </>
  )}
</ModalActions>

    </StyledDialog>
  );
};

export default PracticeAnswerModal;
