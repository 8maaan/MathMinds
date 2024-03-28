import React from 'react'
import {Button, TextField} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { txtFieldInputProps } from './LoginPage'
import '../PagesCSS/RegisterPage.css'

const RegisterTxtField = ({label, type, }) =>{
    return(
        <div className='register-txtField'>
            <TextField
                type={type} 
                variant='outlined' 
                label={label} 
                fullWidth 
                InputProps={txtFieldInputProps}
            />
        </div>
    )
}

const RegisterPage = () => {
    
    const handleSubmit = (event) =>{
        event.preventDefault();
        console.log('Submitted');
    }

    const navigateTo = useNavigate();
    const navigateToLogin = () =>{
        navigateTo('/login');
    }
    
    return (
        <div className='register'>
            <div className='register-left-side'>
                <div className='register-bg-container'>
                    <img src='https://i.imgur.com/Ojvyzfk.png' alt='bg'/>
                </div>
            </div>
            <div className='register-right-side'>
                <div className='register-logo-container'>
                    <img src='https://i.imgur.com/itMKX5j.png' alt='bg'/>
                </div>
                <h3 style={{color: '#181A52'}}>Create an account</h3>
                
                <form onSubmit={handleSubmit} style={{marginBottom:'10px'}}>
                    <RegisterTxtField label='Enter first name' />
                    <RegisterTxtField label='Enter last name' />
                    <RegisterTxtField label='Enter email' />
                    <RegisterTxtField label='Enter password' type='password' />
                    <RegisterTxtField label='Re-enter password' type='password' />
                    
                    <Button
                        type='submit'
                        variant='contained' 
                        fullWidth
                        size='large'
                        sx={{backgroundColor:'#ffb100', borderRadius: '20px', marginTop: '20px', height:'5vh'}}
                    >
                        <h4>REGISTER</h4>
                    </Button>
                </form>
                <p>Already have an account?
                    <span style={{color:'#181A52', cursor: 'pointer', fontWeight:'700'}} onClick={navigateToLogin}> Sign in</span>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage