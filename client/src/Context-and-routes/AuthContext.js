import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    validatePassword,
    sendPasswordResetEmail
} from "firebase/auth";

import { auth } from "../Firebase/firebaseConfig";

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    // REGISTER A USER
    const createUser = (email, password) => {
        // setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // LOG-IN
    const signIn = (email, password) => {
        // setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    // SIGN OUT
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    // VALIDATE PASSWORD

    const validateUserPassword = async (password) => {
        return validatePassword(auth, password);
    }
    
    // SEND PASSWORD RESET EMAIL
    const sendPasswordReset = (email) =>{
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () =>{
            unsubscribe();
        }
    },[]);

    return (
        <UserContext.Provider value={{ createUser, user, logOut, signIn, loading, validateUserPassword, sendPasswordReset }}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}