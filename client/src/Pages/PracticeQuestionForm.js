// QuestionForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById } from '../API-Services/TopicAPI'; // Update the import path if necessary
import { getAllPractices } from '../API-Services/PracticeAPI';
import { Box, Button, Typography, Container, Paper, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import PracticeAnswerModal from '../ReusableComponents/PracticeAnswerModal'; // Import the PracticeAnswerModal component

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

const QuestionForm = () => {
  const { lessonId, topicId } = useParams();
  const [practices, setPractices] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [topicsState, setTopicsState] = useState({});
  const [topic, setTopic] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isAnswerWrong, setIsAnswerWrong] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const topicData = await getTopicById(topicId);
        console.log('Topic Data:', topicData); // Log the entire topicData object
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
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchPractices();
  }, [topicId]);

  const handleOptionClick = (questionKey, option) => {
    setSelectedOption(option);
    setIsConfirming(true);
  };

  const handleOptionConfirmation = (option) => {
    setIsConfirming(false);
    if (option !== currentQuestion.correctAnswer) {
      setIsAnswerWrong(true);
    } else {
      setTopicsState((prevState) => ({
        ...prevState,
        [currentQuestionIndex]: {
          ...prevState[currentQuestionIndex],
          selectedOption: option,
          checked: false,
          feedback: null,
        },
      }));
    }
  };

  const handleCheckAnswer = (questionKey, correctAnswer) => {
    const isCorrect = topicsState[questionKey]?.selectedOption === correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setTopicsState((prevState) => ({
        ...prevState,
        [questionKey]: {
          ...prevState[questionKey],
          feedback: 'Correct! Proceeding to the next question...',
          checked: true,
        },
      }));
      setTimeout(() => {
        handleNextQuestion();
      }, 2000); // Delay to show the message before moving to the next question
    } else {
      setIsConfirming(true); // Show the confirmation dialog for incorrect answer
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < practices.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/scoreTest');
    }
  };

  const handleContinueAfterWrongAnswer = () => {
    setIsAnswerWrong(false);
    setSelectedOption(null);
    setTopicsState((prevState) => ({
      ...prevState,
      [currentQuestionIndex]: {
        ...prevState[currentQuestionIndex],
        selectedOption: null,
        checked: false,
        feedback: null,
      },
    }));
  };

  if (!topic || practices.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = practices[currentQuestionIndex].practice_qa[1];
  const options = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];

  // Shuffle the options array
  const shuffledOptions = [...options];
  const optionColors = ['#f94848', '#4cae4f', '#2874ba', '#f4cc3f'];
  shuffledOptions.sort(() => Math.random() - 0.5);

  return (
    <ThemeProvider theme={theme}>
      <div className='container'>
        <ReusableAppBar />
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
            <Box sx={{ display: 'flex', flexWrap:'wrap', justifyContent: 'center', width: '100%' }}>
            {shuffledOptions.map((option, idx) => (
  <OptionButton
    key={option}
    onClick={() => handleOptionClick(currentQuestionIndex, option, currentQuestion.correctAnswer)}
    sx={{ bgcolor: optionColors[idx % optionColors.length], color: '#181a52', minWidth: '100px', marginBottom: '20px' }}
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
              content: 'Are you sure you want to select this option?',
            }}
            handleConfirm={() => handleOptionConfirmation(selectedOption)}
            handleContinue={isAnswerWrong ? handleContinueAfterWrongAnswer : null}
          />
          <PracticeAnswerModal
            open={isAnswerWrong}
            handleClose={() => setIsAnswerWrong(false)}
            message={{
              title: 'Wrong Answer',
              content: 'Your answer is wrong. Do you want to continue?',
            }}
            handleConfirm={handleContinueAfterWrongAnswer}
            handleContinue={null}
          />
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default QuestionForm;


