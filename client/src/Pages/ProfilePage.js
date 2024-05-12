import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/ProfilePage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import userprofilepic from '../Images/UserDP.png';
import { Button, TextField } from '@mui/material';
import { getUserProfileInfoFromDb } from '../API-Services/UserAPI'; // Import getUserProfileInfoFromDb function

const ProfilePage = () => {
    const { user } = UserAuth(); // Get current user from authentication context
    const [userProfileInfo, setUserProfileInfo] = useState(null); // State to store user profile information

    useEffect(() => {
        // Function to fetch user profile information
        const fetchUserProfileInfo = async () => {
            if (user) {
                const result = await getUserProfileInfoFromDb(user.uid); // Fetch profile info using current user's UID
                if (result.success) {
                    setUserProfileInfo(result.data); // Update state with user profile info
                } else {
                    console.error("Failed to fetch user profile info");
                }
            }
        };

        fetchUserProfileInfo(); // Call the fetchUserProfileInfo function when the component mounts or when the user changes
    }, [user]);

    const InfoTextField=({label,defaultValue})=>{
        return(
            <div className="profile-info-texts">

                <div className="profile-info-textfields">
                    <TextField
                    disabled
                    defaultValue={defaultValue}
                    size="large"
                    className="customTextField"
                    label={<span>{label}<span style={{color: 'black'}}></span></span>}
                    InputProps={{ 
                        style: { 
                            borderBottom: "none", 
                            borderRadius: "25px", 
                            width: "400px", 
                            backgroundColor: "white", 
                            boxShadow: "0px 5px rgba(184, 184, 184, 0.75)" 
                        } 
                    }}
                    />
                </div>
            </div>
        );
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
                                  
                                    {userProfileInfo && (
                                        <div >
                                             <InfoTextField
                                        label='FIRSTNAME'
                                        defaultValue={userProfileInfo.fname}
                                        />
                                         <InfoTextField
                                       label='LASTNAME'
                                        defaultValue={userProfileInfo.lname}
                                        />
                                         <InfoTextField
                                        label='EMAIL'
                                        defaultValue={userProfileInfo.email}
                                        />
                                        </div>
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
