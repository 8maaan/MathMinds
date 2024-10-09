import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Paper, Grid, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../PagesCSS/ScoreTest.css";
import { getUserProfileInfoFromDb } from "../API-Services/UserAPI";
import { UserAuth } from "../Context-and-routes/AuthContext";

const theme = createTheme({
  typography: {
    fontSize: 12,
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          padding: "1.25rem",
          margin: "0.5rem 0",
          background: "#d6c1e3",
          width: "calc(100% - 40px)",
          height: "90px",
          color: "#181a52",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#181a52",
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
  const { correctAnswers, totalQuestions, lessonId, topicId } =
    location.state || {};
  const [userProfileInfo, setUserProfileInfo] = useState({ fname: "" });

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

  const scores =
    correctAnswers !== undefined && totalQuestions !== undefined
      ? [
          {
            id: 1,
            name: userProfileInfo.fname,
            questionsCorrect: correctAnswers,
            totalQuestions: totalQuestions,
            score: correctAnswers * 10,
            totalScore: totalQuestions * 10,
          },
        ]
      : [];

  const onClickDone = () => {
    navigate("/practice");
  };

  const onClickHome = () => {
    navigate(`/practice-event/${lessonId}/${topicId}`);
  };

  return (
    <div>
  <ThemeProvider theme={theme}>
    <div className="overallContainer">
      <div className="scoresContainer">
        <div className="scoreHeader">
          <Grid container alignItems="center">
            <Grid item xs={2} sm={1} md={1}></Grid> {/* Matches the first column of content */}
            <Grid item xs={4} sm={3} md={3}></Grid> {/* Matches the name column of content */}
            <Grid item xs={6} sm={6} md={6} style={{ textAlign: "right", paddingRight: "30px" }}> {/* Adjusted paddingRight */}
              <Typography variant="h6">Score</Typography>
            </Grid>
          </Grid>
        </div>
        {scores.map((score, index) => (
          <Paper key={index} elevation={3} className="scorePaper" style={{ marginBottom: "10px" }}> {/* Added margin for spacing */}
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={4} sm={3} md={3}>
                <Typography variant="h6">{score.name}</Typography>
              </Grid>
              
              <Grid item xs={4} sm={5} md={4.5}>
                <Typography variant="body1" style={{ fontSize: "16px", marginRight: "30px" }}> {/* Adjusted marginRight */}
                  {`${score.score}/${score.totalScore}`}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <div className="buttonsContainer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}> {/* Flexbox for button alignment */}
          <Button
            sx={{
              width: "150px",
              backgroundColor: "#ffb100",
              color: "#181A52",
              padding: "10px 30px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#e09c00",
              },
              "&:active": {
                backgroundColor: "#c78500",
                transform: "scale(0.98)",
              },
            }}
            onClick={onClickDone}
          >
            Done
          </Button>
          <Button
            sx={{
              width: "200px",
              backgroundColor: "#ffb100",
              color: "#181A52",
              padding: "10px 30px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#e09c00",
              },
              "&:active": {
                backgroundColor: "#c78500",
                transform: "scale(0.98)",
              },
            }}
            onClick={onClickHome}
          >
            Choose Another Topic
          </Button>
        </div>
      </div>
    </div>
  </ThemeProvider>
</div>

  );
};

export default ScoreTest;


