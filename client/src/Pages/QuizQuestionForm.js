import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, Modal, IconButton, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { getAllLessonsQuiz, getRandomizedLessonQuizByLessonQuizId } from '../API-Services/LessonQuizAPI';
import { getLessonById } from '../API-Services/LessonAPI';
import { checkUserBadge, awardBadge } from '../API-Services/UserAPI'; // Import the new functions
import { UserAuth } from '../Context-and-routes/AuthContext'; // Assuming you have access to user context here
import Confetti from 'react-confetti'; // Import the Confetti component
import { useWindowSize } from 'react-use';

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
  borderRadius: '10px',
  '@keyframes bounce': {
    '0%, 100%': {
      transform: 'translateY(0)',
      'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
    },
    '50%': {
      transform: 'translateY(-0.5rem)',
      'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
  
  '&:hover': {
    animation: 'bounce 1s infinite', // apply the bounce animation on hover
  },
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
  const questionFontSize = '3vmin';
  const optionFontSize= '2.5vmin';
  const [lessonTitle, setLessonTitle] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const optionsRef = useRef([]);
  const [lessonBadgeImageUrl, setLessonBadgeImageUrl] = useState('');
  const [shuffledOptions, setShuffledOptions] = useState([]);

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
    const fetchLessonDetails = async () => {
      try {
        const lessonResponse = await getLessonById(lessonId);
        if (lessonResponse.success) {
          setLessonBadgeImageUrl(lessonResponse.data.lessonBadgeImageUrl); // Store the badge image URL
        } else {
          console.error("Failed to fetch lesson details");
        }
      } catch (error) {
        console.error("Error fetching lesson details:", error);
      }
    };
  
    fetchLessonDetails();
  }, [lessonId]);  
  
  useEffect(() => {
    if (quiz && quiz[currentQuestionIndex]) {
      // Shuffle options only once per question load
      const currentQuestion = quiz[currentQuestionIndex];
      const options = shuffleArray([...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer]);
      setShuffledOptions(options);
    }
  }, [quiz, currentQuestionIndex]);

  /*useEffect(() => {
    if (quiz && currentQuestionIndex === 0) {
      adjustFontSizes();
    }
  }, [quiz]);

  const adjustFontSizes = () => {
    const maxFontSize = 2; // Maximum font size in rem
    const minFontSize = 1.7; // Minimum font size in rem
    const maxHeight = 180; // Adjusted max height for question text in pixels
    const maxWidth = 800; // Maximum width for question text in pixels
  
    if (questionRef.current) {
      let fontSize = maxFontSize;
      questionRef.current.style.fontSize = `${fontSize}rem`;
      questionRef.current.style.wordWrap = 'break-word';
      questionRef.current.style.maxWidth = `${maxWidth}px`; // Set maximum width
  
      // Gradually decrease the font size if the text overflows height or width
      while (
        fontSize > minFontSize &&
        (questionRef.current.scrollHeight > maxHeight || questionRef.current.scrollWidth > maxWidth)
      ) {
        fontSize -= 0.1;
        questionRef.current.style.fontSize = `${fontSize}rem`;
      }
    }
  };*/

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const questions = quiz;
  
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  //const options = shuffledOptions;
//const options = shuffleArray([...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer]);
  
  const optionColors = [
    { defaultColor: "#f94848", hoverColor: "#d13d3d"},
    { defaultColor: "#4cae4f", hoverColor: "#429645"},
    { defaultColor: "#2874ba", hoverColor: "#2265a3"},
    { defaultColor: "#f4cc3f", hoverColor: "#dbb739"}
  ];

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
      setShowConfetti(true); //confetti
    } else {
      setBadgeNotification(true); // Show notification even if failed
    }
  };

  const handleBadgeNotificationClose = () => {
    setBadgeNotification(false);
    setShowConfetti(false);
    navigate('/lessons', { state: { lessonId: parseInt(lessonId, 10), score } });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='container'>

      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1400, pointerEvents: 'none' }}>
          <Confetti width={width} height={height} recycle={false} gravity={0.2}/>
        </div>
      )}
        
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

          <Paper elevation={3} sx={{ height: '22.5rem', padding: '20px', backgroundColor: '#f6e6c3', marginTop: '40px', width: {md:'100%', xs:'90%'}, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', borderRadius:'15px', wordWrap: 'break-word' }}>
            <Typography sx={{ textAlign: 'center', marginTop: '110px', fontSize: {md: questionFontSize, xs:'4.5vmin'}, padding:'5%' }}>
              {currentQuestion.question}
            </Typography>
            <Typography variant="body1" sx={{ position: 'absolute', top: '10px', center: '10px', fontWeight:'bold' }}>
              Question #{currentQuestionIndex + 1}
            </Typography>
          </Paper>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '110%', marginTop: '20px' }}>
            {shuffledOptions.map((option, idx) => (
              option && ( // This checks if the option is not falsy (null, undefined, empty string)
                <OptionButton
                  ref={(el) => optionsRef.current[idx] = el}
                  key={option} //`${currentQuestionIndex}-${idx}`
                  sx={{
                    bgcolor: optionColors[idx % 4/*optionColors.length*/].defaultColor, // Apply the default color
                    color: '#fff', // Keep text color white for better contrast
                    minWidth: '100px',
                    marginBottom: '20px',
                    fontSize: {md: optionFontSize, xs:'4.5vmin'},
                    '&:hover': {
                      bgcolor: optionColors[idx % 4/*optionColors.length*/].hoverColor // Apply the hover color
                    }
                  }}
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
          //BackdropProps={{ invisible: true }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {md:400, xs:300},
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            radius: '20px',
            textAlign: 'center',
            borderRadius:'15px'
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
          //BackdropProps={{ invisible: true }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {md:400, xs:300},
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '15px',
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
                <img src={lessonBadgeImageUrl} alt="Badge" style={{ width: '150px', margin: '20px 0' }} />              </>
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
