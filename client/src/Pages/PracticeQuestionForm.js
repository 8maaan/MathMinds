import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import PracticeAnswerModal from '../ReusableComponents/PracticeAnswerModal';
import CongratulatoryModal from '../ReusableComponents/CongratulatoryModal';
import LoadingAnimations from '../ReusableComponents/LoadingAnimations';

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

// Mock data
const mockQuestions = [
  {
    question: 'What is the capital of France?',
    correctAnswer: 'Paris',
    incorrectAnswers: ['Berlin', 'Madrid', 'Rome'],
  },
  {
    question: 'What is 2 + 2?',
    correctAnswer: '4',
    incorrectAnswers: ['3', '5', '6'],
  },
  {
    question: 'Which planet is known as the Red Planet?',
    correctAnswer: 'Mars',
    incorrectAnswers: ['Venus', 'Jupiter', 'Saturn'],
  },
];

const PracticeQuestionForm = () => {
  const { topicId } = useParams();
  const { state } = useLocation();  

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isAnswerWrong, setIsAnswerWrong] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const navigate = useNavigate();

  // If real data is provided, use it, otherwise use mock data
  const { lessonId, topicTitle, questions } = state || { questions: mockQuestions, topicTitle: "Mock Topic" };

  useEffect(() => {
    const fetchedQuestions = questions; // Either real data or mock data

    setAnsweredQuestions(new Array(fetchedQuestions.length).fill(false)); 

    // Shuffle only once
    const shuffled = fetchedQuestions.map(q => {
      const options = [...q.incorrectAnswers, q.correctAnswer];
      return {
        ...q,
        shuffledOptions: options.sort(() => Math.random() - 0.5)
      };
    });
    setShuffledQuestions(shuffled);
  }, [questions]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsConfirming(true);
  };

  const handleOptionConfirmation = () => {
    setIsConfirming(false);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (!currentQuestion) {
      console.error("Current question is undefined");
      return;
    }
  
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
  
    setAnsweredQuestions(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = true;
      return updatedAnswers;
    });
  
    if (isCorrect) {
      setIsCorrectAnswer(true);
      setCorrectAnswers(prevCorrectAnswers => {
        const updatedCorrectAnswers = prevCorrectAnswers + 1;
        if (currentQuestionIndex === shuffledQuestions.length - 1) {
          // Automatically redirect to the score page after answering all questions
          handleEndOfPractice();
        }
        return updatedCorrectAnswers;
      });
    } else {
      setIsAnswerWrong(true);
    }
  };

  const handleContinueAfterWrongAnswer = () => {
    setIsAnswerWrong(false);
    setIsConfirming(false);
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleEndOfPractice();
    }
  };

  const handleContinueAfterCorrectAnswer = () => {
    setIsCorrectAnswer(false);
    handleNextQuestion();
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleEndOfPractice();
    }
    setSelectedOption(null);
  };

  const handleEndOfPractice = () => {
    navigate('/scoreTest', {
      state: { 
        correctAnswers, 
        totalQuestions: shuffledQuestions.length,
        lessonId,  
        topicId    
      }
    });
  };

  // Show a loading animation if there are no questions
  if (!shuffledQuestions || shuffledQuestions.length === 0) {
    return <LoadingAnimations />;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isAnswered = answeredQuestions[currentQuestionIndex];
  const optionColors = ['#f94848', '#4cae4f', '#2874ba', '#f4cc3f'];

  return (
    <ThemeProvider theme={theme}>
      <div className='container'>
        <Box style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)' }}>
          <IconButton onClick={handlePrevQuestion}>
            <ArrowBackIosIcon style={iconStyle} />
          </IconButton>
        </Box>
        <Box style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
          <IconButton onClick={handleNextQuestion}>
            <ArrowForwardIosIcon style={iconStyle} />
          </IconButton>
        </Box>
        <Container maxWidth="md" sx={{ padding: '20px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', position: 'relative' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#181a52' }} gutterBottom>
            {topicTitle}
          </Typography>
          <Paper elevation={3} sx={{ height: '22.5rem', padding: '20px', backgroundColor: '#f6e6c3', marginTop: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '100px' }}>
              {currentQuestion.question}
            </Typography>
            <Typography variant="body1" sx={{ position: 'absolute', top: '10px', left: '10px' }}>
              Question {currentQuestionIndex + 1}
            </Typography>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '115%', marginTop: '20px' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {currentQuestion.shuffledOptions.map((option, idx) => (
                <OptionButton
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  sx={{
                    bgcolor: optionColors[idx % optionColors.length],
                    color: '#181a52',
                    minWidth: '100px',
                    marginBottom: '20px',
                    pointerEvents: isAnswered ? 'none' : 'auto',
                    opacity: isAnswered ? 0.5 : 1,
                  }}
                  disabled={isAnswered}
                >
                  {option}
                </OptionButton>
              ))}
            </Box>
          </Box>
          <PracticeAnswerModal
            open={isConfirming}
            handleClose={() => setIsConfirming(false)}
            message={{
              title: 'Confirm Answer',
              content: 'Are you sure?',
            }}
            handleConfirm={handleOptionConfirmation}
          />
          <PracticeAnswerModal
            open={isAnswerWrong}
            handleClose={() => setIsAnswerWrong(false)}
            message={{
              title: 'Wrong Answer',
              content: 'Let’s get some payback with the next question!',
            }}
            handleConfirm={handleContinueAfterWrongAnswer}
          />
          <CongratulatoryModal
            open={isCorrectAnswer}
            handleClose={() => setIsCorrectAnswer(false)}
            message={{
              title: 'Correct Answer',
              content: 'Amazing, You got it right!',
            }}
            handleConfirm={handleContinueAfterCorrectAnswer}
          />
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default PracticeQuestionForm;
