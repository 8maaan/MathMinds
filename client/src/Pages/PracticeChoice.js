import React from 'react';
import { Box, Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './QuestionForm';
import '../PagesCSS/PracticeChoice.css';
import '../PagesCSS/TopicCard.css';

function PracticeChoice({ topic, onClose }) {
  
    const navigate = useNavigate(); 

    if (!topic) {
        return <div>No Topic</div>;
    }

    const cardStyles = {
        maxWidth: '800px',
        maxHeight: '600px',
        width: '80%',
        height: '80%',
        position: 'fixed',  
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', 
        zIndex: 1300 ,
        backgroundColor:'#ffec86'
      };

    const theme = createTheme({
        typography: {
          fontFamily: [
            'Poppins',
            'sans-serif'
          ].join(','),
        },
      });

     const BouncingButton = styled(Button)({
        width: 300,
        height: 280,
        color: '#181a52',
        fontWeight: 'bold',
        fontSize: 24,
        backgroundColor: 'lightblue',
        '&:hover': {
          animation: 'bounce 1s infinite',
          backgroundColor: 'blue'
        },
        '@keyframes bounce': {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(-20px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        }
      }); 

      const testButtonClick = () => {
        navigate('/questionForm');
      }

    return (
        <ThemeProvider theme={theme}>
          <div className="containerChoice">
            <div className='backgroundOverlay' onClick={onClose}></div>
            <Card sx={cardStyles}>
                <CardContent sx={{background:'#ffec86', marginTop: '50px'}}>
                    <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 2 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                        {topic.name}
                    </Typography>
                    <Typography gutterBottom variant="h7" component="div" align="center" sx={{marginTop: '50px', color: '#181a52'}}>
                        Choose a game mode
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 ,background:'#ffec86'}}>
                    <BouncingButton 
                        variant="contained"
                        className="button-hover-effect" 
                        sx={{ bgcolor: '#518bbc', '&:hover': { bgcolor: 'darkblue' },marginLeft: 15,marginRight: 2, borderRadius: 4 }} 
                        onClick={testButtonClick}>
                        SOLO
                    </BouncingButton>
                    <BouncingButton
                        variant="contained" 
                        className="button-hover-effect"
                        sx={{ bgcolor: '#f94848', '&:hover': { bgcolor: 'darkred' }, marginRight: 15, marginLeft: 2, borderRadius: 4 }} 
                        onClick={testButtonClick}>
                        COLLAB
                    </BouncingButton>
                </Box>
            </Card>
            </div>
        </ThemeProvider>
    );
}

export default PracticeChoice;

