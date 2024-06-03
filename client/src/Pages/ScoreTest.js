import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Paper, Grid, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../PagesCSS/ScoreTest.css';
import { getUserProfileInfoFromDb } from '../API-Services/UserAPI';
import { UserAuth } from '../Context-and-routes/AuthContext';

const theme = createTheme({
  typography: {
    fontSize: 12,
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          padding: '1.25rem',
          margin: '0.5rem 0',
          background: '#d6c1e3',
          width: 'calc(100% - 40px)',
          height: '90px',
          color: '#181a52',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#181a52',
        },
      },
    },
  },
});

const ScoreTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const { correctAnswers, totalQuestions } = location.state || {};
  const [userProfileInfo, setUserProfileInfo] = useState({ fname: '' });

  // Fetch user profile info
  useEffect(() => {
    const fetchUserProfileInfo = async () => {
      if (user) {
        const result = await getUserProfileInfoFromDb(user.uid);
        if (result.success) {
          setUserProfileInfo(result.data);
        } else {
          console.error("Failed to fetch user profile info");
        }
        setLoading(false);
      }
    };
    fetchUserProfileInfo();
  }, [user]);

  const scores = correctAnswers !== undefined && totalQuestions !== undefined ? [
    {
      id: 1,
      name: userProfileInfo.fname, 
      questionsCorrect: correctAnswers,
      totalQuestions: totalQuestions,
      score: correctAnswers * 10,
      totalScore: totalQuestions * 10,
    },
  ] : [];

  const onClickDone = () => {
    navigate('/practice');
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div className="overallContainer">
          <div className="scoresContainer">
            <div className="scoreHeader">
              <Grid container alignItems="center">
                <Grid item xs={12} sm={1} md={1}></Grid>
                <Grid item xs={6} sm={3} md={3}></Grid>
                <Grid item xs={2} sm={4} md={4} style={{ textAlign: 'right', marginLeft: '1.5rem' }}>
                  <Typography variant="h6">Questions</Typography>
                </Grid>
                <Grid item xs={3} sm={4} md={4} style={{ textAlign: 'right', marginLeft: '-11.8rem' }}>
                  <Typography variant="h6">Scores</Typography>
                </Grid>
              </Grid>
            </div>
            {scores.map((score, index) => (
              <Paper key={index} elevation={3} className="scorePaper">
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item xs={2} sm={1} md={1} style={{ textAlign: 'left' }}>
                    <Typography variant="h6">{score.id}.</Typography>
                  </Grid>
                  <Grid item xs={4} sm={3} md={3}>
                    <Typography variant="h6">{score.name}</Typography>
                  </Grid>
                  <Grid item xs={3} sm={4} md={4} style={{ textAlign: 'right', marginRight:'-150px' }}>
                    <Typography variant="body1" style={{ fontSize: '16px' }}>{`${score.questionsCorrect}/${score.totalQuestions}`}</Typography>
                  </Grid>
                  <Grid item xs={3} sm={4} md={4} style={{ textAlign: 'right', marginRight:'150px' }}>
                    <Typography variant="body1" style={{ fontSize: '16px'}}>{`${score.score}/${score.totalScore}`}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <div className="doneButton">
              <Button variant="contained" onClick={onClickDone}>Done</Button>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default ScoreTest;

