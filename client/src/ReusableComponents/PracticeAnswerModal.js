import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const PracticeAnswerModal = ({ open, handleClose, message, handleConfirm, handleContinue }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{message.title}</DialogTitle>
      <DialogContent>
        <Typography>{message.content}</Typography>
      </DialogContent>
      <DialogActions>
        {handleContinue ? (
          <>
            <Button onClick={handleContinue}>Continue</Button>
            <Button onClick={handleConfirm}>No, Redirect me to Practice</Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleConfirm} color="primary">Yes</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PracticeAnswerModal;
