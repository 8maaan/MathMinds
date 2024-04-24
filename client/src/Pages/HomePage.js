import React from 'react'
import '../PagesCSS/HomePage.css'
import {Box,  Typography, Button, } from '@mui/material'
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
    const navigateTo = useNavigate();

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
                    <Button className='image-buttons-margin'onClick={()=> navigateTo('*')}>
                        <img src="https://imgur.com/nsthhLE.png" alt="Dashboard" className='img-button-size'/>
                    </Button>
                    <Button className='image-buttons-margin' onClick={()=> navigateTo('*')} sx={{marginLeft: 3, marginRight: 3}}>
                        <img src="https://imgur.com/iP9rats.png" alt="Lessons" className='img-button-size' />
                    </Button>
                    <Button className='image-buttons-margin'onClick={()=> navigateTo('*')}>
                        <img src="https://imgur.com/A0SMvsY.png" alt="Practice" className='img-button-size' />
                    </Button>
                </Box>
            </div>       
        </div>
    )
}

export default HomePage