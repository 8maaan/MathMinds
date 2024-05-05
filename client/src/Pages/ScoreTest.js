import React from 'react';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import { Paper, Button, Grid, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../PagesCSS/ScoreTest.css';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif' // It's good to have a fallback font
    ].join(','),

  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          padding: '20px',
          margin: '10px 0',
          background: '#d6c1e3',
          width: 'calc(100% - 40px)',
          height: '90px',
          color: '#181a52'
        }
      }
    }
  }
});

const ScoreTest = () => {
  const scores = [
    { id: 1, name: 'Name', questionsCorrect: 10, totalQuestions: 10, score: 100, totalScore: 100 },
    { id: 2, name: 'Name', questionsCorrect: 7, totalQuestions: 10, score: 70, totalScore: 100 },
  ];

  return (
    <div>
    <ReusableAppBar />
    <ThemeProvider theme={theme}>
      
      <div className="overallContainer">
        <div className="scoresContainer">
          <div className="scoreHeader">
            <Grid container alignItems="center" style={{paddingTop:'50px'}}>
              <Grid item xs={1}></Grid> {/* for ID alignment */}
              <Grid item xs={3}></Grid> {/* for name alignment */}
              <Grid item xs={4} style={{ textAlign: 'right', paddingLeft:'320px' }}> 
                <Typography variant="h6">Questions</Typography>
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'right', paddingRight:'70px'}}> 
                <Typography variant="h6">Scores</Typography>
              </Grid>
            </Grid>
          </div>
          {scores.map((score, index) => (
            <Paper key={index} elevation={3} className="scorePaper" padding='30px'>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item xs={1} style={{ textAlign: 'left', paddingLeft:'50px' }}>
                  <Typography variant="h6">{score.id}.</Typography>
                </Grid>
                <Grid item xs={3} style={{ paddingLeft: '10px' }}>
                  <Typography variant="h6">{score.name}</Typography>
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'right' }}>
                  <Typography variant="body1">{`${score.questionsCorrect}/${score.totalQuestions}`}</Typography>
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'right', paddingRight:'50px' }}>
                  <Typography variant="body1">{`${score.score}/${score.totalScore}`}</Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
          <div className="done-button">
            <Button variant="contained">Done</Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
    </div>
  );
};

export default ScoreTest;








