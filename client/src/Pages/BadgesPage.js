import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';
import { getUserProfileInfoFromDb } from '../API-Services/UserAPI';
import '../PagesCSS/BadgesPage.css';
import ReusableChoices from '../ReusableComponents/ReusableChoices';




const BadgesPage = () => {
    const { user } = UserAuth();
    const [userProfileInfo, setUserProfileInfo] = useState({ fname: ''});

    useEffect(() => {
        const fetchUserProfileInfo = async () => {
            if (user) {
                const result = await getUserProfileInfoFromDb(user.uid);
                if (result.success) {
                    setUserProfileInfo(result.data);
                } else {
                    console.error("Failed to fetch user profile info");
                }
            }
        };
        fetchUserProfileInfo();
    }, [user]);

    const getBadgesHeader = () => {
        if (!userProfileInfo.fname) return '';
        return userProfileInfo.fname.endsWith('s') 
            ? `${userProfileInfo.fname}' Badges` 
            : `${userProfileInfo.fname}'s Badges`;
    };

    return (
        <div className="Profilepage">
            <div className='badges-wrapper'>
                <div className='badges-content-container'>
                    <div className='badgesinfo-left-side'>
                    <ReusableChoices/>
                    </div>
                    <div className='badgesinfo-right-side'>
                        <div className='badges-container'>
                            <div className='badges-title'>{getBadgesHeader()}</div>
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
