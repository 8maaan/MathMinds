import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Context-and-routes/AuthContext';
import '../PagesCSS/HomePage.css';
import NavigationBar from '../ReusableComponents/NavigationBar';


// FOR TESTING PURPOSES ONLY (ROUTES)
// EDIT LATER
// testing new branch

const HomePage = () => {

    const navigateTo = useNavigate();
    const { user } = UserAuth();

    return (
        <div>
            {user ? 
                <>
                    <div class="Homepage">
                        <NavigationBar/>
                        <Box>
                            <Typography class='home-header'>
                                Hey there, math explorer!
                            </Typography>
                            <Typography class='home-paragraph'>
                                Ready to dive into the world of numbers and have some math fun together?
                            </Typography>
                        </Box>

                        <Box className='image-buttons'>
                            <Button className='button'>
                                <img src="https://imgur.com/nsthhLE.png" alt="Dashboard" className='img-button-size' onClick={()=> navigateTo('*')}/>
                            </Button>
                            <Button className='image-buttons-margin'>
                                <img src="https://imgur.com/iP9rats.png" alt="Lessons" className='img-button-size' onClick={()=> navigateTo('*')}/>
                            </Button>
                            <Button className='button'>
                                <img src="https://imgur.com/A0SMvsY.png" alt="Practice" className='img-button-size' onClick={()=> navigateTo('*')}/>
                            </Button>
                        </Box>
                    </div>
                </>
            :   
                <>
                    <h2>Not signed in</h2>
                    <h3>Check if you can access /profile, if not, good.</h3>
                </>
            }
        </div>
    )
}

export default HomePage