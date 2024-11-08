import React, { useEffect, useState } from 'react'
// Nasayop nako'g plano, ako gi-usa ang CSS ani sa DashboardAnalytics.js 😭
import '../../PagesCSS/DashboardAnalyticsPage.css'; 
import { Box, Typography, } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TopicIcon from '@mui/icons-material/Topic';
import { getOverviewDashboardContent } from '../../API-Services/DashboardAPI';

const FetchOverviewData = (userId) => {
    const [overviewData, setOverviewData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await getOverviewDashboardContent(userId);
        if (data.success) setOverviewData(data.data);
      };
      fetchData();
    }, [userId]);
  
    return overviewData;
};

const OverviewDashboard = ({userId}) => {
    const fetchedOverviewData = FetchOverviewData(userId);

    if (fetchedOverviewData === null) return <Typography>Loading...</Typography>;

    const timeAgo = (dateString) => {
        if(!dateString){
            return "null";
        }

        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        const intervals = [
          { label: 'year', seconds: 31536000 },
          { label: 'month', seconds: 2592000 },
          { label: 'week', seconds: 604800 },
          { label: 'day', seconds: 86400 },
          { label: 'hour', seconds: 3600 },
          { label: 'minute', seconds: 60 },
          { label: 'second', seconds: 1 },
        ];
      
        for (const interval of intervals) {
          const count = Math.floor(seconds / interval.seconds);
          if (count > 0) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
          }
        }
        return 'just now'; // Fallback if the date is very recent
    };

    return (
        <>
            <Box className='dap-overview-count-box'>
                <PeopleOutlineIcon fontSize='large' color='primary'/>
                <Box className='dap-overview-count-box-info'>
                    <Typography sx={{color:'gray', fontWeight:'500'}}>Total Students</Typography>
                    <Typography sx={{fontSize:'24px', fontWeight:'600'}}>{fetchedOverviewData.totalStudents || "0"}</Typography>
                </Box>
            </Box>

            <Box className='dap-overview-count-box'>
                <AutoStoriesIcon fontSize='large' color='success'/>
                <Box className='dap-overview-count-box-info'>
                    <Typography sx={{color:'gray', fontWeight:'500'}}>Active Lessons</Typography>
                    <Typography sx={{fontSize:'24px', fontWeight:'600'}}>{fetchedOverviewData.totalLessons || "0"}</Typography>
                </Box>
            </Box>

            <Box className='dap-overview-count-box'>
                <MilitaryTechIcon fontSize='large' color='secondary'/>
                <Box className='dap-overview-count-box-info'>
                    <Typography sx={{color:'gray', fontWeight:'500'}}>Badges Awarded</Typography>
                    <Typography sx={{fontSize:'24px', fontWeight:'600'}}>{fetchedOverviewData.totalBadgesAwarded || "0"}</Typography>
                </Box>
            </Box>

            <Box className='dap-recent-activity-container'>
                <Typography variant='h6' sx={{width: '100%', textAlign:'left'}}>Recent Activity</Typography>
                <Box className='dap-recent-activity-container-info-box'>
                    <AccessTimeIcon style={{color:'gray'}} fontSize='medium'/>
                    <Box className='dap-recent-activity-data'>
                        <Typography style={{fontSize:'16px', fontWeight:'500'}}>New Lesson Added: {fetchedOverviewData.recentLessons?.[0]?.lessonTitle || "None"}</Typography>
                        <Typography style={{fontSize:'13px', color: 'gray'}}>{timeAgo(fetchedOverviewData.recentLessons[0].lessonDateAdded)}</Typography>
                    </Box>
                </Box>

                <Box className='dap-recent-activity-container-info-box'>
                    <TopicIcon style={{color:'gray'}} fontSize='medium'/>
                    <Box className='dap-recent-activity-data'>
                        <Typography style={{fontSize:'16px', fontWeight:'500'}}>New Topic Added: {fetchedOverviewData.recentTopics[0].topicTitle}</Typography>
                        <Typography style={{fontSize:'13px', color: 'gray'}}>{timeAgo(fetchedOverviewData.recentTopics[0].topicDateAdded)}</Typography>
                    </Box>
                </Box>
            </Box>
        </>  
    )
}

export default OverviewDashboard




