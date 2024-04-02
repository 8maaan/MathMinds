import React, { useState } from 'react'
import {Button, TextField} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import '../PagesCSS/LoginPage.css'
import { UserAuth } from '../Context-and-routes/AuthContext';
import loginBackground from '../Images/login-bg.png';
import mathMindsLogo from '../Images/mathminds-logo.png';

export const txtFieldInputProps = {
    sx: {
        borderRadius: '20px',
        backgroundColor: 'white',          
    }
};

const LoginPage = () => {

    const { signIn } = UserAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigateTo = useNavigate();

    const handleSubmit = async (event) =>{
        event.preventDefault();
        try{
            await signIn(email, password);
            console.log('You are logged in!');
            navigateTo('/home', {replace : true});

        }catch(e) {
            console.log(e.message);
        }
    }

    return (
        <div className='Login'>
            <div className='login-left-side'>
                <div className='login-bg-container'>
                    <img src={loginBackground} alt='bg'/>
                </div>
            </div>
            <div className='login-right-side'>
                <div className='login-logo-container'>
                    <img src={mathMindsLogo} alt='logo'/>
                </div>
                <h3 style={{color: '#181A52'}}>Log in to your account</h3>
                
                <form onSubmit={handleSubmit} style={{marginBottom:'10px'}}>
                    <div className='login-txtField'>
                        <TextField 
                            variant='outlined' 
                            label='Enter email' 
                            fullWidth 
                            InputProps={txtFieldInputProps}
                            onChange={(event) => {setEmail(event.target.value)}}
                        />
                    </div>
                    <div className='login-txtField'>
                        <TextField
                            type='password'
                            variant='outlined' 
                            label='Enter password'  
                            fullWidth
                            InputProps={txtFieldInputProps}
                            onChange={(event) => {setPassword(event.target.value)}}
                        />
                    </div>
                    <Button
                        type='submit'
                        variant='contained' 
                        fullWidth
                        size='large'
                        sx={{backgroundColor:'#ffb100', borderRadius: '20px', marginTop: '20px', height:'5vh'}}
                    >
                        <h4>LOG IN</h4>
                    </Button>
                </form>
                <p>No account yet?
                    <span style={{color:'#181A52', cursor: 'pointer', fontWeight:'700'}} onClick={()=> navigateTo('/register')}> Click here</span>
                </p>
            </div>
        </div>
    )
}

export default LoginPage