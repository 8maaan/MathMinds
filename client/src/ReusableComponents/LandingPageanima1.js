import React from 'react';
import '../PagesCSS/LandingPageanima1.css';
import StarRight from '../Images/LandingPageImages/star1.png';
import StarLeft from '../Images/LandingPageImages/star2.png';
import medal from '../Images/LandingPageImages/medal.png';
import badges from '../Images/LandingPageImages/badges.png';
import pen from '../Images/LandingPageImages/pen.png';
import prog from '../Images/LandingPageImages/prog.png';


const LandingPageanima1 = () => {

    return (
        <div className='container-landingpageanima1-bg'>
        <div className='top-anima1'>
            <div className='top-left-anima1'>
                <img src={prog} className='progress' alt='prog'/>
            </div>
            
            <div className='top-right-anima1'>
                <img src={pen} className='pen' alt='pen'/>
                <img src={StarRight} className='star-rights' alt='Right Star'/>
            </div>
        </div>



        <div className='bot-anima2'>
            <div className='bot-left-anima2'>
                <img src={StarLeft} className='star-lefts' alt='Left Star'/>
                <img src={medal} className='medal' alt='badge'/>
            </div>
            
            <div className='bot-right-anima2'>
                <img src={badges} className='badges' alt='badges'/>
            </div>
        </div>
          
           
        </div>
    );
};

export default LandingPageanima1;
