import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';
import '../PagesCSS/ProfilePage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import ReusableChoices from '../ReusableComponents/ReusableChoices';
import userprofilepic from '../Images/UserDP.png';
import { Button, TextField, Snackbar } from '@mui/material';
import { getUserProfileInfoFromDb, updateUserProfileInfoToDb } from '../API-Services/UserAPI';
import { isEmailValid } from '../ReusableComponents/txtFieldValidations';
import MuiAlert from '@mui/material/Alert';

const ProfileTxtField = ({ name, label, type, value, onChange, error, helperText, disabled }) => (
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
);

const ProfilePage = () => {
    const { user } = UserAuth();
    const [userProfileInfo, setUserProfileInfo] = useState({ fname: '', lname: '', email: '', password: '***********' });
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [userError, setUserError] = useState({ fname: false, lname: false, email: false, newPassword: false, retypePassword: false });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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
        handleSnackbarOpen("You can now update your Profile Information");
    };

    const validateInputs = () => {
        const errors = {
            fname: userProfileInfo.fname.trim() === '',
            lname: userProfileInfo.lname.trim() === '',
            email: !isEmailValid(userProfileInfo.email),
            newPassword: isEditing && newPassword.trim() !== '' && newPassword.trim().length < 6, // Only validate if not empty and less than 6 characters
            retypePassword: isEditing && (retypePassword.trim() !== '' || newPassword.trim() !== ''), // Validate if either field is not empty
            passwordsMatch: isEditing && newPassword !== retypePassword
        };
        setUserError(errors);
        return !Object.values(errors).some(error => error);
    };
    

    const handleUpdate = async () => {
        if (!validateInputs()) return;

        const updatedProfileInfo = {
            ...userProfileInfo,
            password: isEditing ? newPassword : userProfileInfo.password
        };

        try {
            await updateUserProfileInfoToDb(user.uid, updatedProfileInfo);
            setIsEditing(false);
            handleSnackbarOpen('Your Profile Information is updated');
        } catch (error) {
            console.error("Error updating user profile info: ", error);
            handleSnackbarOpen("Failed to update profile. Please try again.");
        }
    };

    const handleSnackbarOpen = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
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
                        <ReusableChoices/>
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
                                                <>
                                                    <ProfileTxtField
                                                        name="newPassword"
                                                        label="New Password"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        error={userError.newPassword}
                                                        helperText={userError.newPassword ? 'New password is required' : ''}
                                                        disabled={!isEditing}
                                                    />
                                                    <ProfileTxtField
                                                        name="retypePassword"
                                                        label="Retype Password"
                                                        type="password"
                                                        value={retypePassword}
                                                        onChange={(e) => setRetypePassword(e.target.value)}
                                                        error={userError.retypePassword || userError.passwordsMatch}
                                                        helperText={userError.retypePassword ? 'Retype password is required' : userError.passwordsMatch ? 'Passwords do not match' : ''}
                                                        disabled={!isEditing}
                                                    />
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
                                                </>
                                            ) : (
                                                <>
                                                    <ProfileTxtField
                                                        name="password"
                                                        label="Password"
                                                        type="password"
                                                        value="***********"
                                                        onChange={handleChange}
                                                        error={false}
                                                        helperText=""
                                                        disabled
                                                    />
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
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default ProfilePage;
