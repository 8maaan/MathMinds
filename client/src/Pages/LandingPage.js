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
                <div>
                    <img src={mathMindsHorizontalLogo} alt='Logo'/>
                </div>
                <div className='right-buttons'>
                    <button style={{backgroundColor: '#ffffff'}}className='button' onClick={() => navigate('/register')}>SIGN UP</button>
                    <button className='button' onClick={() => navigate('/login')}>LOG IN</button>
                </div>
            </div>

            <div>
                <div className='landing-body-grid-container'>
                    <div className='text-section'>
                        <h1>
                            <span>We Make</span><br/>
                            <span>Mathematics</span><br/>
                            <span>Fun.</span>
                        </h1>
                        <p>We transform the study of mathematics into a wonderful<br/>
                        experience through interactive lessons, creative<br/>
                        problem-solving, and real-world applications.</p>
                    </div>
                    <div className='image-section'>
                        <img src={landingBodyImage} alt='Teacher'/>
                        <button onClick={() => navigate('login')} className='button'>GET STARTED</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage