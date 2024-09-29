import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import Lottie from 'lottie-react';
import Birdy from '../JSON/BirdyLanding.json';
import Journey from '../JSON/JourneyLanding.json';
import Collab from '../JSON/CollabLanding.json';
import GitHubIcon from '../Images/LandingPageImages/github-mark/github-mark.png';
import GitHubIconWhite from '../Images/LandingPageImages/GitHub-Logos/GitHub_Logo_White.png';
import LandingPageSection3 from '../ReusableComponents/LandingPageSection';
import '../PagesCSS/LandingPage.css';
import RevampedLAppBar from '../ReusableComponents/RevampedLAppBar';
import { Button, AppBar, Box, IconButton, Divider, Tooltip} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

    const navigateTo = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 1000, 
            easing: 'ease-in-out', 
        });
    }, []);  

    return (
        <div>
            <div className='body'>
                <RevampedLAppBar />
                <div data-aos="fade-down" className='landing-wrapper'>
                    <div style={{}} className='content-container'>
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
                            <Lottie animationData={Birdy} loop={true} alt='Duolingo'/>
                        </div>
                    </div>
                </div>
                <h1 data-aos="fade-up" style={{fontSize: 'clamp(2rem, 4.5vw, 5rem)'}}> Why MathMinds?</h1>
                

                <div data-aos="fade-up-left" className='section-wrapper'>
                    <div style={{background: 'linear-gradient(to right, #ffa726, #ffa72680 75%)', border: '12px solid #ffa726'}} className='section-content-container'> 
                        <div className='section-content-left-side'>
                           <div className='section-content-image'>
                                <Lottie animationData={Journey} loop={true} alt='Journey' style={{ width: window.innerWidth <= 768 ? '40%' : '100%' }} />
                           </div>
                        </div>
                        <div className='section-content-right-side'>
                           <div className='section-header-container'>
                                <p>Personalized</p>
                                <p>Math Journey</p>
                           </div>
                           <div className='section-content-desc'>
                                <p>Dive into a range of mathematical lessons and topics tailored to your 
                                    learning and track your progress as you master new concepts!
                                </p>
                           </div>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up-right" className='section-wrapper'> 
                    <div style={{background: 'linear-gradient(to right, #b39ddb80, #b39ddb 75%)', border: '12px solid #b39ddb'}} className='section-content-container'>
                        <div className='section-content-left-side'>
                            <div className='section-header-container'>
                                <p>Collaborative/</p>
                                <p>Solo Learning</p>
                            </div>
                            <div className='section-content-desc'>
                                    <p>Challenge yourself with topic quizzes and engaging practices,
                                        Whether you prefer tackling practices on your own or competing with others.
                                    </p>
                            </div>
                        </div>
                        <div className='section-content-right-side'>
                           <div className='section-content-image'>
                                <Lottie animationData={Collab} loop={true} alt='Collaboration'  style={{ width: window.innerWidth <= 768 ? '40%' : '100%'}} />
                           </div>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up-left"className='section-wrapper'>
                    <div style={{background: 'linear-gradient(to right, #f0de38, #f0de3880 85%)', border: '12px solid #f0de38'}} className='section-content-container'>
                        <div style={{marginBottom: '20px'}}className='section-content-left-side'>
                           <div className='section-content-image'>
                                <LandingPageSection3/>     
                           </div>
                        </div>
                        <div className='section-content-right-side'>
                           <div className='section-header-container'>
                                <p>Achieve and</p>
                                <p>Earn Rewards</p>
                           </div>
                           <div className='section-content-desc'>
                                <p>Celebrate your learning milestones! Earn badges for completing lessons,  
                                    quizzes, and practices.
                                </p>
                           </div>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-in">
                    <h1 style={{fontSize: '1.5rem'}}>Start Your Mathematical Journey.</h1>
                    <Button 
                        variant='contained' 
                        size='large'
                        onClick={()=>{navigateTo('/register')}} 
                        sx={{
                            my: 2, ml: 2, mr: 2,
                            fontFamily: 'Poppins, sans-serif', 
                            backgroundColor: '#FFB100', 
                            color: '#181A52', 
                            fontWeight: '600', 
                            marginBottom: '2.5%',
                            borderRadius: '10px',
                            '&:hover': {
                                backgroundColor: '#d69500'
                            }
                        }}
                    >
                        Get Started
                    </Button>
                </div>

                <AppBar position="static" sx={{ height: '50px', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFB100'}}>
                    <Box sx={{display: 'inline-flex'}}>
                        <Tooltip title="Link to the GitHub Front-End Repository">
                            <IconButton 
                                size="small" 
                                href="https://github.com/8maaan/MathMinds"
                                target="__blank"
                                rel="noopener noreferrer"
                            >
                                <img src={GitHubIcon} alt='GitHub Icon' height='30px'/>
                            </IconButton>
                        </Tooltip>
                         <Divider orientation="vertical" variant="middle" flexItem />
                        <Tooltip title="Link to the GitHub Back-End Repository">
                            <IconButton 
                                size="small" 
                                aria-label="redirect to backend repo" 
                                href="https://github.com/johnrodolph/Mathminds-API"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={GitHubIconWhite} alt='GitHub Icon' height='30px'/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </AppBar>
            </div>
        </div>
    );
}

export default LandingPage;
