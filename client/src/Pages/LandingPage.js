import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import Lottie from 'lottie-react';
import Birdy from '../LottieFiles/LottieAnimations/BirdyLanding.json';
import GifContent1 from '../Images/LandingPageImages/GifContent1.gif';
import GifContent2 from '../Images/LandingPageImages/GifContent2.gif';
import GitHubIcon from '../Images/LandingPageImages/github-mark/github-mark.png';
import GitHubIconWhite from '../Images/LandingPageImages/GitHub-Logos/GitHub_Logo_White.png';
import LandingPageSection from '../ReusableComponents/LandingPageSection';
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
                    <div className='content-container'>
                        <div className='content-right-side'>
                            <div className='right-side-text'>
                                {/* Show this for larger screens */}
                                <p className='large-screen-text'>Making Math</p>
                                <p className='large-screen-text'>Engaging</p>
                                
                                {/* Show this for smaller screens */}
                                <p className='small-screen-text'>Making Math Engaging</p>
                            </div>
                            <div className='right-side-desc'>
                                <p>Experience math in a new way with interactive lessons, hands-on problem-solving, and relatable real-world examples.
                                    Our platform makes learning math more approachable and enjoyable for everyone.
                                </p>
                            </div>
                        </div>
                        <div className='content-left-side lottie-animation'>
                            <Lottie animationData={Birdy} loop={true} alt='Duolingo'/>
                        </div>
                    </div>
                </div>
                
                <h1 data-aos="fade-up" style={{fontSize: 'clamp(2rem, 4.5vw, 5rem)'}}> Why MathMinds?</h1>
                

                <div data-aos="fade-up-right" className='section-wrapper'>
                    <div style={{background: 'rgba(249, 181, 80, 0.6)'}} className='section-content-container'> 
                    <div className='section-content-left-side image-bg-yellow'>
                           <div className='section-content-image'>
                                <img src={GifContent1} className='gif-class' alt="Gif Content 1"/>
                           </div>
                        </div>
                        <div className='section-content-right-side'  style={{ paddingLeft:'30px'}}>
                           <div className='section-header-container'>
                                <p>Dynamic Math</p>
                                <p>Learning Hub</p>
                           </div>
                           <div className='section-content-desc'>
                                <p>Explore a flexible platform where teachers can adapt lessons, topics, and practices to suit the class's needs.
                                </p>
                           </div>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up-left" className='section-wrapper'> 
                    <div style={{background: 'rgb(179, 157, 219, 0.6)'}} className='section-content-container'>
                        <div className='section-content-left-side image-bg-purple'>
                            <div className='section-content-image'>
                                <img src={GifContent2} className='gif-class' alt="Gif Content 2"/>
                            </div>
                        </div>
                        <div className='section-content-right-side'>
                           <div className='section-header-container'>
                                <p>Collaborative/ </p>
                                <p>Solo Learning</p>
                            </div>
                            <div className='section-content-desc'>
                                    <p>Challenge yourself with topic quizzes and engaging practices,
                                        whether you prefer tackling practices on your own or competing with others.
                                    </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up"className='section-wrapper'>
                    <div style={{background: 'rgb(153, 198, 126, 0.6)'}} className='section-content-container'>
                        <div className='section-content-left-side image-bg-green'>
                           <div className='component-response section-content-image'>
                                <LandingPageSection />     
                           </div>
                        </div>
                        <div className='section-content-right-side'>
                           <div className='section-header-container'>
                                <p>Progress &</p>
                                <p>Rewards</p>
                           </div>
                           <div className='section-content-desc'>
                                <p>Celebrate every milestone! Earn badges and track your achievements as you complete lessons,
                                    motivating you to keep pushing forward.
                                </p>
                           </div>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-in">
                    <h1 style={{fontSize: '1.5rem'}}>Start Your Journey.</h1>
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
