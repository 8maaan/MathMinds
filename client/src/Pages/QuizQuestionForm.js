import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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

const iconStyle = {
  fontSize: '60px',
  padding: '60px',
  color: '#ffb100'
};

const QuizQuestionForm = () => {
  const { lessonId, quizId } = useParams(); 
  const [quiz, setQuiz] = useState(null); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 

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

  const options = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer]; 

  const optionColors = ['#f94848', '#4cae4f', '#2874ba', '#f4cc3f']; 

  return (
    <ThemeProvider theme={theme}>
      <div className='container'>
        <ReusableAppBar /> 
        
        <Box style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)' }}>
          <IconButton onClick={() => setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0))}>
            <ArrowBackIosIcon style={iconStyle} />
          </IconButton>
        </Box>
        <Box style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
          <IconButton onClick={() => setCurrentQuestionIndex(Math.min(currentQuestionIndex + 1, questions.length - 1))}>
            <ArrowForwardIosIcon style={iconStyle} />
          </IconButton>
        </Box>
        
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
                key={`${currentQuestionIndex}-${idx}`} // Ensure unique key for each option per question
                sx={{ bgcolor: optionColors[idx % optionColors.length], color: '#181a52', minWidth: '100px', marginBottom: '20px' }}
              >
                {option} 
              </OptionButton>
            ))}
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default QuizQuestionForm;
