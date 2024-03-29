import { useNavigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'

// TO BE OPTIMIZED

// IF USER NOT LOGGED IN, PREVENT ACCESS, REDIRECT TO /LOGIN
export const ProtectedRoute = ({children}) => {
    const { user } = UserAuth();
    const navigateTo = useNavigate();

    if(!user){
        return navigateTo('/login');
    }

    return children;
}

// SIMILAR TO ProtectedRoute() BUT FOR LOGGED IN USERS
export const GuestRoute = ({children}) => {
    const { user } = UserAuth();
    const navigateTo = useNavigate();
    
    if(user){
        return navigateTo('/profile');
    }

    return children
}
