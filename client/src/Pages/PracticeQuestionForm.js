import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPracticeQuestionsByPracticeId } from '../API-Services/PracticeAPI';
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

const PracticeQuestionForm = () => {
  const { practiceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isAnswerWrong, setIsAnswerWrong] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isEndOfPractice, setIsEndOfPractice] = useState(false);

  const fetchQuestions = async (id) => {
    console.log("Fetching questions for Practice ID:", id);
    const result = await getPracticeQuestionsByPracticeId(id);
    if (result.success) {
      setQuestions(result.data);
      setTotalQuestions(result.data.length);
      setAnsweredQuestions(new Array(result.data.length).fill(false));
    } else {
      console.error("Failed to fetch questions:", result.error);
    }
  };

  useEffect(() => {
    const practiceIdFromState = location.state?.practiceId || practiceId;
    console.log("Fetching questions for Practice ID:", practiceIdFromState);
    
    if (practiceIdFromState) {
      fetchQuestions(practiceIdFromState);
    } else {
      console.error("Practice ID is undefined");
    }
  }, [practiceId, location.state]);

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("Fetching questions for Practice ID:", practiceId);
      const result = await getPracticeQuestionsByPracticeId(practiceId);
      if (result.success) {
        setQuestions(result.data);
        setTotalQuestions(result.data.length);
        setAnsweredQuestions(new Array(result.data.length).fill(false));
      } else {
        console.error("Failed to fetch questions:", result.error);
      }
    };

    fetchQuestions();
  }, [practiceId]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsConfirming(true);
  };

  const handleOptionConfirmation = () => {
    setIsConfirming(false);
    const currentQuestion = questions[currentQuestionIndex];

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
        if (currentQuestionIndex === totalQuestions - 1) {
          setIsEndOfPractice(true);
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
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsEndOfPractice(true);
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
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsEndOfPractice(true);
    }
    setSelectedOption(null);
  };

  const handleEndOfPractice = () => {
    setIsEndOfPractice(false);
    navigate('/scoreTest', { state: { correctAnswers, totalQuestions } });
  };

  const handleContinuePractice = () => {
    setIsEndOfPractice(false);
    navigate('/practice');
  };

  if (questions.length === 0) {
    return <LoadingAnimations />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  const options = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
  const optionColors = ['#f94848', '#4cae4f', '#2874ba', '#f4cc3f'];

  const isAnswered = answeredQuestions[currentQuestionIndex];

  // font size
  const maxTextLength = Math.max(
    currentQuestion.question.length,
    ...options.map(option => option.length)
  );

  const fontSize = maxTextLength > 100
    ? '1rem' 
    : maxTextLength > 50
      ? '1.25rem'
      : '1.5rem'; 

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
            Practice Questions
          </Typography>
          <Paper elevation={3} sx={{ height: '22.5rem', padding: '20px', backgroundColor: '#f6e6c3', marginTop: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '100px', fontSize: fontSize }}>
              {currentQuestion.question}
            </Typography>
            <Typography variant="body1" sx={{ position: 'absolute', top: '10px', left: '10px' }}>
              Question {currentQuestionIndex + 1}
            </Typography>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '115%', marginTop: '20px' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {shuffledOptions.map((option, idx) => (
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
                    fontSize: fontSize 
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
            handleClose={handleEndOfPractice}
            message={{
              title: 'Wrong Answer',
              content: 'Let\'s try the next question!',
            }}
            handleConfirm={handleContinueAfterWrongAnswer}
          />
          <CongratulatoryModal
            open={isCorrectAnswer}
            handleClose={() => setIsCorrectAnswer(false)}
            message={{
              title: 'Correct Answer',
              content: 'Great job!',
            }}
            handleConfirm={handleContinueAfterCorrectAnswer}
          />
          <PracticeAnswerModal
            open={isEndOfPractice}
            handleEndOfPractice={handleEndOfPractice}
            message={{
              title: 'End of Practice',
              content: 'Would you like to continue practicing?',
            }}
            handleContinuePractice={handleContinuePractice}
            isEndOfPractice
          />
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default PracticeQuestionForm;
