//import Button from '@mui/material/Button';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../PagesCSS/TopicCard.css';
import CustomButton from '../ReusableComponents/CustomButton';
//import AccordionCustomButton from '../ReusableComponents/AccordionCustomButton';
//import chroma from 'chroma-js'; // Import chroma-js

function TopicCard({ topic, onClose, onStart, /*backgroundColor*/ }) {

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

  // Use chroma to create a lighter shade of the background color
  //const lighterBackgroundColor = chroma(backgroundColor).brighten(0.9).saturate(0.2).hex();

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
    backgroundColor: '#fffdd0',//lighterBackgroundColor, // Use the lightened color
    borderRadius: '25px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    overflowY: 'auto',
    paddingLeft: '1%',
    paddingRight: '1%'
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
            Topic {topic.orderNumber}
          </Typography>
          <CardContent>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ position: 'absolute', right: '12px', top: '12px', zIndex: 1 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              align="center"
              sx={{ marginTop: '20px', fontWeight: 'bold', fontSize: 'clamp(30px, 6vw + 1rem, 60px)', color: '#181A52' }} 
            >
              {topic.topicTitle}
            </Typography>
          </CardContent>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px', marginBottom: '-40px' }}>
            <CustomButton onClick={handleShowPracticeModeChoice} 
                sx={{ width: {
                  xs: '80%',   // 80% width for extra small screens
                  sm: '200px',   // 60% width for small screens
                  md: '400px', // 400px width for medium and up
              }, marginTop: '0', color: '#181a52',  fontSize: 'clamp(14px, 6vw + 1rem, 16px)', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'}}>
                  Play <ArrowForwardIcon />
            </CustomButton>
          </div>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default TopicCard;
