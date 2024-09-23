import React from 'react';
import '../PagesCSS/LandingPage.css';
import LandingAppBar from '../ReusableComponents/LandingAppBar'
import { Button } from '@mui/material';
import teacherImg from '../Images/landing-body-image2.png';
import { useNavigate } from 'react-router-dom';
import Landinganima1 from '../ReusableComponents/LandingPageanima1';
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
                                    fontFamily:'Poppins',
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

                    <div className='content-container-1'>
                            <div className='landing-one-left-side'>
                                    <div className='landing-one-left-image'>
                                        <Landinganima1/>
                                        </div>
                                </div>
                            <div className='landing-one-right-side'>
                                    <div className='landing-one-right-side-text'>
                                            <p>Learn at Your Own Pace</p>
                                        </div>
                                    <div className='landing-one-right-side-desc'>
                                            <p>Dive into lessons made just for you! Each lesson is designed to teach math concepts at your grade level.
                                                 As you complete lessons, you'll unlock awesome badges to show off your progress!
                                            </p>
                                        </div>

                            </div>
                    </div>

                    <div className='content-container-2'>

                    <div className='landing-two-left-side'>
                            <div className='landing-two-left-side-text'>
                                            <p>Practice Makes Perfect</p>
                                        </div>
                                    <div className='landing-two-left-side-desc'>
                                            <p>Whether you're ready to take on math challenges solo or with friends,
                                                 we’ve got you covered! Choose any lesson topic to practice on your own, or team up with classmates for a fun, collaborative quiz.
                                                 </p>
                                        </div>
                                </div>
                                
                            <div className='landing-two-right-side'>
                                        <div className='landing-two-right-image'>
                                                <Landinganima1/>
                                        </div>
                                </div>

                            </div>
                            <div className='content-container-3'>
                            <div className='landing-three-left-side'>
                                    <div className='landing-three-left-image'>
                                        <Landinganima1/>
                                        </div>
                                </div>
                            <div className='landing-three-right-side'>
                                    <div className='landing-three-right-side-text'>
                                            <p>Learn at Your Own Pace</p>
                                        </div>
                                    <div className='landing-three-right-side-desc'>
                                            <p>We transform the study of mathematics into a wonderful experience 
                                                through interactive lessons, creative problem-solving, and real-world applications
                                            </p>
                                        </div>

                            </div>
                    </div>       
                    </div>

                           

                 </div>
                </div>
        
    )
}

export default LandingPage;