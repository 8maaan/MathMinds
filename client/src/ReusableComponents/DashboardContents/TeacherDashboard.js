import React from 'react'
import '../../PagesCSS/DashboardAnalyticsPage.css';
import { Box, Typography, } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TopicIcon from '@mui/icons-material/Topic';

export const FirstDashboardDefaultView = () => {
  return (
    <>
        <Box className='dap-overview-count-box'>
            <PeopleOutlineIcon fontSize='large' color='primary'/>
            <Box className='dap-overview-count-box-info'>
                <Typography sx={{color:'gray', fontWeight:'500'}}>Total Students</Typography>
                <Typography sx={{fontSize:'24px', fontWeight:'600'}}>150</Typography>
            </Box>
        </Box>

        <Box className='dap-overview-count-box'>
            <AutoStoriesIcon fontSize='large' color='success'/>
            <Box className='dap-overview-count-box-info'>
                <Typography sx={{color:'gray', fontWeight:'500'}}>Active Lessons</Typography>
                <Typography sx={{fontSize:'24px', fontWeight:'600'}}>150</Typography>
            </Box>
        </Box>

        <Box className='dap-overview-count-box'>
            <MilitaryTechIcon fontSize='large' color='secondary'/>
            <Box className='dap-overview-count-box-info'>
                <Typography sx={{color:'gray', fontWeight:'500'}}>Badges Awarded</Typography>
                <Typography sx={{fontSize:'24px', fontWeight:'600'}}>150</Typography>
            </Box>
        </Box>
    </>  
  )
}

export const DashboardRecentActivity = () =>{
    return(
        <>
            <Box className='dap-recent-activity-container'>
                <Typography variant='h6' sx={{width: '100%', textAlign:'left'}}>Recent Activity</Typography>
                <Box className='dap-recent-activity-container-info-box'>
                    <AccessTimeIcon style={{color:'gray'}} fontSize='medium'/>
                    <Box className='dap-recent-activity-data'>
                        <Typography style={{fontSize:'16px', fontWeight:'500'}}>New Lesson Added: Advanced Algebra</Typography>
                        <Typography style={{fontSize:'13px', color: 'gray'}}>2 hours ago</Typography>
                    </Box>
                </Box>

                <Box className='dap-recent-activity-container-info-box'>
                    <TopicIcon style={{color:'gray'}} fontSize='medium'/>
                    <Box className='dap-recent-activity-data'>
                        <Typography style={{fontSize:'16px', fontWeight:'500'}}>New Topic Added: Geometry Basics</Typography>
                        <Typography style={{fontSize:'13px', color: 'gray'}}>2 hours ago</Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

