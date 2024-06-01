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
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import TopicCard from './TopicCard';
import PracticeChoice from './PracticeChoice';
import { getLessonById } from '../API-Services/LessonAPI';

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
  const [showPracticeChoice, setShowPracticeChoice] = useState(true);
  const navigate = useNavigate();

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
    slidesToShow: topics.length > 1 ? 3 : 1,
    slidesToScroll: 1,
    centerMode: topics.length > 1,
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

  const handleStart = (lessonId, topicId) => {
    navigate(`/questionForm/${lessonId}/${topicId}`);
  };

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

  useEffect(() => {
    setShowPracticeChoice(true); 
  }, []); 

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <ReusableAppBar style={{ zIndex: 1400, position: 'relative' }} />
        {showCard ? (
          <div style={backdropStyle} onClick={handleCloseCard}></div>
        ) : null}
        <Box className="practiceEventContainer">
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#181a52', marginBottom: '2.5rem' }}>
            Choose a topic to practice
          </Typography>
          <div className="sliderContainer">
            {showPracticeChoice && <PracticeChoice onClose={() => setShowPracticeChoice(false)} />}
            <Slider {...settings}>
              {topics.length <= 3 ? (
                Array.from({ length: 4 - topics.length }).map((_, index) => (
                  <Box key={`default-${index}`} className="slideItem">
                    <Paper elevation={3} className="topic" style={{ backgroundColor: '#808080' }}>
                      <Typography variant="h5" style={{ fontSize: '2rem', fontWeight: 'bold' }}>No topics yet</Typography>
                    </Paper>
                  </Box>
                ))
              ) : null}
              {topics.map((topic, index) => (
                <Box key={topic.id} className="slideItem" onClick={() => handleTopicClick(topic)}>
                  <Paper elevation={3} className="topic" style={{ backgroundColor: generateBackgroundColor(index) }}>
                    <Typography variant="h5" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{topic.topicTitle}</Typography>
                  </Paper>
                </Box>
              ))}
            </Slider>
            {showCard && selectedTopic && (
              <TopicCard
                lessonId={lessonId}
                topic={selectedTopic}
                onClose={handleCloseCard}
                onNext={handleStart}
              />
            )}
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default PracticeEvent;
