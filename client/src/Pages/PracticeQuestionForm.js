
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById } from '../API-Services/TopicAPI';
import { getAllPractices } from '../API-Services/PracticeAPI';
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
    const currentQuestion = practices[currentQuestionIndex].practice_qa[1];
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

  const currentQuestion = practices[currentQuestionIndex].practice_qa[1];
  const options = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
  const optionColors = ['#f94848', '#4cae4f', '#2874ba', '#f4cc3f'];

  const isAnswered = answeredQuestions[currentQuestionIndex];

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
            {topic.topicTitle}
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
      </div>
    </ThemeProvider>
  );
};

export default PracticeQuestionForm;

