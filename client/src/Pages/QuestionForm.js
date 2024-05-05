import React from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
//import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


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
  width: '410px',
  fontSize: '1rem',
  margin: '8px',
  color: 'white',
  borderRadius: '10px'
});

const iconStyle = {
    fontSize: '60px', 
    padding: '60px',
    color: '#ffb100'
  };

function QuestionForm() {
    const navigate = useNavigate ();


    const scoreButtonClick = () => {
        navigate('/scoreTest');
    }
  return (
    <ThemeProvider theme={theme}>
    <div className='container'>
      <ReusableAppBar />
      <Box style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)' }}>
        <ArrowBackIosIcon style={iconStyle} />
      </Box>
      <Box style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
        <ArrowForwardIosIcon style={iconStyle} onClick={scoreButtonClick} />
      </Box>
      <Container maxWidth="md" sx={{ height:'800px', padding: '20px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', position: 'relative' }}>
        <Typography variant="h4" sx={{fontWeight: 'bold', color:'#181a52'}}gutterBottom>
          Activity Name
        </Typography>
        <Paper elevation={3} sx={{ height:'400px', padding: '20px', backgroundColor: '#f6e6c3', margin: '20px 0', width: '100%' }}>
            <Typography variant="h6" sx={{textAlign: 'left'}}gutterBottom>
              Question 1
            </Typography>
            <Typography paragraph sx={{ marginTop: '100px', alignSelf: 'center', textAlign: 'center' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit...
            </Typography>
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '1400px' }}>
            <OptionButton sx={{ bgcolor: '#F44336', color:'#181a52' }}>Option A</OptionButton>
            <OptionButton sx={{ bgcolor: '#2196F3', color:'#181a52'  }}>Option B</OptionButton>
            <OptionButton sx={{ bgcolor: '#4CAF50', color:'#181a52'  }}>Option C</OptionButton>
            <OptionButton sx={{ bgcolor: '#FFC107', color:'#181a52'  }}>Option D</OptionButton>
          </Box>
        </Box>
      </Container>
    </div>
    </ThemeProvider>
  );
}

export default QuestionForm;









