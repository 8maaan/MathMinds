import React, { useEffect, useState } from 'react'
import '../PagesCSS/StudentDashboardAnalyticsPage.css'
//import { getBasicCountAnalytics } from '../API-Services/DashboardAPI';
import { Alert, Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { UserAuth } from '../Context-and-routes/AuthContext';
import ReusableChoices from '../ReusableComponents/ReusableChoices';
//import LessonDashboard, { LessonDashboardFirstSection, LessonDashboardSecondSection } from '../ReusableComponents/DashboardContents/LessonDashboard';
//import { TopicDashboardFirstSection, TopicDashboardSecondSection } from '../ReusableComponents/DashboardContents/TopicDashboard';
//import OverviewDashboard from '../ReusableComponents/DashboardContents/OverviewDashboard';
import LessonProgressPage from '../Pages/LessonProgressPage'; // Adjust the import path accordingly
import BadgesPage from './BadgesPage';
import OverviewSDPage from '../ReusableComponents/OverviewSDPage';


const StudentDashboardAnalytics = () => {
  const { user } = UserAuth();
  const [btnGroupAlignment, setBtnGroupAlignment] = useState('Overview');
  const handleChange = (event, newAlignment) => {
    setBtnGroupAlignment(newAlignment);
  };

  return (
    <Box className='sdap-body'>
      {!user.emailVerified && (
        <Alert
            variant="filled"
            severity="warning"
            sx={{ display: 'flex', justifyContent: 'center' }}
        >
            Please verify your email address to update your account information. An email has been sent to your inbox with verification instructions
        </Alert>
      )}
      <Box className='sdap-wrapper'>
        <Box className='sdap-content-container'>
            <Box className='sdap-left-side'>
                <ReusableChoices/>
            </Box>
            <Box className='sdap-right-side'>
                <Box className='sdap-analytics-container'>
                  {!user ? "Loading..." :
                  <>
                    <Typography sx={{marginBottom:'5%', justifyContent: 'center',
                                    alignItems:'center', fontSize:'30px', fontWeight: '900', 
                    }}>
                      {user.displayName || "Student"}'s Dashboard
                    </Typography>
                    
                    <Box className='sdap-toggleBtnGrp-container' sx={{backgroundColor:'#F6E6C3'}}>
                      <ToggleButtonGroup color="warning" value={btnGroupAlignment} exclusive onChange={handleChange}>
                        <ToggleButton value='Overview'>Overview</ToggleButton>
                        <ToggleButton value='Lesson Progress'>Lesson Progress</ToggleButton>
                        <ToggleButton value='Badges'>Badges</ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    {btnGroupAlignment === "Overview" ? (
                        <Box className="sdap-component-scrollable-container">
                          <Box className="sdap-component-container">
                            <OverviewSDPage />
                          </Box>
                        </Box>
                      ) : btnGroupAlignment === "Lesson Progress" ? (
                        <Box className="sdap-component-scrollable-container">
                            <Box className="sdap-component-container">
                              <LessonProgressPage />
                            </Box>
                        </Box>
                      ) : btnGroupAlignment === "Badges" ? (
                        <Box className="sdap-component-scrollable-container">
                          <Box className="sdap-component-container">
                            <BadgesPage />
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

export default StudentDashboardAnalytics