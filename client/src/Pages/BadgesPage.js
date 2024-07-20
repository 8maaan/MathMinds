import React from 'react';
import '../PagesCSS/BadgesPage.css';
import ReusableChoices from '../ReusableComponents/ReusableChoices';



const BadgesPage = () => {
    return (
        <div className="Profilepage">
            <div className='badges-wrapper'>
                <div className='badges-content-container'>
                    <div className='badgesinfo-left-side'>
                    <ReusableChoices/>
                    </div>
                    <div className='badgesinfo-right-side'>
                        <div className='badges-container'>
                            <div className='badges-title'>Badges</div>
                            <div className='userbadges-container'>
                                <div className='userinfo-badges-container'>
                                  
                                          
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BadgesPage;
