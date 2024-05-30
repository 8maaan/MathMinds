import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ReusableDialog = ({ status, onClose, title, context}) => {
  const [open, setOpen] = useState(status);

  useEffect(() => {
    setOpen(status);
  }, [status]);

  const handleClose = (confirmed) => {
    setOpen(false);
    // Pass the status value to the callback function
    onClose && onClose(confirmed);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* The title for the dialog */}
        <DialogTitle id="alert-dialog-title" style={{ color: '#181A52' }}>
          {title}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* Add any additional content here if needed */}
            {context}
          </DialogContentText>
        </DialogContent>

        <DialogActions style={{ }}>
          {/* Options */}
          <Button 
            onClick={() => handleClose(false)}
            style={{ color: '#ffb100' }}
          >
            Cancel
          </Button>

          <Button 
            onClick={() => handleClose(true)} 
            autoFocus
            style={{ color: '#813cb9' }}
          >
            Confirm
          </Button>
          
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ReusableDialog;