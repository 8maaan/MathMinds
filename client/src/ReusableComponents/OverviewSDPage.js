import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Paper, Divider, CircularProgress } from '@mui/material';
import { Book, Visibility, History } from '@mui/icons-material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import dayjs from 'dayjs';
import { UserAuth } from '../Context-and-routes/AuthContext';
import { getStudentDashboardOverview } from '../API-Services/DashboardAPI';

/*const studentData = {
    userMostAccessedContent: {
        lessonTitle: "Test Lesson 1",
        viewCount: 4,
        topicTitle: "TL1 Topic 3"
    },
    userMostAccessedPractice: {
        lessonTitle: "Test Lesson 1",
        practiceId: 1,
        viewCount: 16,
        topicTitle: "TL1 Topic 1"
    },
    userTopicsCompleted: 8,
    userBadgeCount: 5,
    userRecentTopicViewed: [
        { lastViewed: "2024-11-04T01:41:44", lessonTitle: "Test Lesson 4", topicTitle: "TL4 Topic 1" },
        { lastViewed: "2024-11-04T01:27:54", lessonTitle: "Test Lesson 5", topicTitle: "Topic 2" }
    ],
    userRecentPracticeViewed: [
        { lastViewed: "2024-11-03T17:26:28", lessonTitle: "Test Lesson 2", practiceId: 2, topicTitle: "TL2 Topic 1" },
        { lastViewed: "2024-11-03T15:35:39", lessonTitle: "Test Lesson 1", practiceId: 1, topicTitle: "TL1 Topic 1" }
    ]
};

const TOTAL_TOPICS = 10;
const TOTAL_BADGES = 10;*/

