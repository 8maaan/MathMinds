import React from 'react'
import '../PagesCSS/HomePage.css'
import {Box,  Typography, Button, } from '@mui/material'
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';


const HomePage = () => {
    
    return (
        <div>
            <div class="Homepage">
                <ReusableAppBar/>
                <Box>
                    <Typography class='home-header'>
                        Hey there, math explorer!
                    </Typography>
                    <Typography class='home-paragraph'>
                        Ready to dive into the world of numbers and have some math fun together?
                    </Typography>
                </Box>

                <Box className='image-buttons'>
                    <Button /*onClick={handleClickImage1}*/>
                        <img src="https://imgur.com/nsthhLE.png" alt="Dashboard" className='img-button-size'/>
                    </Button>
                    <Button sx={{marginLeft: 3, marginRight: 3}}>
                        <img src="https://imgur.com/iP9rats.png" alt="Lessons" className='img-button-size' />
                    </Button>
                    <Button>
                        <img src="https://imgur.com/A0SMvsY.png" alt="Practice" className='img-button-size' />
                    </Button>
                </Box>
            </div>       
        </div>
    )
}

export default HomePage