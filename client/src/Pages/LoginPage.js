import React, { useState, useEffect } from 'react';
import '../PagesCSS/LoginPage.css';
import { Button, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Context-and-routes/AuthContext';
import LoginPageImage from '../Images/LoginPageImages/login-bg.png';
import ForgotPasswordModal from '../ReusableComponents/forgotPasswordModal';
import ForwardIcon from '@mui/icons-material/Forward';
import LoginPageBg from '../ReusableComponents/LoginPageBg';
import BrainAnimate from '../ReusableComponents/BrainAnimation';

export const txtFieldInputProps = {
    disableUnderline: true,
    sx: {
        border: '1px solid #cccdcf',
        borderRadius: '20px',
        backgroundColor: 'white',
        '&:hover': {
            backgroundColor: 'white',
        },
        '&:focus': {
            backgroundColor: 'white',
        },
        '&:not(:focus)': {
            backgroundColor: 'white',
        },
    },
};

const LoginPage = () => {
    const { signIn } = UserAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [useFallbackImage, setUseFallbackImage] = useState(false);

    const [loading, setLoading] = useState(false) //FOR CIRCULAR PROGRESS
    const navigateTo = useNavigate();

    useEffect(() => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            const { effectiveType } = connection;
            if (effectiveType === '2g' || effectiveType === '3g') {
                setUseFallbackImage(true);
            }
        } else {
            setUseFallbackImage(false);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            setIsValid(true);
            await signIn(email, password);
            console.log('You are logged in!');
            navigateTo('/home', { replace: true });
        } catch (e) {
            console.log(e.message);
            setIsValid(false);
            // console.log(isValid);
        }
        setLoading(false);
    };

    // FOR FORGOT PASSWORD MODAL
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleBackBtnClick = () => {
        navigateTo('/');
    };

    return (
        <div className="Login">
            <div className="login-left-side">
                <div className="login-back-btn">
                    <ForwardIcon className="login-back-icon" onClick={handleBackBtnClick} />
                </div>
                <div className="login-bg-container">
                    {useFallbackImage ? (
                        <img src={LoginPageImage} alt="Fallback Background" className="login-fallback-image" />
                    ) : (
                        <LoginPageBg />
                    )}
                </div>
            </div>
            <div className="login-right-side">
                <BrainAnimate className="login-logo-container" />

                <h3 style={{ color: '#181A52' }}>Log in to your account</h3>

                <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
                    <div className="login-txtField">
                        <TextField
                            required
                            error={!isValid}
                            variant="filled"
                            label={<span>Email<span style={{ color: 'red' }}> *</span></span>}
                            fullWidth
                            InputProps={txtFieldInputProps}
                            InputLabelProps={{ required: false }}
                            onChange={(event) => { setEmail(event.target.value); }}
                        />
                    </div>
                    <div className="login-txtField">
                        <TextField
                            required
                            error={!isValid}
                            helperText={!isValid ? 'Incorrect email or password' : null}
                            type="password"
                            variant="filled"
                            label={<span>Password<span style={{ color: 'red' }}> *</span></span>}
                            fullWidth
                            InputProps={{ ...txtFieldInputProps }}
                            InputLabelProps={{ required: false }}
                            onChange={(event) => { setPassword(event.target.value); }}
                        />
                    </div>
                    <div className="forgot-password-text-container">
                        <p onClick={handleModalOpen}>Forgot password?</p>
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                            backgroundColor: '#ffb100',
                            borderRadius: '20px',
                            marginTop: '30px',
                            height: '5vh',
                            fontFamily: 'Poppins',
                            '&:hover': { backgroundColor: '#e39e02' },
                        }}
                    >
                        {loading ? <CircularProgress color="inherit" size="1.5rem" thickness={6}/> : <h4>Create</h4>}
                    </Button>
                </form>
                <p>No account yet?
                    <span style={{ color: '#181A52', cursor: 'pointer', fontWeight: '700' }} onClick={() => navigateTo('/register')}> Click here</span>
                </p>
            </div>

            {modalOpen && (
                <ForgotPasswordModal open={modalOpen} onClose={handleModalClose} />
            )}
        </div>
    );
};

export default LoginPage;
