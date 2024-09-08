import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from 'react-slick';
import '../PagesCSS/PracticeEvent.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TopicCard from './TopicCard';
import PracticeChoice from './PracticeChoice';
import { getLessonById } from '../API-Services/LessonAPI';
import { firebaseRTDB } from '../Firebase/firebaseConfig'
import { ref, set, get } from "firebase/database";
import { UserAuth } from '../Context-and-routes/AuthContext';
import { useUserInfo } from '../ReusableComponents/useUserInfo';
import { getRandomizedPracticeByTopicId } from '../API-Services/PracticeAPI';

function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      className="slick-next"
      onClick={onClick}
      style={{ position: 'absolute', top: '50%', right: '-1.6rem', zIndex: 1 }}
    >
      <ArrowForwardIosIcon />
    </IconButton>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      className="slick-prev"
      onClick={onClick}
      style={{ position: 'absolute', top: '50%', left: '-1.6rem', zIndex: 1 }}
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
}

function PracticeEvent() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [topics, setTopics] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showPracticeChoice, setShowPracticeChoice] = useState(false);

  const navigateTo = useNavigate();
  const { user } = UserAuth();
  const { userData } = useUserInfo(user ? user.uid : null);



  const theme = createTheme({
    typography: {
      fontFamily: 'Poppins',
      color: '#181a52',
    },
    palette: {
      text: {
        primary: '#f5f5f5'
      }
    }
  });

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { success, data } = await getLessonById(lessonId);
        if (success) {
          setLesson(data);
          setTopics(data.lessonTopics || []);
        } else {
          throw new Error("Failed to fetch lesson");
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode:  1,
    centerPadding: '0px',
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: topics.length > 1 ? 2 : 1,
          centerMode: topics.length > 1,
          vertical: true,
          verticalSwiping: true,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: topics.length > 1 ? 1 : 1,
          centerMode: topics.length > 1,
          vertical: true,
          verticalSwiping: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          vertical: true,
          verticalSwiping: true,
          centerMode: false,
        },
      },
    ],
  };
  

  const handleTopicClick = (topic) => {
    if (!isDragging) {
      setSelectedTopic(topic);
      setShowCard(true);
    }
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };


  const handleStart = () => {
    setShowPracticeChoice(true);
    setShowCard(false);
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  

  const handleModeChoice = async (choice, roomCode = null) => {
    console.log("Mode choice:", choice);
  
    if (!user) {
      console.error("User not authenticated");
      return;
    }
  
    console.log("Authenticated user:", user.uid);
  
    if (choice === 'SOLO') {
      console.log(selectedTopic.topicTitle, selectedTopic.topicId);
      try {
        // Fetch randomized practice questions by topicId
        const { success, data } = await getRandomizedPracticeByTopicId(selectedTopic.topicId);
        console.log("Raw API response for questions:", data);
        console.log("Fetched Question:", data);
        if (success) {
          // Pass the questions to questionForm through the state
          navigateTo(`/questionForm/${selectedTopic.topicId}`, { state: 
            { 
              topicTitle: selectedTopic.topicTitle, 
              questions: data, 
              lessonId,
              topicId: selectedTopic.topicId
            } });
        } else {
          console.error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching randomized practice questions:", error);
      }
    } else if (choice === 'CREATE ROOM') {
      const generatedRoomCode = generateRoomCode();
      console.log("Generated room code:", generatedRoomCode);
      const roomRef = ref(firebaseRTDB, `rooms/${generatedRoomCode}`);
      
      try {
        console.log("Attempting to create room...");
        await set(roomRef, {
          host: user.uid,
          topicId: selectedTopic.topicId,
          topicTitle: selectedTopic.topicTitle,
          players: {
            [user.uid]: { name: userData.fname + " " + userData.lname || "Host" }
          },
          state: "waiting",
          currentQuestion: null,
          scores: {},
        });
        console.log('Room created successfully');
        navigateTo(`/lobby/${generatedRoomCode}`, { state: { isHost: true } });
      } catch (error) {
        console.error("Error creating room:", error);
        console.error("Error details:", error.message);
        // You might want to show an error message to the user here
      }
    } else if (choice === 'JOIN_ROOM') {
      if (!roomCode) {
        console.error("Room code is required to join a room");
        return;
      }
      const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);
      try {
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          if (roomData.topicId === selectedTopic.topicId) {
            await set(ref(firebaseRTDB, `rooms/${roomCode}/players/${user.uid}`), {
              name: userData.fname + " " + userData.lname || "Player"
            });
            navigateTo(`/lobby/${roomCode}`, { state: { isHost: false } });
          } else {
            throw new Error("Room topic does not match selected topic");
          }
        } else {
          throw new Error("Room does not exist");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        throw error; // Rethrow the error so it can be caught in the PracticeChoice component
      }
    }
  }

  const generateBackgroundColor = (index) => {
    const colorVariations = [
      { hue: 0, saturationRange: [70, 90], lightnessRange: [50, 70] },
      { hue: 210, saturationRange: [40, 60], lightnessRange: [50, 70] },
      { hue: 120, saturationRange: [40, 60], lightnessRange: [40, 60] },
      { hue: 270, saturationRange: [40, 60], lightnessRange: [40, 60] },
      { hue: 30, saturationRange: [70, 90], lightnessRange: [50, 70] },
      { hue: 60, saturationRange: [60, 80], lightnessRange: [50, 70] }
    ];
    const variationCount = colorVariations.length;
    const hueIndex = index % variationCount;
    const hueVariation = colorVariations[hueIndex];
    const saturationStep = (hueVariation.saturationRange[1] - hueVariation.saturationRange[0]) / variationCount;
    const lightnessStep = (hueVariation.lightnessRange[1] - hueVariation.lightnessRange[0]) / variationCount;
    const saturation = hueVariation.saturationRange[0] + saturationStep * (index % variationCount);
    const lightness = hueVariation.lightnessRange[0] + lightnessStep * (index % variationCount);
    return `hsl(${hueVariation.hue}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
  };

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1200
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        {/* <ReusableAppBar style={{ zIndex: 1400, position: 'relative' }} /> */}
        {showCard ? (
          <div style={backdropStyle} onClick={handleCloseCard}></div>
        ) : null}
        <Box className="practiceEventContainer">
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#181a52', marginBottom: '2.5rem' }}>
            Choose a topic to practice
          </Typography>
          <div className="sliderContainer">

            {showPracticeChoice && <PracticeChoice onClose={() => setShowPracticeChoice(false)} modeChoice={handleModeChoice} />} 
            
            <Slider {...settings}>
              {topics.length <= 3 ? (
                Array.from({ length: 4 - topics.length }).map((_, index) => (
                  <Box key={`default-${index}`} className="slideItem">
                    <Paper elevation={3} className="topic" style={{ backgroundColor: '#808080' }}>
                      <Typography variant="h5" style={{ fontSize: '2rem', fontWeight: 'bold' }}>TBA</Typography>
                    </Paper>
                  </Box>
                ))
              ) : null}
              {topics.map((topic, index) => (
                <Box key={topic.id} className="slideItem" onClick={() => handleTopicClick(topic)}>
                  <Paper elevation={3} className="topic" style={{ backgroundColor: generateBackgroundColor(index) }} sx={{'&hover':{cursor:'pointer'}}}>
                    <Typography variant="h5" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{topic.topicTitle}</Typography>
                  </Paper>
                </Box>
              ))}
            </Slider>
            {showCard && selectedTopic && (
              <TopicCard
                topic={selectedTopic}
                onClose={handleCloseCard}
                onStart={handleStart}
              />
            )}
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default PracticeEvent;
