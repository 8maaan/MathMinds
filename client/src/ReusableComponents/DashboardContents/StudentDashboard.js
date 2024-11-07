import React, { useEffect, useState } from 'react'
import './StudentDashboard.css'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { getStudentDashboardContent } from '../../API-Services/DashboardAPI';

const FetchStudentData = (userId) => {
    const [topicData, setTopicData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await getStudentDashboardContent(userId);
        if (data.success) setTopicData(data.data);
      };
      fetchData();
    }, [userId]);
  
    return topicData;
};

const StudentDashboard = ({userId}) => {
    const fetchedStudentData = FetchStudentData(userId);
    if (fetchedStudentData === null) return <Typography>Loading...</Typography>;

    return (
        <>
            <Box className="sd-first-section-container">
                <Box>
                    <PeopleOutlineIcon fontSize='large' color='primary'/>
                </Box>
                <Box className="sd-first-section-content">
                    <Typography sx={{color: 'gray'}}>Total Students</Typography>
                    <Typography variant="h5" sx={{fontWeight:'600'}}>{fetchedStudentData.totalStudents || "null"}</Typography>
                </Box>
            </Box>
            <Typography sx={{width:'100%', textAlign:'left', fontWeight:'600', color:'gray'}}>Top Students by Badges</Typography>
            <Box className="sd-second-section-container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student Name</TableCell>
                                <TableCell align="center">Badges</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fetchedStudentData.topUsersByBadges.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell>{user.fullName || "null"}</TableCell>
                                    <TableCell align="center">{user.badgeCount || "null"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Typography sx={{width:'100%', textAlign:'left', fontWeight:'600', color:'gray'}}>Top Students by Completion</Typography>
            <Box className="sd-third-section-container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student Name</TableCell>
                                <TableCell align="center">Lessons</TableCell>
                                <TableCell align="center">Topics</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fetchedStudentData.topUsersByCompletion.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell align="center">{user.completedLessonCount || "null"}</TableCell>
                                    <TableCell align="center">{user.completedTopicCount || "null"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default StudentDashboard