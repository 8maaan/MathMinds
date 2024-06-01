import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, Modal } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import { getAllLessonsQuiz } from '../API-Services/LessonQuizAPI';

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
  const { lessonId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setOpen] = useState(false);

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

  const handleClose = () => {
    setOpen(false);
    navigate('/lessons', { state: { lessonId: parseInt(lessonId, 10), score } });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='container'>
        <ReusableAppBar />
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
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}>
            <Typography id="modal-title" variant="h6" component="h2">
              Quiz Completed!
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              You scored {score} out of {questions.length}.
            </Typography>
            <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
};

export default QuizQuestionForm;
