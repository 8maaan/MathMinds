import React from 'react';
import '../PagesCSS/LandingPage.css';
import LandingAppBar from '../ReusableComponents/LandingAppBar'
import { Button } from '@mui/material';
import teacherImg from '../Images/landing-body-image.png';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

    const navigateTo = useNavigate();
    return (
        <div>
            <div className='body'>
                <LandingAppBar/>
                <div className='landing-wrapper'>
                    <div className='content-container'>
                        <div className='content-right-side'>
                            <div className='right-side-text'>
                                <p>We Make</p>
                                <p>Mathematics</p>
                                <p>Fun</p>
                            </div>
                            <div className='right-side-desc'>
                                <p>We transform the study of mathematics into a wonderful experience 
                                    through interactive lessons, creative problem-solving, and real-world applications
                                </p>
                            </div>
                        </div>
                        <div className='content-left-side'>
                            <div className='content-left-img'>
                                <img src={teacherImg} alt='teacher-img'/>
                            </div>
                            <div className='content-left-btn'>
                            <Button 
                                variant='contained' 
                                size='large'
                                onClick={()=>{navigateTo('/register')}} 
                                sx={{
                                    backgroundColor: '#FFB100', 
                                    color: '#181A52', 
                                    fontWeight: '600', 
                                    borderRadius: '10px',
                                    '&:hover': {
                                        backgroundColor: '#d69500'
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage