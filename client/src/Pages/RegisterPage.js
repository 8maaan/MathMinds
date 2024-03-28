import React, { useState } from 'react'
import '../PagesCSS/RegisterPage.css'
import {Button, TextField} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { txtFieldInputProps } from './LoginPage'
import { UserAuth } from '../Context-and-routes/AuthContext'

const RegisterTxtField = ({name, label, type, value, onChange}) =>{
    return(
        <div className='register-txtField'>
            <TextField
                type={type} 
                variant='outlined' 
                label={label} 
                fullWidth 
                InputProps={txtFieldInputProps}
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

const RegisterPage = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })

    const handleTxtFieldChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    }

    const { createUser } = UserAuth();
    const navigateTo = useNavigate();

    const handleSubmit = async (event) =>{
        event.preventDefault();
        try{
            await createUser(user.email, user.password)
            console.log('Successs');
            navigateTo('/home');
        }catch(e){
            console.log(e.message);
        }
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
                    <RegisterTxtField name ='firstName' label='Enter first name' value={user.firstName} onChange={handleTxtFieldChange}/>
                    <RegisterTxtField name ='lastName' label='Enter last name' value={user.lastName} onChange={handleTxtFieldChange} />
                    <RegisterTxtField name ='email' label='Enter email' value={user.email} onChange={handleTxtFieldChange} />
                    <RegisterTxtField name  ='password' label='Enter password' value={user.password} type='password' onChange={handleTxtFieldChange}/>
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
                    <span style={{color:'#181A52', cursor: 'pointer', fontWeight:'700'}} onClick={() => navigateTo('/login')}> Sign in</span>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage