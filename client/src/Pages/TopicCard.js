import Button from '@mui/material/Button';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../PagesCSS/TopicCard.css';

function TopicCard({ topic, onClose, onStart }) {

  // const onNext = (topicId, topicTitle) => {
  //   navigate(`/questionForm/${topicId}`, { state: { topicTitle } });
  // };

  const handleShowPracticeModeChoice = () => {
    onStart();
  }

  if (!topic) {
    return <div>Loading...</div>;
  }

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

  const cardStyles = {
    maxWidth: '55rem',
    maxHeight: '35.5rem',
    height: '80%',
    width: '80%',
    position: 'fixed',
    top: '50%',
    left: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
    zIndex: 1300,
    backgroundColor: '#ffec86',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '20px', 
    overflowY: 'auto',
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="backgroundOverlay">
        <Card sx={cardStyles}>
          <Typography
            gutterBottom
            variant="h3"
            component="div"
            align="center"
            sx={{ marginTop: '-20px', marginBottom: '20px', fontSize: 'clamp(18px, 4vw + 1rem, 24px)' }} 
          >
            Topic {topic.topicId}
          </Typography>
          <CardContent>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ position: 'absolute', right: '8px', top: '8px', zIndex: 1 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              align="center"
              sx={{ marginTop: '20px', fontWeight: 'bold', fontSize: 'clamp(40px, 6vw + 1rem, 60px)', color: '#181A52' }} 
            >
              {topic.topicTitle}
            </Typography>
          </CardContent>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px', marginBottom: '-40px' }}>
            <Button className="playButton" onClick={handleShowPracticeModeChoice}>
              Play <ArrowForwardIcon />
            </Button>
          </div>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default TopicCard;
