import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';
import '../PagesCSS/ProfilePage.css';
import ReusableChoices from '../ReusableComponents/ReusableChoices';
import userprofilepic from '../Images/UserDP.png';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import { getUserProfileInfoFromDb, updateUserProfileInfoToDb } from '../API-Services/UserAPI';
import { isPasswordValid, isEmailValid, isPasswordMatch} from '../ReusableComponents/txtFieldValidations';
import MuiAlert from '@mui/material/Alert';
import ReusableDialog from '../ReusableComponents/ReusableDialog';
//import ImageUploader from '../ReusableComponents/ImageUploader'; // Import the ImageUploader
import CustomButton from '../ReusableComponents/CustomButton';

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
                    borderRadius: "20px",
                    backgroundColor: "white",
                    boxShadow: "0px 3px rgba(184, 184, 184, 0.75)"
                },
                disableUnderline: true // Add this line to remove the underline
            }}
            InputLabelProps={{ required: false }}
            name={name}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            disabled={disabled}
            sx={{
                '& .MuiFilledInput-root': {
                    '&:before, &:after': {
                        borderBottom: 'none',
                    },
                    borderRadius: '25px', // Apply your rounded edges here if needed
                }
            }}
        />
    </div>
);

const ProfilePage = () => {
    const [userProfileInfo, setUserProfileInfo] = useState({ fname: '', lname: '', email: '', password: '***********' }); //profilePictureUrl: ''
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [userError, setUserError] = useState({ fname: false, lname: false, email: false, newPassword: false, retypePassword: false });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [openDialog, setOpenDialog] = useState(false);
    const { user } = UserAuth();

    useEffect(() => {
        const fetchUserProfileInfo = async () => {
            if (user) {
                const result = await getUserProfileInfoFromDb(user.uid);
                if (result.success) {
                    setUserProfileInfo({
                        ...result.data,
                        //profilePictureUrl: result.data.profilePictureUrl, // Ensure this is set
                        email: user.email
                    });
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
            newPassword: isEditing && newPassword.trim() !== '' && !isPasswordValid(newPassword), // Validate only if not empty
            retypePassword: isEditing && retypePassword.trim() !== '' && !isPasswordMatch(newPassword, retypePassword) // Validate only if not empty
        };
        setUserError(errors);
        return !Object.values(errors).some(error => error);
    };

    const { updateUserEmail, updateUserPassword } = UserAuth();

    const handleUpdate = async () => {
        if (!validateInputs()) return;

        const updatedProfileInfo = {
            ...userProfileInfo,
            password: isEditing ? newPassword : userProfileInfo.password
        };

        try {
            await updateUserEmail(userProfileInfo.email);
            await updateUserPassword(newPassword);
            await updateUserProfileInfoToDb(user.uid, updatedProfileInfo);
            setIsEditing(false);
            handleSnackbarOpen('Your Profile Information is updated', "success");
        } catch (error) {
            console.error("Error updating user profile info: ", error);
            handleSnackbarOpen("Failed to update profile. Please try again later.",  "error");
        }
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleOpenDialog = (event) => {
        event.preventDefault();
        setOpenDialog(true);
    };

    const handleCloseDialog = (confirmed) => {
        setOpenDialog(false);
        if (confirmed) {
            handleUpdate();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserProfileInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleImageUpload = (imageUrl) => {
        setUserProfileInfo((prevInfo) => ({
            ...prevInfo,
            //profilePictureUrl: imageUrl // Update the profile picture URL
        }));
        handleSnackbarOpen("Profile picture updated", "success");
    };
    
    return (
        <div className="Profilepage">
            {!user.emailVerified && (
                <Alert
                    variant="filled"
                    severity="warning"
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    Please verify your email address to update your account information. An email has been sent to your inbox with verification instructions
                </Alert>
            )}
            <div className='profile-wrapper'>
                <div className='profile-content-container'>
                    <div className='personalinfo-left-side'>
                        <ReusableChoices/>
                    </div>
                    <div className='personalinfo-right-side'>
                        <div className='PI-container'>
                            <div className='PI-title'>Personal Information</div>
                            <div className='logo-and-userinfo-container'>
                                <div className='profile-logo-container'>
                                    <img src={userProfileInfo.profilePictureUrl || userprofilepic} alt='profile' className="profile-picture" />
                                    
                                    {isEditing && (
                                        <div className="upload-button-container">
                                        {/*<ImageUploader onImageUpload={handleImageUpload} />*/}
                                        </div>
                                    )}
                                </div>
                                <div className='userinfo-container'>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <div className='infocontains' style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                                        error={userError.newPassword} // Set error based on validation
                                                        helperText={userError.newPassword ? 'Invalid password. Must be at least 6 characters.' : ''} // Update message
                                                        disabled={!isEditing}
                                                    />
                                                    <ProfileTxtField
                                                        name="retypePassword"
                                                        label="Confirm Password"
                                                        type="password"
                                                        value={retypePassword}
                                                        onChange={(e) => setRetypePassword(e.target.value)}
                                                        error={userError.retypePassword} // Set error based on validation
                                                        helperText={userError.retypePassword ? 'Passwords do not match.' : ''} // Update message
                                                        disabled={!isEditing}
                                                    />
                                                    <CustomButton
                                                        onClick={handleOpenDialog}
                                                        variant='contained'
                                                        size='medium'
                                                        sx={{
                                                            width: "50%",
                                                            fontFamily: 'Poppins',
                                                            backgroundColor: '#FFB100',
                                                            color: '#181A52',
                                                            fontWeight: '600',
                                                            borderRadius: '10px',
                                                            marginTop: '0px',
                                                            '&:hover': {
                                                                backgroundColor: '#d69500'
                                                            }
                                                        }}
                                                    >
                                                        Update
                                                    </CustomButton>
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
                                                    <CustomButton
                                                        onClick={handleEdit}
                                                        variant='contained'
                                                        size='medium'
                                                        sx={{
                                                            width: "50%",
                                                            backgroundColor: '#FFB100',
                                                            color: '#181A52',
                                                            fontWeight: '600',
                                                            borderRadius: '10px',
                                                            marginTop: '0px',
                                                            '&:hover': {
                                                                backgroundColor: '#d69500'
                                                            }
                                                        }}
                                                        disabled={!user.emailVerified}
                                                    >
                                                        Edit
                                                    </CustomButton>
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
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
            <ReusableDialog
                status={openDialog} 
                onClose={handleCloseDialog} 
                title="Confirm Profile Update" 
                context={`Are you sure you want to update your profile information?`}
            />
        </div>
    );
};

export default ProfilePage;
