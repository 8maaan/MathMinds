import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/ProfilePage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import userprofilepic from '../Images/UserDP.png';
import { Button, TextField } from '@mui/material';
import { getUserProfileInfoFromDb } from '../API-Services/UserAPI';

const ProfilePage = () => {
    const { user } = UserAuth(); // Access user object from AuthContext
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [userId, setUserId] = useState(null); // State to hold user ID

    useEffect(() => {
        if (user) {
            // Extract user information
            const { uid, fname, email } = user;
            // Set user ID to state
            setUserId(uid);

            // Set user information to state
            setUserInfo({
                firstName: fname,
                email: email
            });

            // Fetch user profile info using user ID
            fetchUserProfileInfo(uid);
        }
    }, [user]); 

    // Function to fetch user profile info
    const fetchUserProfileInfo = async (uid) => {
        try {
            const response = await getUserProfileInfoFromDb(uid);
            console.log("User profile info response:", response); // Log the response data
            if (response.success) {
                // Set user profile info to state
                setUserInfo(response.data);
            } else {
                console.error("Error fetching user profile info: ", response.message);
            }
        } catch (error) {
            console.error("Error fetching user profile info: ", error);
        }
    };
    
    

    return (
        <div className="Profilepage">
            <ReusableAppBar />
            <div className='profile-wrapper'>
                <div className='profile-content-container'>
                    <div className='personalinfo-left-side'>
                        <div className='choices-container'>
                            <div className='PI-button'>
                                Personal Information
                            </div>
                            <div className='LessonProg-button'>
                                Lesson Progress
                            </div>
                            <div className='Badges-button'>
                                Badges
                            </div>
                        </div>
                    </div>
                    <div className='personalinfo-right-side'>
                        <div className='PI-container'>
                            <div className='PI-title'>PERSONAL INFORMATION</div>
                            <div className='logo-and-userinfo-container'>
                                <div className='profile-logo-container'>
                                    <img src={userprofilepic} alt='logo' />
                                </div>
                                <div className='userinfo-container'>
                                    {userInfo ? (
                                        <div>
                                            <TextField
                                                label='First Name'
                                                value={userInfo.firstName}
                                                disabled
                                            />
                                            <TextField
                                                label='Email'
                                                value={userInfo.email}
                                                disabled
                                            />
                                            <TextField
                                                label='User ID'
                                                value={userId}
                                                disabled
                                            />
                                        </div>
                                    ) : (
                                        <div>Loading...</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
