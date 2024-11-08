import { useEffect, useState } from 'react';
import './TopicDashboard.css'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getTopicDashboardContent } from '../../API-Services/DashboardAPI';

const FetchTopicData = (userId) => {
    const [topicData, setTopicData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await getTopicDashboardContent(userId);
        if (data.success) setTopicData(data.data);
      };
      fetchData();
    }, [userId]);
  
    return topicData;
  };

export const TopicDashboardFirstSection = ({userId}) => {
    const fetchedTopicData = FetchTopicData(userId);

    // Check if fetchedTopicData and its properties exist before processing
    const entries = fetchedTopicData?.totalViewCount ? Object.entries(fetchedTopicData.totalViewCount): [];
    const mostPopularTopic = entries.length ? entries.reduce((max, entry) => (entry[1] > max[1] ? entry : max)) : ["No data available"];
    const [topicCount, setTopicCount] = useState(0);
    const totalTopics = fetchedTopicData?.totalTopics || 0;

    useEffect(() => {
        // Set up an interval that increments the count every 500ms (or desired interval)
        const interval = setInterval(() => {
            setTopicCount(prevCount => {
                if (prevCount < totalTopics) {
                    return prevCount + 1;
                } else {
                    clearInterval(interval); // Clear the interval when reaching 9
                    return prevCount; // Return the current count (9)
                }
            });
        }, 50);

        // Clear the interval on component unmount
        return () => clearInterval(interval);
    }, [totalTopics]);

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

    if (fetchedTopicData === null) return <Typography>Loading...</Typography>;
    return (
        <>
            <Box className="td-first-section-container">
                <Box className="td-overView-container">
                    <Typography> Recently Added Topics ⏰</Typography>
                    <Box className="td-overView-content">
                        <Typography style={{fontSize:'16px', fontWeight:'500', color:'inherit'}}>{fetchedTopicData?.recentTopics?.[0]?.topicTitle ?? null}</Typography>       
                        <Typography style={{fontSize:'13px', color: 'gray'}}>{timeAgo(fetchedTopicData?.recentTopics?.[0]?.topicDateAdded ?? null)}</Typography>
                    </Box>
                    <Box className="td-overView-content">
                        <Typography style={{fontSize:'16px', fontWeight:'500', color:'inherit'}}>{fetchedTopicData?.recentTopics?.[1]?.topicTitle ?? null}</Typography>       
                        <Typography style={{fontSize:'13px', color: 'gray'}}>{timeAgo(fetchedTopicData?.recentTopics?.[1]?.topicDateAdded ?? null)}</Typography>
                    </Box>
                    <Typography> Most Popular Topic 🌟</Typography>
                    <Box className="td-overView-content">
                        {mostPopularTopic}
                    </Box>
                </Box>
                <Box className="td-totalActiveTopics-container">
                    <Box className="td-totalActiveTopics-content">
                        <Typography sx={{fontSize:'4.5rem', color: '#181A52;', fontWeight:'500'}}>
                            {topicCount}
                        </Typography>
                        <Typography sx={{fontSize:'1rem'}}>
                            Total Active Topics
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box className="td-second-section-container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Lesson Title</TableCell>
                                <TableCell>Topic Title</TableCell>
                                <TableCell>
                                    <Tooltip title='Number of Users Who Completed the Topic"'>
                                        Number of Users Completed <HelpOutlineIcon style={{fontSize:'16px', color:'gray'}}/>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Individual user accounts that viewed the topic">
                                        Unique Total Views <HelpOutlineIcon style={{fontSize:'16px', color:'gray'}}/>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="The total views of the topic">
                                        Total View Count <HelpOutlineIcon style={{fontSize:'16px', color:'gray'}}/>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(fetchedTopicData.completionAnalytics).map(([lesson, topics]) => {
                                const topicKeys = Object.keys(topics);
                                return topicKeys.map((topic, index) => (
                                    <TableRow key={`${lesson}-${topic}`}>
                                        {index === 0 && (
                                            <TableCell rowSpan={topicKeys.length} style={{ borderRight: '1px solid #ccc' }}>{lesson}</TableCell>
                                        )}
                                        <TableCell>{topic}</TableCell>
                                        <TableCell>{topics[topic].numberOfUsersCompleted}</TableCell>
                                        <TableCell>{topics[topic].uniqueTotalView} views</TableCell>
                                        <TableCell>{topics[topic].totalViewCount} views</TableCell>
                                    </TableRow>
                                ));
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

