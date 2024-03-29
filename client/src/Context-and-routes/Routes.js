import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { UserAuth } from './AuthContext'

// TO BE OPTIMIZED

// IF USER NOT LOGGED IN, PREVENT ACCESS, REDIRECT TO /LOGIN
export const ProtectedRoute = ({children}) => {
    const { user } = UserAuth();
    const location = useLocation();
    if(!user){
        // TEST ALTERNATIVE
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

// SIMILAR TO ProtectedRoute() BUT FOR LOGGED IN USERS
// export const GuestRoute = ({children}) => {
//     const { user } = UserAuth();
//     if(user){
//         return <Navigate to='/home' />
//     }

//     return children
// }
