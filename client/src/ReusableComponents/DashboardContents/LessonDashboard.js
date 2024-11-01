import React, { useEffect, useState } from 'react'
import './LessonDashboard.css'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Tooltip,} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { getLessonDashboardContent } from '../../API-Services/DashboardAPI';


const FetchLessonData = (userId) => {
  const [lessonData, setLessonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLessonDashboardContent(userId);
      if (data.success) setLessonData(data.data);
    };
    fetchData();
  }, [userId]);

  return lessonData;
};

const LessonDashboard = ({ userId }) => {
  const fetchedLessonData = FetchLessonData(userId);
  if (fetchedLessonData === null) return <Typography>Loading...</Typography>;

  // console.log(fetchedLessonData)

  const entries = Object.entries(fetchedLessonData.totalLessonViewCounts);
  const mostPopularLesson = entries.reduce((max, entry) => entry[1] > max[1] ? entry : max);
  const leastAccessedLesson = entries.reduce((min, entry) => entry[1] < min[1] ? entry : min);

  const data = Object.entries(fetchedLessonData.totalLessonViewCounts).map(([lesson, count]) => ({
    lesson,
    count,
  }));
  
  // console.log(mostPopularLesson);
  return (
    <>
      <Box className="ld-first-section-container">
        <Box className="ld-totalLessonCompleted-container">
          <TableContainer component={Paper} className='ld-totalLessonCompleted-table'>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontSize:'1rem'}}> Lessons 🧾</TableCell>
                  <TableCell align="center" sx={{fontSize:'1rem'}}> Badges Given 🥇</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(fetchedLessonData.badgeCountPerLesson).map(([lesson, count]) => (
                  <TableRow key={lesson}>
                    <TableCell>{lesson}</TableCell>
                    <TableCell align="center">{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className="ld-overView-container">
          
          <Typography> Active Lessons 📚</Typography>
          <Box className="ld-overView-content">
            {fetchedLessonData.totalLessons}           
          </Box>

          <Typography> Most Popular Lesson 🌟</Typography>
          <Box className="ld-overView-content">
            <Tooltip title="Based on the lesson with the highest view count">
              {mostPopularLesson[0]} 
            </Tooltip>        
          </Box>

          <Typography> Least Accessed Lesson 📉</Typography>
          <Box className="ld-overView-content">
            <Tooltip title="Based on the lesson with the lowest total view count">
              {leastAccessedLesson[0]} 
            </Tooltip>           
          </Box>
        </Box>
      </Box>
      <Box className="ld-second-section-container">
          <BarChart
            dataset={data}
            yAxis={[{ scaleType: 'band', dataKey: 'lesson'}]}
            xAxis={[{label: 'Cumulative Lesson View Count'}]}
            series={[{ dataKey: 'count', color: '#2196f3', label: 'View Count'}]}
            layout="horizontal"
            grid={{ vertical: true }}
            height={350}
            margin={{ 
              left: 150
            }}
            sx={{
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(128, 128, 128, 0.2)"
            }}
          />
      </Box>
    </>
  )
}

export default LessonDashboard;
