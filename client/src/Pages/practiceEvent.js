import React, { useState } from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import '../PagesCSS/PracticeEvent.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TopicCard from './TopicCard';

function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      className="slick-next"
      onClick={onClick}
      style={{ position: 'absolute', top: '50%', right: '-25px', zIndex: 1 }}
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
      style={{ position: 'absolute', top: '50%', left: '-25px', zIndex: 1 }}
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
}

function PracticeEvent() {
    const [showCard, setShowCard] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [topics] = useState([
      { id: 1, name: 'Topic 1' },
      { id: 2, name: 'Topic 2' },
      { id: 3, name: 'Topic 3' },
      { id: 4, name: 'Topic 4' },
      { id: 5, name: 'Topic 5' },
    ]); // Starting with a default list of topics
    const [selectedTopic, setSelectedTopic] = useState(null);  // Added state for the selected topic

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
                centerPadding: '40px',
              },
            },
            {
              breakpoint: 960,
              settings: {
                slidesToShow: 1,
                centerPadding: '20px',
              },
            },
      ],
    };

    const generateBackgroundColor = (index) => `hsl(${360 * (index / topics.length)}, 70%, 80%)`;

    /*const addNewTopic = (newTopicName) => {
      const newId = Math.max(...topics.map(t => t.id)) + 1;
      const newTopic = { id: newId, name: newTopicName };
      setTopics([...topics, newTopic]);
    };*/

    const handleTopicClick = (topic) => {
        if (!isDragging) {
          setSelectedTopic(topic); 
          setShowCard(true);      
        }
      };

    const handleCloseCard = () => {
      setShowCard(false);
    };

    /*const changeTopic = (direction) => {
        const currentIndex = topics.findIndex(t => t.id === selectedTopic.id);
        const nextIndex = direction === 'next' ? 
          (currentIndex + 1) % topics.length : 
          (currentIndex - 1 + topics.length) % topics.length;
        setSelectedTopic(topics[nextIndex]);
      };*/

      return (
        <div className="container">
          <ReusableAppBar />
          <Box className="practiceEventContainer">
            <Box className="searchBox">
              <TextField
                label="Search a lesson"
                variant="outlined"
                className="searchField"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" aria-label="search" className="searchButton">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
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
              {/* Render the backdrop and popup within the sliderContainer */}
              {showCard && selectedTopic && (
                <>
                  <div className="backdrop" onClick={handleCloseCard}></div>
                  <div className="topicCardPopup">
                    <TopicCard
                      topic={selectedTopic}
                      onClose={handleCloseCard}
                    />
                  </div>
                </>
              )}
            </div>
          </Box>
        </div>
      );
    }

export default PracticeEvent;




