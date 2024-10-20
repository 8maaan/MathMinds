import React, { useState } from 'react'
import '../PagesCSS/RegisterPage.css'
import registerBackground from '../Images/register-bg.png'
import {Button, TextField, Typography, CircularProgress} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { txtFieldInputProps } from './LoginPage'
import { UserAuth } from '../Context-and-routes/AuthContext'
import { isPasswordValid, isEmailValid, isPasswordMatch} from '../ReusableComponents/txtFieldValidations';
import ForwardIcon from '@mui/icons-material/Forward';
import { createUserToDb } from '../API-Services/UserAPI';
import BrainAnimate from '../ReusableComponents/BrainAnimation'

const RegisterTxtField = ({name, label, type, value, onChange, error, helperText}) =>{
    return(
        <div className='register-txtField'>
            <TextField
                required
                type={type} 
                variant='filled' 
                label={<span>{label}<span style={{color: 'red'}}> *</span></span>} 
                fullWidth 
                InputProps={txtFieldInputProps}
                InputLabelProps={{ required: false }}
                name={name}
                value={value}
                onChange={onChange}
                error={error}
                helperText={helperText}
            />
        </div>
    )
}

const RegisterPage = () => {
    const [loading, setLoading] = useState(false) //FOR CIRCULAR PROGRESS

    // INITIAL STATE FOR CORRESPONDING TEXTFIELDS
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        retypePassword: '',
    })

    // ERROR STATE FOR CORRESPONDING TEXTFIELDS
    const [userError, setUserError] = useState({
        // firstName: null,
        // lastName: null,
        email: null,
        password: null,
        retypePassword: null,
    });

    const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);

    const handleTxtFieldChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => {
            const updatedUser = {
                ...prevUser,
                [name]: value
            };
    
            // UPDATE ERROR STATE BASED ON THE UPDATED FIELD
            switch(name){
                case 'email':
                    updateUserError('email', !isEmailValid(value));
                    break;
                case 'password':
                    updateUserError('password', !isPasswordValid(value));

                    // UPDATE RETYPE PASSWORD FIELD IF PASSWORD FIELD CHANGES
                    if (prevUser.retypePassword !== '' && value !== prevUser.retypePassword) {
                        updateUserError('retypePassword', !isPasswordMatch(value, prevUser.retypePassword));
                    }
                    break;
                case 'retypePassword':
                    updateUserError('retypePassword', !isPasswordMatch(prevUser.password, value));
                    break;
                default:
                    break;
            }
    
            return updatedUser;
        });
    }

    const updateUserError = (fieldName, value) => {
        setUserError(prevState => ({
            ...prevState,
            [fieldName]: value
        }));

    };

    const { createUser, sendUserEmailVerification, updateUserDisplayName} = UserAuth();
    const navigateTo = useNavigate();

    const handleSubmit = async (event) =>{
        event.preventDefault();
        setLoading(true);
        const capitalizedFirstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
        const capitalizedLastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase();

        if(userError.email || userError.password || userError.retypePassword){
            return;
        }
        try{
            setEmailAlreadyUsed(false)
            const authUser = await createUser(user.email, user.password)
            await sendUserEmailVerification();
            await updateUserDisplayName(capitalizedFirstName , capitalizedLastName);
            await handleRegisterToDb(authUser.user.uid);
            navigateTo('/home', {replace : true});    
        }catch(error){
            console.error(error.message);
            console.error(error.code)
            setEmailAlreadyUsed(true);
        }
        setLoading(false);
    }

    const handleRegisterToDb = async (userid) => {
        const registeredUserToDB = {
            uid: userid,
            fname: user.firstName,
            lname: user.lastName,
            email: user.email,
        };
        
        try {
            const insertToDb = await createUserToDb(registeredUserToDB);

            if (insertToDb.success) {
                console.log(insertToDb.message);
            } else {
                console.log(insertToDb.message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleBackBtnClick = () =>{
        navigateTo('/');
    }

    return (
        <div className='register'>
            <div className='register-left-side'>
                <div className='register-back-btn'>
                    <ForwardIcon className='register-back-icon' onClick={handleBackBtnClick}/>
                </div>
                <div className='register-bg-container'>
                    <img src={registerBackground} alt='bg'/>
                </div>
            </div>
            <div className='register-right-side'>
                <BrainAnimate className='register-logo-container'/>
                    
                
                <h3 style={{color: '#181A52'}}>Create an account</h3>
                
                <form onSubmit={handleSubmit} style={{marginBottom:'10px'}}>
                    <RegisterTxtField name ='firstName' label='First name' value={user.firstName} onChange={handleTxtFieldChange}/>
                    
                    <RegisterTxtField name ='lastName' label='Last name' value={user.lastName} onChange={handleTxtFieldChange} />

                    <RegisterTxtField 
                        name ='email' 
                        label='Email' 
                        value={user.email} 
                        onChange={handleTxtFieldChange} 
                        error={userError.email || emailAlreadyUsed} 
                        helperText={userError.email || emailAlreadyUsed? (userError.email ? 'Invalid email format': 'Email already in use') : null}/>

                    <RegisterTxtField 
                        name  ='password' 
                        label='Password' 
                        value={user.password} 
                        type='password' 
                        onChange={handleTxtFieldChange}
                        error={userError.password}
                        helperText={userError.password ? 'Password must contain at least 8 characters' : null}/>

                    <RegisterTxtField 
                        name ='retypePassword' 
                        label='Confirm password'
                        value={user.retypePassword} 
                        type='password'
                        onChange={handleTxtFieldChange}
                        error={userError.retypePassword}
                        helperText={userError.retypePassword? 'Password does not match' : null} />        

                    <Button
                        type='submit'
                        variant='contained' 
                        fullWidth
                        size='large'
                        sx={{backgroundColor:'#ffb100', borderRadius: '20px', marginTop: '1rem', height:'5vh', fontFamily:'Poppins'}}
                    >
                        <h4>{loading ? <CircularProgress color="inherit" size="1.5rem" /> : 'Create'}</h4>
                    </Button>
                </form>
                <Typography style={{fontSize:'12px', fontFamily:'Poppins'}}>Already have an account?<span style={{color:'#181A52', cursor: 'pointer', fontWeight:'700'}} onClick={() => navigateTo('/login')}> Sign in</span></Typography> 
            </div>
        </div>
    )
}

export default RegisterPage