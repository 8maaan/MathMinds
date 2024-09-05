import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, Modal } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { getAllLessonsQuiz } from '../API-Services/LessonQuizAPI';
import { checkUserBadge, awardBadge } from '../API-Services/UserAPI'; // Import the new functions
import LoadingAnimations from '../ReusableComponents/LoadingAnimations';
import { UserAuth } from '../Context-and-routes/AuthContext'; // Assuming you have access to user context here

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
    color: '#181a52',
  },
  palette: {
    text: {
      primary: '#181a52'
    }
  }
});

const OptionButton = styled(Button)({
  height: 80,
  width: '45%',
  fontSize: '1rem',
  margin: '5px',
  color: 'white',
  borderRadius: '10px'
});

const QuizQuestionForm = () => {
  const { user } = UserAuth(); // Get user information
  const { lessonId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setOpen] = useState(false);
  const [badgeNotification, setBadgeNotification] = useState(false); // State for badge notification
  const [badgeAwarded, setBadgeAwarded] = useState(false); // State to check if badge was awarded

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await getAllLessonsQuiz();
      if (response.success) {
        const lessonQuiz = response.data.find(q => q.lessonQuizId === parseInt(quizId, 10));
        setQuiz(lessonQuiz);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const questions = Object.values(quiz.lessonQuizQA);
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const options = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
  const optionColors = ['#f94848', '#4cae4f', '#2874ba', '#f4cc3f'];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setOpen(true);
      }
    }, 500);
  };

  const handleClose = async () => {
    setOpen(false);
    const passingScore = questions.length * 0.6; // Calculate the passing score as 60% of the total questions

    if (user && score >= passingScore) {
      const badgeCheck = await checkUserBadge(user.uid, lessonId);
      if (badgeCheck.success && !badgeCheck.data) { // If user hasn't earned the badge yet
        const awardResponse = await awardBadge(user.uid, lessonId);
        if (awardResponse.success) {
          console.log("Badge awarded successfully!");
          setBadgeAwarded(true); // Mark the badge as awarded
        } else {
          console.error("Failed to award badge:", awardResponse.message);
        }
      }
      setBadgeNotification(true); // Show badge notification
    } else {
      setBadgeNotification(true); // Show notification even if failed
    }
  };

  const handleBadgeNotificationClose = () => {
    setBadgeNotification(false);
    navigate('/lessons', { state: { lessonId: parseInt(lessonId, 10), score } });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='container'>
        <Container maxWidth="md" sx={{ padding: '20px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '120px', position: 'relative' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#181a52' }} gutterBottom>
            {quiz.lessonTitle} - Final Assessment
          </Typography>
          <Paper elevation={3} sx={{ height: '22.5rem', padding: '20px', backgroundColor: '#f6e6c3', marginTop: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '100px' }}>
              {currentQuestion.question}
            </Typography>
            <Typography variant="body1" sx={{ position: 'absolute', top: '10px', left: '10px' }}>
              Question {currentQuestionIndex + 1}
            </Typography>
          </Paper>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
            {options.map((option, idx) => (
              <OptionButton
                key={`${currentQuestionIndex}-${idx}`}
                sx={{ bgcolor: optionColors[idx % optionColors.length], color: '#181a52', minWidth: '100px', marginBottom: '20px' }}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null}
              >
                {option}
              </OptionButton>
            ))}
          </Box>
        </Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            radius: '20px',
            textAlign: 'center'
          }}>
            <Typography id="modal-title" variant="h6" component="h2" sx={{color: '#181a52'}}>
              Quiz Completed!
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2, color: '#181a52' }}>
              You scored {score} out of {questions.length}.
            </Typography>
            <Button onClick={handleClose} variant="contained" sx={{ mt: 2, backgroundColor:'#ffb100', color: '#181a52'}}>
              Close
            </Button>
          </Box>
        </Modal>
        
        {/* Badge Notification Modal */}
        <Modal
          open={badgeNotification}
          onClose={handleBadgeNotificationClose}
          aria-labelledby="badge-modal-title"
          aria-describedby="badge-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2 // Add some space between items
          }}>
            {badgeAwarded ? (
              <>
                <Typography id="badge-modal-title" variant="h6" component="h2" sx={{color: '#181a52'}}>
                  Congratulations!
                </Typography>
                <Typography id="badge-modal-description" sx={{ mt: 2, color: '#181a52' }}>
                  You've passed the quiz and earned a badge!
                </Typography>
                {/* Replace with actual badge image */}
                <img src="https://png.pngtree.com/png-clipart/20190604/original/pngtree-badge-png-image_996483.jpg" alt="Badge" style={{ width: '100px', margin: '20px 0' }} />
              </>
            ) : (
              <>
                <Typography id="badge-modal-title" variant="h6" component="h2" sx={{color: '#181a52'}}>
                  Quiz Result
                </Typography>
                <Typography id="badge-modal-description" sx={{ mt: 2, color: '#181a52' }}>
                  {score >= questions.length * 0.6 ? "You've passed the quiz!" : "You've failed the quiz."}
                </Typography>
              </>
            )}
            <Button onClick={handleBadgeNotificationClose} variant="contained" sx={{ mt: 2, backgroundColor:'#ffb100', color: '#181a52'}}>
              Close
            </Button>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
};

export default QuizQuestionForm;
