import React from 'react'
import { UserAuth } from '../Context-and-routes/AuthContext';

// FOR TESTING PURPOSES ONLY (ROUTES)
// EDIT LATER

const HomePage = () => {
    const { user } = UserAuth();
    return (
        <div>
            <h1>HomePage</h1>
            {user ? 
                <>
                    <h2>You are signed in</h2>
                    <h3>Check /login if you can access, if not, good.</h3>
                    <h3>Check /register if you can access, if not, good.</h3>
                    <h3>Go to /profile to logout</h3>
                </>
            :   
                <>
                    <h2>Not signed in</h2>
                    <h3>Check if you can access /profile, if not, good.</h3>
                </>
            }
        </div>
    )
}

export default HomePage