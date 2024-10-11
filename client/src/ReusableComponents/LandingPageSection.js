import React from 'react';
import Badge1 from '../Images/LandingPageImages/badge_1.png';
import Badge2 from '../Images/LandingPageImages/badge_2.png';
import Badge3 from '../Images/LandingPageImages/badge_3.png';
import '../PagesCSS/LandingPageSection.css';

const LandingPageSection = () => {
 
    return (
        <div className='container-landing-bg'>
            <img src={Badge1} className='badge1' alt='Badge 1' loading="lazy"/>
            <img src={Badge2} className='badge2' alt='Badge 2' loading="lazy"/>
            <img src={Badge3} className='badge3' alt='Badge 3' loading="lazy"/>
        </div>
    );
};

export default LandingPageSection;