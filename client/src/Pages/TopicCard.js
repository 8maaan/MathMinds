import React from 'react';
import Button from '@mui/material/Button';
import '../PagesCSS/TopicCard.css';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function TopicCard({ topic, onClose, onNext, onPrev }) {

  if (!topic) {
    return <div>Loading...</div>;
  }

  const theme = createTheme({
    typography: {
      fontFamily: 'Poppins',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            backgroundColor: '#ffec86',
            maxWidth: '80%',
            height: 'auto ',
            position: 'relative',
            overflow: 'visible',
          }
        }
      }
    }

    
  });

  const cardStyles = {
    maxWidth: '1000px',
    maxHeight: '500px',
    width: '80%',
    height: '80%',
    bgcolor: 'topic.color', // ensure 'topic.color' is passed correctly
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1300,
    backgroundColor: '#ffec86',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '20px',
  };

  return (
    <ThemeProvider theme={theme}>
    <div className="backgroundOverlay"> {/* Overlay sa blurry background */}
  <Card sx={cardStyles}>
    <CardContent>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: '8px', top: '8px', zIndex: 1 }}>
        <CloseIcon />
      </IconButton>
      <Typography gutterBottom variant="h6" component="div" align="center" sx={{marginTop:'80px'}}>
        {topic.name}
      </Typography>
      <Typography gutterBottom variant="h2" component="div" align="center" sx={{color:'#181a52', fontWeight:'Bold', marginTop:'80px'}}>
        Activity Name
      </Typography>
    </CardContent>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
    <Button className="playButton" onClick={onNext}>
  Play <ArrowForwardIcon/>
</Button>
    </div>
  </Card>
  </div>
</ThemeProvider>
  );
}

export default TopicCard;







