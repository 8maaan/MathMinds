import React from 'react'
import {Button, TextField} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import '../PagesCSS/LoginPage.css'

export const txtFieldInputProps = {
    sx: {
        borderRadius: '20px',
        backgroundColor: 'white',          
    }
};

const LoginPage = () => {
    
    const handleSubmit = (event) =>{
        event.preventDefault();
        console.log('Submitted');
    }
    
    const navigateTo = useNavigate();
    const navigateToRegistration = () =>{
        navigateTo('/register');
    }

    return (
        <div className='Login'>
            <div className='login-left-side'>
                <div className='login-bg-container'>
                    <img src='https://i.imgur.com/6RYERRr.png' alt='bg'/>
                </div>
            </div>
            <div className='login-right-side'>
                <div className='login-logo-container'>
                    <img src='https://i.imgur.com/itMKX5j.png' alt='logo'/>
                </div>
                <h3 style={{color: '#181A52'}}>Log in to your account</h3>
                
                <form onSubmit={handleSubmit} style={{marginBottom:'10px'}}>
                    <div className='login-txtField'>
                        <TextField 
                            variant='outlined' 
                            label='Enter email' 
                            fullWidth 
                            InputProps={txtFieldInputProps}
                            className='test'
                        />
                    </div>
                    <div className='login-txtField'>
                        <TextField
                            type='password'
                            variant='outlined' 
                            label='Enter password'  
                            fullWidth
                            InputProps={txtFieldInputProps}
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
                <p>Already have an account?
                    <span style={{color:'#181A52', cursor: 'pointer', fontWeight:'700'}} onClick={navigateToRegistration}> Click here</span>
                </p>
            </div>
        </div>
    )
}

export default LoginPage