const OverviewSDPage = () => {
    const { user } = UserAuth();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch student dashboard overview data
                const dashboardResponse = await getStudentDashboardOverview(user.uid);
                if (dashboardResponse.success) {
                    setStudentData(dashboardResponse.data);
                } else {
                    throw new Error(dashboardResponse.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.uid]);


    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }
    
    return (
        <Box p={3} sx={{ width: '100%', maxWidth: 550, mx: 'auto' }}>
            {/* Recent Activity Section */}
            <Box mb={2}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>Recent Activity</Typography>
                <Divider />
                <Grid container spacing={3}>
                    {/* Recent Topics Viewed */}
                    <Grid item xs={12} sm={6}>
                        <Card variant="outlined" sx={{ mb: 2, borderRadius: '15px', mt: 2, backgroundColor: 'rgba(255, 177, 0, 0.5)', boxShadow: '2' }}>
                            <CardContent>
                                <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
                                    <History fontSize="small" sx={{ mr: 1 }} /> Recently Viewed Topics
                                </Typography>
                                {studentData.userRecentTopicViewed && studentData.userRecentTopicViewed.length > 0 ? (
                                    studentData.userRecentTopicViewed.map((topic, index) => (
                                        <Paper key={index} elevation={2} sx={{ p: 1, mt: 1, borderRadius: '10px', backgroundColor: '#A4C3CF' }}>
                                            <Typography variant="body1" sx={{ textAlign: 'left' }}>
                                                {topic.lessonTitle} - {topic.topicTitle}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                                {dayjs(topic.lastViewed).format('MMM D, YYYY')}
                                            </Typography>
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No recent topics viewed.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
    
                    {/* Recent Practices Viewed */}
                    <Grid item xs={12} sm={6}>
                        <Card variant="outlined" sx={{ mb: 2, borderRadius: '15px', mt: 2, backgroundColor: 'rgba(255, 177, 0, 0.5)', boxShadow: '2' }}>
                            <CardContent>
                                <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
                                    <History fontSize="small" sx={{ mr: 1 }} /> Recently Viewed Practices
                                </Typography>
                                {studentData.userRecentPracticeViewed && studentData.userRecentPracticeViewed.length > 0 ? (
                                    studentData.userRecentPracticeViewed.map((practice, index) => (
                                        <Paper key={index} elevation={2} sx={{ p: 1, mt: 1, borderRadius: '15px', backgroundColor: '#A4C3CF' }}>
                                            <Typography variant="body1" sx={{ textAlign: 'left' }}>
                                                {practice.lessonTitle} - {practice.topicTitle}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                                {dayjs(practice.lastViewed).format('MMM D, YYYY')}
                                            </Typography>
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No recent practices viewed.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
    
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>Learning Highlights</Typography>
            <Divider />
            {/* Key Metrics Row with Circular Progress Bars */}
            <Box mt={3} mb={2} p={2} sx={{ backgroundColor: '#F6E6C3', borderRadius: 2 }}>
                <Grid container spacing={3}>
                    {/* Topics Completed Progress */}
                    <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative" display="inline-flex">
                            {/* Gray Background Circle */}
                            <CircularProgress
                                variant="determinate"
                                value={100}
                                size={190}
                                thickness={2.5}
                                sx={{ color: 'lightgray', position: 'absolute', top: 0, left: 0 }}
                            />
                            {/* Main Progress Circle */}
                            <CircularProgress
                                variant="determinate"
                                value={(studentData.userTopicsCompleted / (studentData.totalTopics || 1)) * 100}
                                size={190}
                                thickness={2.5}
                                color="primary"
                            />
                            <Box
                                top={0}
                                left={0}
                                bottom={0}
                                right={0}
                                position="absolute"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Book fontSize="large" sx={{ color: '#4CAE4F' }} />
                                <Typography variant="h6" component="div" color="textPrimary">
                                    {`${studentData.userTopicsCompleted || 0}/${studentData.totalTopics || 0}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Topics Completed</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Badges Earned Progress */}
                    <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative" display="inline-flex">
                            {/* Gray Background Circle */}
                            <CircularProgress
                                variant="determinate"
                                value={100}
                                size={190}
                                thickness={2.5}
                                sx={{ color: 'lightgray', position: 'absolute', top: 0, left: 0 }}
                            />
                            {/* Main Progress Circle */}
                            <CircularProgress
                                variant="determinate"
                                value={(studentData.userBadgeCount / (studentData.totalLessons || 1)) * 100}
                                size={190}
                                thickness={2.5}
                                color="secondary"
                            />
                            <Box
                                top={0}
                                left={0}
                                bottom={0}
                                right={0}
                                position="absolute"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <MilitaryTechIcon fontSize="large" sx={{ color: '#ffb100' }} />
                                <Typography variant="h6" component="div" color="textPrimary">
                                    {`${studentData.userBadgeCount || 0}/${studentData.totalLessons || 0}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Badges Earned</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Access Statistics Section */}
            <Box mt={3} mb={1}>
                <Box mb={3} mt={2}>
                    <Card variant="outlined" sx={{ borderRadius: '15px', backgroundColor: '#F8A792', boxShadow: '2' }}>
                        <CardContent>
                            <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
                                <Visibility fontSize="small" sx={{ mr: 1 }} /> Most Visited Content
                            </Typography>
                            {studentData.userMostAccessedContent ? (
                                <>
                                    <Typography variant="body1">
                                        {studentData.userMostAccessedContent.lessonTitle || 'N/A'} - {studentData.userMostAccessedContent.topicTitle || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Visited {studentData.userMostAccessedContent.viewCount || 0} times
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">No data available.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Box>
                <Box mb={3}>
                    <Card variant="outlined" sx={{ borderRadius: '15px', backgroundColor: '#9BC88B', boxShadow: '2' }}>
                        <CardContent>
                            <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
                                <Visibility fontSize="small" sx={{ mr: 1 }} /> Most Practiced Topic
                            </Typography>
                            {studentData.userMostAccessedPractice && Object.keys(studentData.userMostAccessedPractice).length > 0 ? (
                                <>
                                    <Typography variant="body1">
                                        {studentData.userMostAccessedPractice.lessonTitle || 'N/A'} - {studentData.userMostAccessedPractice.topicTitle || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Practiced {studentData.userMostAccessedPractice.viewCount || 0} times
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">No data available.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default OverviewSDPage;
