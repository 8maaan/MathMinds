import { Navigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'
import LoadingAnimations from '../ReusableComponents/LoadingAnimations';
import useUserRoles from '../ReusableComponents/useUserRoles';

// TO BE OPTIMIZED

// IF USER NOT LOGGED IN, PREVENT ACCESS, REDIRECT TO /LOGIN
export const TeacherRoute = ({children}) => {
    const { user } = UserAuth();
    const { isTeacher } = useUserRoles(user ? user.uid : null);

    if(!user){
        return <div> Error 403 Forbidden</div> // CREATE SEPARATE PAGE FOR THIS L8ER
    }

    if (isTeacher === null) {
        return null;
    }

    return isTeacher ? children : <div> Error 403 Forbidden </div>
}


export const ProtectedRoute = ({children}) => {
    const { user, loading } = UserAuth();

    if(loading){
        return null;
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
        return null;
    }
    
    if(!user){
        return children
    }

    return <Navigate to='/home'/>
}
