import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';

function TopicCard({ topic, onClose, onNext, onPrev }) {
  if (!topic) {
    return <div>Loading...</div>; 
  }

  // Apply the background color dynamically based on the topic.color
  const cardStyles = {
    maxWidth: 800,
    maxHeight: 600,
    width: '100%', 
    height: '80%', 
    bgcolor: topic.color, 
    position: 'relative' 
  };

  return (
    <Card sx={cardStyles}>
      <CardContent>
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: '8px', top: '8px', zIndex: 1 }}>
          <CloseIcon />
        </IconButton>
        <Typography gutterBottom variant="h5" component="div" align="center">
          {topic.name}
        </Typography>
        <Input placeholder="Activity Name" fullWidth />
      </CardContent>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '200px'}}>
        <IconButton aria-label="previous" onClick={onPrev} sx={{ marginLeft: '20px', marginRight: '20px' }}>
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton aria-label="next" onClick={onNext} sx={{ marginLeft: '20px', marginRight: '20px' }}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </Card>
  );
}

export default TopicCard;




