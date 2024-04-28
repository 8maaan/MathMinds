import React from 'react';
import { useNavigate } from 'react-router-dom';
import landingBodyImage from '../Images/landing-body-image.png';
import mathMindsHorizontalLogo from '../Images/mathminds-horizontal-logo.png';
import '../PagesCSS/LandingPage.css';

const LandingPage = () => {

    let navigate = useNavigate();

    return (
        <div className='body'>
            <div className='landing-nav'>
                <div className='mobilelogo-and-rightbutton-container'>
                <div className='mobile-view-logo'>
                    <img src={mathMindsHorizontalLogo} alt='Logo'/>
                </div>
                <div className='right-buttons'>
                    <button style={{backgroundColor: '#ffffff'}} className='regbutton' onClick={() => navigate('/register')}>SIGN UP</button>
                    <button className='logbutton' onClick={() => navigate('/login')}>LOG IN</button>
                </div>
                </div>
            </div>

            <div className='landing-container'>
                <div className='landing-body-grid-container'>
                    <div className='container-text-and-image'>
                    <div className='text-section'>
                        <div className='first-text'>
                        <h1>
                            <span>We Make</span><br/>
                            <span>Mathematics</span><br/>
                            <span>Fun.</span>
                        </h1>
                        </div>
                        <div className='second-text'>
                        <p>We transform the study of mathematics into a wonderful<br/>
                        experience through interactive lessons, creative<br/>
                        problem-solving, and real-world applications.</p>
                        </div>
                    </div>
                    <div className='image-section'>
                        <div className='titser'>
                        <img src={landingBodyImage} alt='Teacher'/>
                        </div>
                        <div className='getstartedbutton'>
                        <button onClick={() => navigate('login')} className='gsbutton'>GET STARTED</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage