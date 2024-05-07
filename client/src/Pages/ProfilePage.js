import React, { useEffect, useState } from 'react'
import { UserAuth } from '../Context-and-routes/AuthContext'
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/ProfilePage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import userprofilepic from '../Images/UserDP.png';
import { Button, TextField } from '@mui/material';
import { getUserProfileInfo } from '../API-Services/UserAPI';

// FOR TESTING PURPOSES ONLY (ROUTES)
// EDIT LATER

const HomePage = () => {
    const { user, logOut } = UserAuth();
    const[userinfo,setUserInfo]=useState([]);

    const navigateTo = useNavigate();

    const handleSignOut = async () =>{
        try{
            await logOut();
            console.log('You are logged out');
            navigateTo('/login');
        }catch (e){
            console.log(e.message);
        }
    }


        useEffect(()=>{
            const getUserInfo = async () =>{
                const result = await getUserProfileInfo(localStorage.getItem("uid"));
                if(result.success){
                    setUserInfo(result.user);
                }else{
                    console.log(result.message);
                }
            };
            getUserInfo();
        },[]);

        const InfoTextField=({label,defaultValue})=>{
            return(
                <div className="profile-info-texts">
                    
                    <div className="profile-info-textfields">
                        <TextField

                        disabled
                        defaultValue={defaultValue}
                        size="large"
                        className="customTextField"
                        label={<span>{label}<span style={{color: 'black'}}> *</span></span>}
                        />
                    </div>
                </div>
            );
        };

    return (
        <div>
             <div class="Profilepage">
             <ReusableAppBar/>
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
                                    <div className='PI-title'>PERSONAL INFORMATION
                                    </div>
                                    <div className='logo-and-userinfo-container'>
                                    <div className='profile-logo-container'>
                                    <img src={userprofilepic} alt='logo'/>
                                    </div>
                                    <div className='userinfo-container'>
                                        <InfoTextField
                                        label='FIRSTNAME'
                                        defaultValue={userinfo.fname}
                                        />
                                         <InfoTextField
                                       label='LASTNAME'
                                        defaultValue={userinfo.lname}
                                        />
                                         <InfoTextField
                                        label='EMAIL'
                                        defaultValue={userinfo.email}
                                        />

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

export default HomePage