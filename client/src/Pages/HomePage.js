import React from 'react'
import '../PagesCSS/HomePage.css'
import { Box, Typography, Button } from '@mui/material'
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import { useNavigate } from 'react-router-dom';
import homepageDashboardBtn from '../Images/HomePage_DashboardBtn.png';
import homepageLessonBtn from '../Images/HomePage_LessonsBtn.png';
import homepagePracticeBtn from '../Images/HomePage_PracticeBtn.png';

const HomePage = () => {
  const navigateTo = useNavigate();

  return (
    <div>
      <div className="Homepage">
        <ReusableAppBar/>
        <Box>
          <Typography className='home-header'>
            Hey there, math explorer!
          </Typography>
          <Typography className='home-paragraph'>
            Ready to dive into the world of numbers and have some math fun together?
          </Typography>
        </Box>

        <Box className='image-buttons'>
          <Button className='image-buttons-margin' onClick={() => navigateTo('/dashboard')}>
            <img src={homepageDashboardBtn} alt="Dashboard" className='img-button-size'/>
          </Button>
          <Button className='image-buttons-margin' onClick={() => navigateTo('/lessons')} sx={{ marginLeft: 3, marginRight: 3 }}>
            <img src={homepageLessonBtn} alt="Lessons" className='img-button-size' />
          </Button>
          <Button className='image-buttons-margin' onClick={() => navigateTo('/practice-event')}>
            <img src={homepagePracticeBtn} alt="Practice" className='img-button-size' />
          </Button>
        </Box>
      </div>       
    </div>
  )
}

export default HomePage
