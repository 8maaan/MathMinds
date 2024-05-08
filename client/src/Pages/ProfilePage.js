import React, { useEffect, useState } from 'react'
import { UserAuth } from '../Context-and-routes/AuthContext'
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/ProfilePage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import userprofilepic from '../Images/UserDP.png';
import { Button, TextField } from '@mui/material';
import { getUserProfileInfo } from '../API-Services/UserAPI'; 
const ProfilePage = () => {
    const { user, logOut } = UserAuth();
    const [userinfo, setUserInfo] = useState({
        fname: "",
        lname: "",
        email: ""
    });
    const navigateTo = useNavigate();

    useEffect(() => {
       
        const fetchUserProfileInfo = async () => {
            try {
                const response = await getUserProfileInfo(user.uid); 
                if (response.success) {
                    const { fname, lname, email } = response.data; 
                    setUserInfo({ fname, lname, email }); 
                } else {
                    console.error("Failed to fetch user profile info:", response.error);
                }
            } catch (error) {
                console.error("Error fetching user profile info:", error);
            }
        };

        fetchUserProfileInfo(); 
    }, [user.uid]); 

    const handleSignOut = async () => {
        try {
            await logOut();
            console.log('You are logged out');
            navigateTo('/login');
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <div>
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
                      
                                        <div>
                                            <TextField
                                                label="First Name"
                                                value={userinfo.fname}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                label="Last Name"
                                                value={userinfo.lname}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                label="Email"
                                                value={userinfo.email}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
