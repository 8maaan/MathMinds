import React, { useState } from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import '../PagesCSS/PracticeEvent.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TopicCard from './TopicCard';
import PracticeChoice from './PracticeChoice';

function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      className="slick-next"
      onClick={onClick}
      style={{ position: 'absolute', top: '50%', right: '-1.6rem', zIndex: 1 }} // Use rem for consistency
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
      style={{ position: 'absolute', top: '50%', left: '-1.6rem', zIndex: 1 }} // Use rem for consistency
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
}

function PracticeEvent() {
  const [showCard, setShowCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPracticeChoice, setShowPracticeChoice] = useState(false);
  const [topics] = useState([
    { id: 1, name: 'Topic 1' },
    { id: 2, name: 'Topic 2' },
    { id: 3, name: 'Topic 3' },
    { id: 4, name: 'Topic 4' },
    { id: 5, name: 'Topic 5' },
  ]);
  const [selectedTopic, setSelectedTopic] = useState(null);

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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          centerPadding: '2.5rem',
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
          centerPadding: '1.25rem',
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
    setShowPracticeChoice(false);
  };

  const openPracticeChoice = () => {
    console.log("Opening Practice Choice with topic:", selectedTopic);
    setShowPracticeChoice(true);
    setShowCard(false);
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

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <ReusableAppBar style={{ zIndex: 1400, position: 'relative' }}/>
        {showCard || showPracticeChoice ? (
          <div style={backdropStyle} onClick={handleCloseCard}></div>
        ) : null}
        <Box className="practiceEventContainer">
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#181a52', marginBottom: '2.5rem' }}>
            Choose a topic to practice
          </Typography>
          <div className="sliderContainer">
            <Slider {...settings}>
              {topics.map((topic, index) => (
                <Box key={topic.id} className="slideItem" onClick={() => handleTopicClick(topic)}>
                  <Paper elevation={3} className="topic" style={{ backgroundColor: generateBackgroundColor(index) }}>
                    <Typography variant="h5">{topic.name}</Typography>
                  </Paper>
                </Box>
              ))}
            </Slider>
            {showCard && selectedTopic && (
              <TopicCard
                topic={selectedTopic}
                onClose={handleCloseCard}
                onNext={openPracticeChoice}
                onPrev={() => console.log("Previous Clicked")}
              />
            )}
            {showPracticeChoice && selectedTopic && (
              <PracticeChoice topic={selectedTopic} onClose={handleCloseCard} />
            )}
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default PracticeEvent;






