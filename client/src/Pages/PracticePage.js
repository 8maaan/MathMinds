import React from 'react'
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import PracticeLessonList from '../ReusableComponents/PracticeLessonList'
import '../PagesCSS/PracticePage.css'
import { Typography, Box } from '@mui/material';

const PracticePage = () => {

    return (
        <div>
            <ReusableAppBar/>
            <Box>
                <Typography class='practice-header'>Welcome to the Practice Area!</Typography>
                <Typography class='practice-paragraph'>Dive into our practice zone for a fun-filled journey through numbers!</Typography>
            </Box>
            <PracticeLessonList/>
            
        </div>
      )
}

export default PracticePage