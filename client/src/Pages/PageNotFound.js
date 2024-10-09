import React from 'react'
import Error404 from '../LottieFiles/LottieAnimations/Error404.json';
import Lottie from 'lottie-react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigateTo = useNavigate();
  const style = {
    height:'100vh',
    width:'100%',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:'2.5%'
  }

  const handleNavigateToHome = () =>{
    navigateTo('/home');
  }

  return (
    <Box sx={style}>
      <Lottie animationData={Error404} loop={true} alt='error'/>
      <Button variant="contained" onClick={handleNavigateToHome}> Go Back</Button>
    </Box>
  )
}

export default PageNotFound