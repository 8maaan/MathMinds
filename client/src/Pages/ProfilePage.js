import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';
import '../PagesCSS/ProfilePage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import userprofilepic from '../Images/UserDP.png';
import { Button,TextField } from '@mui/material';
import { getUserProfileInfoFromDb, updateUserProfileInfoToDb } from '../API-Services/UserAPI';
import { isEmailValid } from '../ReusableComponents/txtFieldValidations'; // Assuming you have this validation function



const ProfileTxtField = ({ name, label, type, value, onChange, error, helperText, disabled }) => {
    return (
        <div className='profile-txtField'>
            <TextField
                required
                type={type}
                variant='filled'
                label={<span>{label}<span style={{ color: 'red' }}> *</span></span>}
                fullWidth
                InputProps={{
                    style: {
                        borderBottom: "none",
                        borderRadius: "25px",
                        width: "290px",
                        backgroundColor: "white",
                        boxShadow: "0px 5px rgba(184, 184, 184, 0.75)"
                    }
                }}
                InputLabelProps={{ required: false }}
                name={name}
                value={value}
                onChange={onChange}
                error={error}
                helperText={helperText}
                disabled={disabled}
            />
        </div>
    )
}

const ProfilePage = () => {
    const { user } = UserAuth();
    const [userProfileInfo, setUserProfileInfo] = useState({
        fname: '',
        lname: '',
        email: ''
    });
    const [userError, setUserError] = useState({
        fname: null,
        lname: null,
        email: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfileInfo = async () => {
            if (user) {
                const result = await getUserProfileInfoFromDb(user.uid);
                if (result.success) {
                    setUserProfileInfo(result.data);
                } else {
                    console.error("Failed to fetch user profile info");
                }
                setLoading(false);
            }
        };

        fetchUserProfileInfo();
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const validateInputs = () => {
        const errors = {
            fname: userProfileInfo.fname.trim() === '',
            lname: userProfileInfo.lname.trim() === '',
            email: !isEmailValid(userProfileInfo.email)
        };
        setUserError(errors);
        return !Object.values(errors).some(error => error);
    };

    const handleUpdate = async () => {
        if (!validateInputs()) {
            return;
        }

        const updatedProfileInfo = {
            fname: userProfileInfo.fname,
            lname: userProfileInfo.lname,
            email: userProfileInfo.email
        };

        try {
            await updateUserProfileInfoToDb(user.uid, updatedProfileInfo);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user profile info: ", error);
            alert("Failed to update profile. Please try again.");
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
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <div className='infocontains' style={{ display: 'flex', flexDirection: 'column', width: "330px", gap: '20px' }}>
                                            <ProfileTxtField
                                                name="fname"
                                                label="First Name"
                                                value={userProfileInfo.fname}
                                                onChange={handleChange}
                                                error={userError.fname}
                                                helperText={userError.fname ? 'First name is required' : ''}
                                                disabled={!isEditing}
                                            />
                                            <ProfileTxtField
                                                name="lname"
                                                label="Last Name"
                                                value={userProfileInfo.lname}
                                                onChange={handleChange}
                                                error={userError.lname}
                                                helperText={userError.lname ? 'Last name is required' : ''}
                                                disabled={!isEditing}
                                            />
                                            <ProfileTxtField
                                                name="email"
                                                label="Email"
                                                value={userProfileInfo.email}
                                                onChange={handleChange}
                                                error={userError.email}
                                                helperText={userError.email ? 'Invalid email format' : ''}
                                                disabled={!isEditing}
                                            />
                                            {isEditing ? (
                                                <Button
                                                    onClick={handleUpdate}
                                                    variant='contained'
                                                    size='medium'
                                                    sx={{
                                                        width: "50%",
                                                        fontFamily: 'Poppins',
                                                        backgroundColor: '#FFB100',
                                                        color: '#181A52',
                                                        fontWeight: '600',
                                                        borderRadius: '10px',
                                                        '&:hover': {
                                                            backgroundColor: '#d69500'
                                                        }
                                                    }}
                                                >
                                                    Update
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleEdit}
                                                    variant='contained'
                                                    size='medium'
                                                    sx={{
                                                        width: "50%",
                                                        fontFamily: 'Poppins',
                                                        backgroundColor: '#FFB100',
                                                        color: '#181A52',
                                                        fontWeight: '600',
                                                        borderRadius: '10px',
                                                        '&:hover': {
                                                            backgroundColor: '#d69500'
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </Button>
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
