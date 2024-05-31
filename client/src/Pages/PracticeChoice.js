import React, { useState } from 'react';
import { Box, Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../PagesCSS/PracticeChoice.css';

function PracticeChoice({onClose}) {
    const navigate = useNavigate();
    const [showPracticeChoice, setShowPracticeChoice] = useState(true);

    const cardStyles = {
        maxWidth: '50rem',
        maxHeight: '37.5rem',
        width: '80%',
        height: '80%',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1300,
        backgroundColor: '#ffec86'
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
        width: '18.75rem',
        height: '17.5rem',
        color: '#181a52',
        fontWeight: 'bold',
        fontSize: '1.5rem',
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
                transform: 'translateY(-1.25rem)',
                animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
            }
        }
    });

    const handleButtonClick = () => {
      onClose(); // Close the modal when "SOLO" is clicked
  };

    return (
        <ThemeProvider theme={theme}>
            <div className="containerChoice">
                <div className='backgroundOverlay'></div>
                <Card sx={cardStyles}>
                    <CardContent sx={{ background: '#ffec86', marginTop: '3.125rem' }}>
                        <IconButton aria-label="close" sx={{ position: 'absolute', right: '0.5rem', top: '0.5rem', zIndex: 2 }}>
                            <CloseIcon />
                        </IconButton>
                        <Typography gutterBottom variant="h5" component="div" align="center">
                            Choose a game mode
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, background: '#ffec86' }}>
                        <BouncingButton
                            variant="contained"
                            className="button-hover-effect"
                            sx={{ bgcolor: '#518bbc', '&:hover': { bgcolor: 'darkblue' }, marginLeft: '0.9375rem', marginRight: '0.125rem', borderRadius: '0.25rem' }}
                            onClick={() => handleButtonClick('SOLO')}>
                            SOLO
                        </BouncingButton>
                        <BouncingButton
                            variant="contained"
                            className="button-hover-effect"
                            sx={{ bgcolor: '#f94848', '&:hover': { bgcolor: 'darkred' }, marginRight: '0.9375rem', marginLeft: '0.125rem', borderRadius: '0.25rem' }}
                            onClick={() => handleButtonClick('COLLAB')}
                            disable={true}>
                            COLLAB
                        </BouncingButton>
                    </Box>
                </Card>
            </div>
        </ThemeProvider>
    );
}

export default PracticeChoice;


