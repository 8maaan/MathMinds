import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, IconButton, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import PracticeAnswerModal from '../ReusableComponents/PracticeAnswerModal';
import CongratulatoryModal from '../ReusableComponents/CongratulatoryModal';
import LoadingAnimations from '../ReusableComponents/LoadingAnimations';
import { getRandomizedPracticeByTopicId } from '../API-Services/PracticeAPI';
import { keyframes } from '@mui/system';

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

// Bounce animation keyframes
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-0.5rem);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

// Styled OptionButton with bounce animation
const OptionButton = styled(Button)(({ colorScheme }) => ({
  height: 80,
  width: '45%',
  fontSize: '1rem',
  margin: '5px',
  color: 'white',
  borderRadius: '10px',
  backgroundColor: colorScheme.defaultColor,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: colorScheme.hoverColor,
    animation: `${bounce} 1s infinite`,
  },
  '&:disabled': {
    backgroundColor: colorScheme.disabledColor
  }
}));

const iconStyle = {
  fontSize: '60px',
  padding: '60px',
  color: '#ffb100'
};

const PracticeQuestionForm = () => {
  const { topicId } = useParams();
  const { state } = useLocation();
  const { lessonId, topicTitle } = state || {};
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isAnswerWrong, setIsAnswerWrong] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const result = await getRandomizedPracticeByTopicId(topicId, 10);
      if (result.success) {
        const fetchedQuestions = result.data.map(q => ({
          ...q,
          shuffledOptions: [...q.incorrectAnswers.filter(ans => ans), q.correctAnswer].sort(() => Math.random() - 0.5)
        }));
        setShuffledQuestions(fetchedQuestions);
        setAnsweredQuestions(new Array(fetchedQuestions.length).fill(false));
      } else {
        console.error(result.message);
      }
    };

    fetchQuestions();
  }, [topicId]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsConfirming(true);
  };

  const handleOptionConfirmation = () => {
    setIsConfirming(false);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
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

  const optionColors = [
    { defaultColor: "#f94848", hoverColor: "#d13d3d", disabledColor: "#bf3737" },
    { defaultColor: "#4cae4f", hoverColor: "#429645", disabledColor: "#3a853d" },
    { defaultColor: "#2874ba", hoverColor: "#2265a3", disabledColor: "#1d5991" },
    { defaultColor: "#f4cc3f", hoverColor: "#dbb739", disabledColor: "#c7a634" }
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className='container' style={{ paddingRight: '1rem', overflow:'hidden'}}>
        {/* Navigation Buttons */}
        <Box sx={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)' }}>
          <IconButton onClick={handlePrevQuestion}>
            <ArrowBackIosIcon style={iconStyle} />
          </IconButton>
        </Box>
        <Box sx={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
          <IconButton onClick={handleNextQuestion}>
            <ArrowForwardIosIcon style={iconStyle} />
          </IconButton>
        </Box>

        {/* Main Container */}
        <Container maxWidth="md" sx={{paddingRight: '1rem',backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '70px', position: 'relative' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#181a52' }} gutterBottom>
            {topicTitle} - Practice
          </Typography>

          <Tooltip title='Exit'>
            <IconButton 
              onClick={() => navigate(`/practice-event/${lessonId}/${topicId}`)}
              sx={{ position: 'absolute', top: '50px', left: '1px', zIndex: 10 }}
            >
              <ExitToAppIcon sx={{ fontSize: '1.8rem' }} />
            </IconButton>
          </Tooltip>

          <Paper elevation={3} sx={{ height: '22.5rem', padding: '20px', backgroundColor: '#f6e6c3', marginTop: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '100px' }}>
              {currentQuestion.question}
            </Typography>
            <Typography variant="body1" sx={{ position: 'absolute', top: '10px', center: '10px', fontWeight:'bold' }}>
              Question #{currentQuestionIndex + 1}
            </Typography>
          </Paper>

          {/* Answer Options */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '20px', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {currentQuestion.shuffledOptions.map((option, idx) => (
                <OptionButton
                  key={idx}
                  colorScheme={optionColors[idx % optionColors.length]}
                  onClick={() => handleOptionClick(option)}
                  disabled={isAnswered}
                  sx={{
                    pointerEvents: isAnswered ? 'none' : 'auto',
                    opacity: isAnswered ? 0.5 : 1,
                    flexGrow: 1, 
                    flexBasis: 'calc(50% - 10px)', 
                    '@media (max-width: 600px)': {
                       flexBasis: '100%', 
                    },
                  }}
                >
                  {option}
                </OptionButton>
              ))}
            </Box>
          </Box>

          {/* Modals */}
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


