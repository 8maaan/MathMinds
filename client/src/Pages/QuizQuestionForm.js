import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, Modal, IconButton, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { getAllLessonsQuiz, getRandomizedLessonQuizByLessonQuizId } from '../API-Services/LessonQuizAPI';
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
  fontSize: '50px',
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
  const [questionFontSize, setQuestionFontSize] = useState('1.5rem');
  const [optionFontSize, setOptionFontSize] = useState('1rem');
  const [lessonTitle, setLessonTitle] = useState('');

  const questionRef = useRef(null);
  const optionsRef = useRef([]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Fetch all quizzes related to the lesson
        const allQuizzesResponse = await getAllLessonsQuiz(lessonId);
        
        if (allQuizzesResponse.success) {
          // Find the quiz with the specific lessonQuizId
          const lessonQuiz = allQuizzesResponse.data.find(quiz => quiz.lessonQuizId === parseInt(quizId, 10));
          
          if (lessonQuiz) {
            // Set the lesson title
            setLessonTitle(lessonQuiz.lessonTitle); // Store the lesson title

            // Fetch randomized quiz questions using the lessonQuizId
            const randomizedQuizResponse = await getRandomizedLessonQuizByLessonQuizId(lessonQuiz.lessonQuizId);
            
            if (randomizedQuizResponse.success) {
              setQuiz(randomizedQuizResponse.data);
            } else {
              console.error("Failed to fetch randomized quiz questions");
            }
          } else {
            console.error("Quiz not found with the provided quizId");
          }
        } else {
          console.error("Failed to fetch all lessons quiz");
        }
      } catch (error) {
        console.error("Error fetching the quiz:", error);
      }
    };
    
    fetchQuiz();
  }, [lessonId, quizId]);

  useEffect(() => {
    adjustFontSizes();
  }, [currentQuestionIndex]);

  const adjustFontSizes = () => {
    const maxFontSize = 2; // Maximum font size in rem
    const minFontSize = 1; // Minimum font size in rem
    const maxHeight = 100; // Max height for question text in pixels
    const baseLength = 50; // Base length of the question text
  
    if (questionRef.current) {
      let fontSize = maxFontSize;
      const questionLength = currentQuestion.question.length;
  
      // Adjust font size based on text length
      fontSize = Math.max(minFontSize, Math.min(maxFontSize, (baseLength / questionLength) * maxFontSize));
  
      questionRef.current.style.fontSize = `${fontSize}rem`;
  
      // Ensure the text fits within the container
      while (fontSize > minFontSize && questionRef.current.scrollHeight > maxHeight) {
        fontSize -= 0.1;
        questionRef.current.style.fontSize = `${fontSize}rem`;
      }
    }
  
    if (optionsRef.current.length > 0) {
      optionsRef.current.forEach((option) => {
        if (option) {
          option.style.fontSize = `${optionFontSize}rem`;
        }
      });
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const questions = quiz;
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const options = shuffleArray([...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer]);
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
            {lessonTitle} - Final Assessment
          </Typography>

          <Tooltip title='Exit'>
            <IconButton 
              onClick={() => navigate('/lessons')} // Add a function to navigate back when clicked
              sx={{ position: 'absolute', top: '115px', left: '1px' }} // Styling for absolute positioning outside Paper
            >
              <ExitToAppIcon sx={{ fontSize: '1.8rem' }} />
            </IconButton>
          </Tooltip>

          <Paper elevation={3} sx={{ height: '22.5rem', padding: '20px', backgroundColor: '#f6e6c3', marginTop: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <Typography ref={questionRef} variant="h6" sx={{ textAlign: 'center', marginTop: '120px', fontSize: questionFontSize }}>
              {currentQuestion.question}
            </Typography>
            <Typography variant="body1" sx={{ position: 'absolute', top: '10px', center: '10px' }}>
              Question {currentQuestionIndex + 1}
            </Typography>
          </Paper>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
            {options.map((option, idx) => (
              option && ( // This checks if the option is not falsy (null, undefined, empty string)
                <OptionButton
                  ref={(el) => optionsRef.current[idx] = el}
                  key={`${currentQuestionIndex}-${idx}`}
                  sx={{ bgcolor: optionColors[idx % optionColors.length], color: '#181a52', minWidth: '100px', marginBottom: '20px', fontSize: optionFontSize }}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                >
                  {option}
                </OptionButton>
              )
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
                <img src="https://i.pinimg.com/originals/e9/93/d1/e993d191d03335fd09a1987db3f8d39a.gif" alt="Badge" style={{ width: '350px', margin: '20px 0' }} />
              </>
            ) : (
              <>
                <Typography id="badge-modal-title" variant="h6" component="h2" sx={{color: '#181a52'}}>
                  Quiz Result
                </Typography>
                <Typography id="badge-modal-description" sx={{ mt: 2, color: '#181a52' }}>
                  {score >= questions.length * 0.6 ? "You've passed the quiz!" : "Don't worry, you can always try again! Review the material and come back stronger!"}
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
