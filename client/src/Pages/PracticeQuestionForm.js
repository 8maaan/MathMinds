import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById } from '../API-Services/TopicAPI';
import { getAllPractices } from '../API-Services/PracticeAPI';
import { Box, Button, Typography, Container, Paper, IconButton, Grid, useMediaQuery } from '@mui/material';
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
  height: '6rem',
  width: '100%',
  fontSize: '1rem',
  margin: '5px',
  color: 'white',
  borderRadius: '10px'
});

const PracticeQuestionForm = () => {
  const { topicId } = useParams();
  const [practices, setPractices] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [topic, setTopic] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isAnswerWrong, setIsAnswerWrong] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isEndOfPractice, setIsEndOfPractice] = useState(false);

  const navigate = useNavigate();

  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const arrowSize = isExtraSmallScreen ? '30px' : isSmallScreen ? '40px' : isMediumScreen ? '50px' : '60px';

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const topicData = await getTopicById(topicId);
        console.log('Topic Data:', topicData);
        setTopic(topicData.data);
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    };
    fetchTopic();
  }, [topicId]);

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        const fetchResult = await getAllPractices();
        if (fetchResult.success) {
          const filteredPractices = fetchResult.data.filter(practice => practice.topic.topicId === parseInt(topicId, 10));
          setPractices(filteredPractices);
          setTotalQuestions(filteredPractices.length);
          setAnsweredQuestions(new Array(filteredPractices.length).fill(false));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchPractices();
  }, [topicId]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsConfirming(true);
  };

  const handleOptionConfirmation = () => {
    setIsConfirming(false);
    const currentPractice = practices[currentQuestionIndex];
    if (!currentPractice || !currentPractice.practice_qa) {
      console.error("Practice data is missing or invalid");
      return;
    }

    const currentQuestionData = currentPractice.practice_qa;
    const questionKeys = Object.keys(currentQuestionData);
    const currentQuestionKey = questionKeys[0]; // Assuming only one question per practice for now
    const currentQuestion = currentQuestionData[currentQuestionKey];
  
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

  const handleCancelWrongAnswer = () => {
    setIsAnswerWrong(false);
    setIsEndOfPractice(true);
  };

  const handleEndOfPractice = () => {
    setIsEndOfPractice(false);
    navigate('/scoreTest', { state: { correctAnswers, totalQuestions } });
  };

  const handleContinuePractice = () => {
    setIsEndOfPractice(false);
    navigate('/practice');
  };

  if (!topic || practices.length === 0) {
    return <LoadingAnimations/>
  }

  const currentPractice = practices[currentQuestionIndex];
  if (!currentPractice || !currentPractice.practice_qa) {
    return null;
  }

  const currentQuestionData = currentPractice.practice_qa;
  const questionKeys = Object.keys(currentQuestionData);
  const currentQuestionKey = questionKeys[0]; 
  const currentQuestion = currentQuestionData[currentQuestionKey];

  if (!currentQuestion) {
    return null;
  }

  const options = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
  const optionColors = ['#f94848', '#4cae4f', '#2874ba', '#f4cc3f'];

  const isAnswered = answeredQuestions[currentQuestionIndex];

  return (
    <ThemeProvider theme={theme}>
      <Container className='container' sx={{ mt: 4, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-start', position: 'relative' }}>
            <IconButton onClick={handlePrevQuestion} sx={{
              fontSize: arrowSize,
              color: '#ffb100',
              position: 'fixed',
              left: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}>
              <ArrowBackIosIcon fontSize="inherit" />
            </IconButton>
          </Grid>
          <Grid item xs={10}>
            <Box sx={{ padding: '20px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#181a52', textAlign: 'center' }} gutterBottom>
                {topic.topicTitle}
              </Typography>
              <Paper elevation={3} sx={{ flexGrow: 1, minHeight: '40vh', padding: '20px', backgroundColor: '#f6e6c3', marginTop: '20px', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  {currentQuestion.question}
                </Typography>
                <Typography variant="body1" sx={{ position: 'absolute', top: '10px', left: '10px' }}>
                  Question {currentQuestionIndex + 1}
                </Typography>
              </Paper>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '94%', marginTop: '20px' }}>
                {shuffledOptions.map((option, idx) => (
                  <OptionButton
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    sx={{
                      bgcolor: optionColors[idx % optionColors.length],
                      color: '#181a52',
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
          </Grid>
          <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            <IconButton onClick={handleNextQuestion} sx={{
              fontSize: arrowSize,
              color: '#ffb100',
              position: 'fixed',
              right: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}>
              <ArrowForwardIosIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
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
          handleClose={handleCancelWrongAnswer}
          message={{
            title: 'Wrong Answer',
            content: 'lets get some payback with the next Question!',
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
    </ThemeProvider>
  );
};

export default PracticeQuestionForm;
