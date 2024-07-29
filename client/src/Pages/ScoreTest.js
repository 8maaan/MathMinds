import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Paper, Grid, Button, useMediaQuery } from '@mui/material';
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

  const isSmallScreen = useMediaQuery('(max-width:600px)');

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
                <Grid item xs={6} />
                <Grid item xs={3} style={{ textAlign: 'right', paddingRight: isSmallScreen ? '0.5rem' : '1rem', marginLeft: isSmallScreen ? '10px' : '15px' }}>
                  <Typography variant="h6">Questions</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right', paddingLeft: isSmallScreen ? '0.5rem' : '1rem', marginLeft: isSmallScreen ? '-20px' : '-29px' }}>
                  <Typography variant="h6">Scores</Typography>
                </Grid>
              </Grid>
            </div>
            {scores.map((score, index) => (
              <Paper key={index} elevation={3} className="scorePaper">
                <Grid container alignItems="center">
                  <Grid item xs={3} style={{ textAlign: 'left' }}>
                    <Typography variant="h6">{score.id}. {score.name}</Typography>
                  </Grid>
                  <Grid item xs={3} />
                  <Grid item xs={3} style={{ textAlign: 'right' }}>
                    <Typography variant="body1" style={{ fontSize: '16px' }}>{`${score.questionsCorrect}/${score.totalQuestions}`}</Typography>
                  </Grid>
                  <Grid item xs={3} style={{ textAlign: 'right' }}>
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
