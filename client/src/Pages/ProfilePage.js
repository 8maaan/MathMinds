import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/ProfilePage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import userprofilepic from '../Images/UserDP.png';
import { Button, TextField } from '@mui/material';
import { getUserProfileInfoFromDb, updateUserProfileInfoToDb } from '../API-Services/UserAPI';

const ProfilePage = () => {
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [userProfileInfo, setUserProfileInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // State to track editing mode

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

   
    const handleEdit = () => {
        setIsEditing(true); // Enable editing mode
    };

    const handleUpdate = async () => {
        try {
            const updatedProfileInfo = {
                fname: userProfileInfo.fname,
                lname: userProfileInfo.lname,
                email: userProfileInfo.email
            };
            await updateUserProfileInfoToDb(user.uid, updatedProfileInfo);
            setIsEditing(false); // Disable editing mode after successful update
        } catch (error) {
            console.error("Error updating user profile info: ", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserProfileInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
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
                                        <div className='infocontains' style={{ display: 'flex', flexDirection: 'column',width: "330px", gap: '10px'}}>
                                            <TextField
                                                disabled={!isEditing} 
                                                name="fname"
                                                label="First Name"
                                                value={userProfileInfo.fname}
                                                onChange={handleChange}
                                                InputProps={{
                                                    style: {
                                                        borderBottom: "none",
                                                        borderRadius: "25px",
                                                        width: "290px",
                                                        backgroundColor: "white",
                                                        boxShadow: "0px 5px rgba(184, 184, 184, 0.75)"
                                                    }
                                                }}
                                            />
                                            <TextField
                                                disabled={!isEditing}
                                                name="lname"
                                                label="Last Name"
                                                value={userProfileInfo.lname}
                                                onChange={handleChange}
                                                InputProps={{
                                                    style: {
                                                        borderBottom: "none",
                                                        borderRadius: "25px",
                                                        width: "290px",
                                                        backgroundColor: "white",
                                                        boxShadow: "0px 5px rgba(184, 184, 184, 0.75)"
                                                    }
                                                }}
                                            />
                                            <TextField
                                                disabled={!isEditing}
                                                name="email"
                                                label="Email"
                                                value={userProfileInfo.email}
                                                onChange={handleChange}
                                                InputProps={{
                                                    style: {
                                                        borderBottom: "none",
                                                        borderRadius: "25px",
                                                        width: "290px",
                                                        backgroundColor: "white",
                                                        boxShadow: "0px 5px rgba(184, 184, 184, 0.75)"
                                                    }
                                                }}
                                            />
                                            {isEditing ? (
                                                <Button
                                                 onClick={handleUpdate}
                                                 variant='contained'  
                                                 size='medium'
                                                 sx={{
                                                    width:"50%",
                                                    fontFamily:'Poppins',
                                                    backgroundColor: '#FFB100', 
                                                    color: '#181A52', 
                                                    fontWeight: '600', 
                                                    borderRadius: '10px',
                                                    '&:hover': {
                                                        backgroundColor: '#d69500'
                                                    }
                                                }}
                                                 >Update</Button> // Show "Update" button when editing
                                            ) : (
                                                <Button onClick={handleEdit}
                                                variant='contained'  
                                                size='medium'
                                                sx={{
                                                    width:"50%",
                                                   fontFamily:'Poppins',
                                                   backgroundColor: '#FFB100', 
                                                   color: '#181A52', 
                                                   fontWeight: '600', 
                                                   borderRadius: '10px',
                                                   '&:hover': {
                                                       backgroundColor: '#d69500'
                                                   }
                                               }}>Edit</Button> // Show "Edit" button when not editing
                                            )}
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
