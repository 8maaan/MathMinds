import { Navigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'
import LoadingAnimations from '../ReusableComponents/LoadingAnimations';
import { useUserRoles } from '../ReusableComponents/useUserRoles';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';

// TO BE OPTIMIZED

// IF USER NOT LOGGED IN, PREVENT ACCESS, REDIRECT TO /LOGIN
// export const TeacherRoute = ({children}) => {
//     const { user } = UserAuth();
//     const { isTeacher } = useUserRoles(user ? user.uid : null);

//     if(!user){
//         return <div> Error 403 Forbidden</div> // CREATE SEPARATE PAGE FOR THIS L8ER
//     }

//     if (isTeacher === null) {
//         return <LoadingAnimations/>;
//     }

//     return isTeacher ? <AppBarWrapper>{children}</AppBarWrapper> : <div> Error 403 Forbidden </div>
// }


export const ProtectedRoute = ({ children, requireTeacher = false, requireAdmin = false }) => {
  const { user, loading } = UserAuth();
  const { isTeacher, isAdmin } = useUserRoles(user ? user.uid : null);

  if (loading) {
    return <LoadingAnimations />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin) {
    if (isAdmin === null) {
      return <LoadingAnimations />;
    }
    if (!isAdmin) {
      return <div>Error 403 Forbidden</div>;
    }
  } else if (requireTeacher) {
    if (isTeacher === null && isAdmin === null) {
      return <LoadingAnimations />;
    }
    if (!isTeacher && !isAdmin) {
      return <div>Error 403 Forbidden</div>;
    }
  }

  return <AppBarWrapper>{children}</AppBarWrapper>;
};

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

export const AppBarWrapper = ({ children }) => {
    return(
        <>
            <ReusableAppBar/>
            {children}
        </>
    )
}
