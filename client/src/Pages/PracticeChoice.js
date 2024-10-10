import React, { useState } from 'react';
import { Box, Button, Card, CardContent, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../PagesCSS/PracticeChoice.css';

function PracticeChoice({onClose, modeChoice}) {
   
    const [showJoinRoom, setShowJoinRoom] = useState(false);

    const [firstChoice, setFirstChoice] = useState('SOLO');
    const [secondChoice, setSecondChoice] = useState('COLLAB');

    const [cardStyleHeight, setCardStyleHeight] = useState('80%');

    const [roomCode, setRoomCode] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [errorOccured, setErrorOccured] = useState(false);

    const cardStyles = {
        maxWidth: '50rem',
        maxHeight: '37.5rem',
        width: '80%',
        height: cardStyleHeight,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1300,
        backgroundColor: '#ffec86',
        borderRadius: '15px'
    };

    const backdropStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1200
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

    const handleButtonChoiceClick = (choice) => {
        modeChoice(choice);
        if(choice === 'COLLAB'){
            setFirstChoice('CREATE ROOM');
            setSecondChoice('JOIN ROOM');
        }else if(choice ==='JOIN ROOM'){
            setShowJoinRoom(true);
            setCardStyleHeight('auto');
        }
        
    };

    const joinRoom = async () => {
        if (roomCode.trim() === '') {
          // Show an error message that the room code can't be empty
          setErrorMessage("Room code cannot be empty");
          return;
        }
        
        try {
          await modeChoice('JOIN_ROOM', roomCode);
          onClose();
        } catch (error) {
          console.error("Error joining room:", error);
          setErrorMessage("Unable to join: Please check the room code and ensure you've selected the correct topic.");
          setErrorOccured(true);
        //   if (error.message === "Room topic does not match selected topic") {
        //     setErrorMessage("This room is for a different topic. Please select the correct topic or create a new room.");
        //     setErrorOccured(true);
        //   } else if (error.message === "Room does not exist") {
        //     setErrorMessage("The room does not exist. Please check the room code and try again.");
        //     setErrorOccured(true);
        //   } else {
        //     setErrorMessage("An error occurred while joining the room. Please try again.");
        //     setErrorOccured(true);
        //   }
        }
    };
    

    const handleCloseIconClick =() =>{
        onClose();
        setShowJoinRoom(false); 
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="containerChoice">
                <div style={backdropStyle}></div>
                <Card sx={cardStyles}>
                    <CardContent sx={{ background: '#ffec86', marginTop: '3.125rem' }}>
                        <IconButton aria-label="close" sx={{ position: 'absolute', right: '0.5rem', top: '0.5rem', zIndex: 2 }}>
                            <CloseIcon  onClick={() => {handleCloseIconClick()}}/>
                        </IconButton>
                        <Typography gutterBottom variant="h5" component="div" align="center" sx={{color: '#181a52', fontFamily: 'Poppins', fontSize:'35px', mt: { xs: 1, sm:6, md: 5 }}}>
                            {showJoinRoom === false ? 'Choose a game mode' : 'Enter room code'}
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 5, background: '#ffec86' }}>
                        {showJoinRoom === false ? 
                            <>
                                <BouncingButton
                                    variant="contained"
                                    className="button-hover-effect"
                                    sx={{ bgcolor: '#5999cf', '&:hover': { bgcolor: '#497eab' }, marginLeft: '2rem', marginRight: '0.5rem', borderRadius: '1rem' }}
                                    onClick={() => handleButtonChoiceClick(firstChoice)}>
                                    {firstChoice}
                                </BouncingButton>
                                <BouncingButton
                                    variant="contained"
                                    className="button-hover-effect"
                                    sx={{ bgcolor: '#f94848', '&:hover': { bgcolor: 'darkred' }, marginRight: '2rem', marginLeft: '0.125rem', borderRadius: '1rem' }}
                                    onClick={() => handleButtonChoiceClick(secondChoice)}
                                    disabled={false}>
                                    {secondChoice}
                                </BouncingButton>
                            </>
                            :
                            <div style={{width: '70%'}}>
                                <TextField 
                                    fullWidth 
                                    autoComplete='off' 
                                    value={roomCode} 
                                    onChange={(e) => setRoomCode(e.target.value)}
                                    error={errorOccured}
                                    helperText={errorOccured ? errorMessage : null}

                                />
                                <Button variant='contained' size='large' sx={{mt: 1.5}} onClick={joinRoom}>
                                    Join Room
                                </Button>
                            </div>
                        }
                    </Box>
                </Card>
            </div>
        </ThemeProvider>
    );
}

export default PracticeChoice;


