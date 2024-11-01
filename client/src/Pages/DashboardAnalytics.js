import React, { useEffect, useState } from 'react'
import '../PagesCSS/DashboardAnalyticsPage.css'
import { getBasicCountAnalytics } from '../API-Services/DashboardAPI';
import { Alert, Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { UserAuth } from '../Context-and-routes/AuthContext';
import ReusableChoices from '../ReusableComponents/ReusableChoices';
import LessonDashboard, { LessonDashboardFirstSection, LessonDashboardSecondSection } from '../ReusableComponents/DashboardContents/LessonDashboard';
import { TopicDashboardFirstSection, TopicDashboardSecondSection } from '../ReusableComponents/DashboardContents/TopicDashboard';
import OverviewDashboard from '../ReusableComponents/DashboardContents/OverviewDashboard';

const DashboardAnalytics = () => {
  const { user } = UserAuth();
  const [btnGroupAlignment, setBtnGroupAlignment] = useState('Overview');
  const handleChange = (event, newAlignment) => {
    setBtnGroupAlignment(newAlignment);
  };

  return (
    <Box className='dap-body'>
      {!user.emailVerified && (
        <Alert
            variant="filled"
            severity="warning"
            sx={{ display: 'flex', justifyContent: 'center' }}
        >
            Please verify your email address to update your account information. An email has been sent to your inbox with verification instructions
        </Alert>
      )}
      <Box className='dap-wrapper'>
        <Box className='dap-content-container'>
            <Box className='dap-left-side'>
                <ReusableChoices/>
            </Box>
            <Box className='dap-right-side'>
                <Box className='dap-analytics-container'>
                  {!user ? "Loading..." :
                  <>
                    <Typography variant='h4' component='h2' sx={{marginBottom:'5%'}}>Teacher Dashboard</Typography>

                    <Box className='dap-toggleBtnGrp-container'>
                      <ToggleButtonGroup color="warning" value={btnGroupAlignment} exclusive onChange={handleChange}>
                        <ToggleButton value='Overview'>Overview</ToggleButton>
                        <ToggleButton value='Lessons'>Lessons</ToggleButton>
                        <ToggleButton value='Topics'>Topics</ToggleButton>
                        <ToggleButton value='Students'>Students</ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    {btnGroupAlignment === "Overview" ? (
                        <>
                          <OverviewDashboard userId={user.uid}/>
                        </>
                      ) : btnGroupAlignment === "Lessons" ? (
                        <Box className="dap-component-scrollable-container">
                          <Box className="dap-component-container">
                            <LessonDashboard userId={user.uid}/>
                          </Box>
                        </Box>
                      ) : btnGroupAlignment === "Topics" ? (
                        <Box className="dap-component-scrollable-container">
                          <Box className="dap-component-container">
                            <TopicDashboardFirstSection userId={user.uid}/>
                          </Box>
                        </Box>
                      ) : btnGroupAlignment === "Students" ? (
                        <Box className="dap-component-scrollable-container">
                          <Box className="dap-component-container">
                            ⚒ W.I.P ⚒
                          </Box>
                        </Box>
                      ) : null
                    }
                  </>
                  }
                </Box>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardAnalytics