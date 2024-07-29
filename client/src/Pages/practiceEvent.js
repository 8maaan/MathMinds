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
      className="slick-arrow slick-next"
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        right: '-20px', // Adjust this value to position the arrow correctly
        transform: 'translateY(-50%)',
        zIndex: 2,
        backgroundColor: 'transparent', // Make the background transparent
        borderRadius: '50%',
        padding: '0.5rem', // Add padding for better click area
      }}
    >
      <ArrowForwardIosIcon style={{ color: 'black' }} />
    </IconButton>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      className="slick-arrow slick-prev"
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: '-15px', // Adjust this value to position the arrow correctly
        transform: 'translateY(-50%)',
        zIndex: 2,
        backgroundColor: 'transparent', // Make the background transparent
        borderRadius: '50%',
        padding: '0.5rem', // Add padding for better click area
      }}
    >
      <ArrowBackIosIcon style={{ color: 'black' }} />
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
        primary: '#181a52',
      },
    },
  });

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { success, data } = await getLessonById(lessonId);
        if (success) {
          setLesson(data);
          setTopics(data.lessonTopics || []);
        } else {
          throw new Error('Failed to fetch lesson');
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
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
    centerMode: true,
    centerPadding: '0px',
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '10px',
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
      <div className="practice-background">
      <div className="outerContainer">
        <ReusableAppBar style={{ zIndex: 1400, position: 'relative' }} />
        {showCard ? (
          <div style={backdropStyle} onClick={handleCloseCard}></div>
        ) : null}
        <Box className="practiceEventContainer" sx={{ padding: '1rem' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#181a52', marginBottom: '1.5rem', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Choose a topic to practice
          </Typography>
          <div className="sliderWrapper" style={{ position: 'relative' }}>
            {showPracticeChoice && <PracticeChoice onClose={() => setShowPracticeChoice(false)} />}
            <Slider {...settings}>
              {topics.length <= 3 ? (
                Array.from({ length: 4 - topics.length }).map((_, index) => (
                  <Box key={`default-${index}`} className="slideItem">
                    <Paper elevation={3} className="topic" style={{ backgroundColor: '#808080' }}>
                      <Typography variant="h5" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>TBA</Typography>
                    </Paper>
                  </Box>
                ))
              ) : null}
              {topics.map((topic, index) => (
                <Box key={topic.id} className="slideItem" onClick={() => handleTopicClick(topic)}>
                  <Paper elevation={3} className="topic" style={{ backgroundColor: generateBackgroundColor(index) }}>
                    <Typography variant="h5" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{topic.topicTitle}</Typography>
                  </Paper>
                </Box>
              ))}
            </Slider>
            <NextArrow onClick={() => document.querySelector('.slick-next').click()} />
            <PrevArrow onClick={() => document.querySelector('.slick-prev').click()} />
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
      </div>
    </ThemeProvider>
  );
}

export default PracticeEvent;



