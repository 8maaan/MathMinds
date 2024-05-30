import { Alert, Snackbar } from "@mui/material";

export default function SnackbarComponent({open, onClose, severity, message}) {
    return(
        <div>
          <Snackbar open={open} autoHideDuration={3000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <Alert variant="filled" onClose={onClose} severity={severity} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
        </div>
    )
}