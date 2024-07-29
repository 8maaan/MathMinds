import React from 'react';
import { Box, Button, Card, CardContent, IconButton, Typography, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../PagesCSS/PracticeChoice.css';

function PracticeChoice({ onClose }) {
    const cardStyles = {
        width: '60%',
        maxWidth: '900px',
        height: '90%',
        maxHeight: '600px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1300,
        backgroundColor: '#ffec86',
        padding: '1rem',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
        width: '80%', // Ensure the buttons take up the full width of their container
        height: '15rem', // Adjust height for a more prominent size
        color: '#181a52',
        fontWeight: 'bold',
        fontSize: '1rem',
        backgroundColor: 'lightblue',
        borderRadius: '12px', // More square-like shape
        margin: '0 0.5rem',
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

    const handleCloseIconClick = () => {
        onClose();
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="overlay">
                <Card sx={cardStyles}>
                    <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                        <IconButton aria-label="close" sx={{ position: 'absolute', right: '1rem', top: '1rem', zIndex: 2 }} onClick={handleCloseIconClick}>
                            <CloseIcon />
                        </IconButton>
                        <Typography gutterBottom variant="h5" component="div" align="center" sx={{ color: '#181a52', fontFamily: 'Poppins', fontSize: '2rem' }}>
                            Choose a game mode
                        </Typography>
                    </CardContent>
                    <Box sx={{ width: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                                <BouncingButton
                                    variant="contained"
                                    className="button-hover-effect"
                                    sx={{ bgcolor: '#5999cf', '&:hover': { bgcolor: '#497eab' } }}
                                    onClick={() => handleButtonClick('SOLO')}>
                                    SOLO
                                </BouncingButton>
                            </Grid>
                            <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                                <BouncingButton
                                    variant="contained"
                                    className="button-hover-effect"
                                    sx={{ bgcolor: '#f94848', '&:hover': { bgcolor: 'darkred' } }}
                                    onClick={() => handleButtonClick('COLLAB')}
                                    disabled={true}>
                                    COLLAB
                                </BouncingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </div>
        </ThemeProvider>
    );
}

export default PracticeChoice;



