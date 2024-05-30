import React from 'react'
import { UserAuth } from '../Context-and-routes/AuthContext'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// FOR TESTING PURPOSES ONLY (ROUTES)
// EDIT LATER

const HomePage = () => {
    const { user, logOut } = UserAuth();
    const navigateTo = useNavigate();

    const handleSignOut = async () =>{
        try{
            await logOut();
            console.log('You are logged out');
            navigateTo('/login');
        }catch (e){
            console.log(e.message);
        }
    }

    return (
        <div style={{marginTop: '10%'}}>
            {/* TESTING ONLY, TO BE REMOVED L8ER */}
            {user ? <p>Hello {user.email} </p> : <p>Not found user</p>}
            <Button variant='contained' size='large' onClick={handleSignOut}> SIGN OUT</Button>
        </div>
    )
}

export default HomePage