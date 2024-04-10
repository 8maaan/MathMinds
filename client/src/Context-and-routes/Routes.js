import { Navigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'

// TO BE OPTIMIZED

// IF USER NOT LOGGED IN, PREVENT ACCESS, REDIRECT TO /LOGIN
export const ProtectedRoute = ({children}) => {
    const { user, loading } = UserAuth();

    if(loading){
        return <div>Loading...</div>;
    }

    if(user){
        return children;
    }

    return <Navigate to='/login'/>
}

// SIMILAR TO ProtectedRoute() BUT FOR LOGGED IN USERS
export const GuestRoute = ({children}) => {
    const { user, loading} = UserAuth();

    if(loading){
        return <div>Loading...</div>;
    }
    
    if(!user){
        return children
    }

    return <div>Page Not Found</div>
}