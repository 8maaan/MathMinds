import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    validatePassword,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    updateProfile,
    sendEmailVerification
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

    // SEND EMAIL 
    const sendUserEmailVerification = () => {
        return sendEmailVerification(auth.currentUser);
    }

    // GET USER'S UID
    const getUid = () =>{
        return user.uid;
    }

    const updateUserDisplayName = (firstName, lastName) =>{
        const name = `${firstName} ${lastName}`; // Combine first and last name
        return updateProfile(auth.currentUser, { displayName: name});
    }

    //UPDATE USER'S AUTH EMAIL
    const updateUserEmail = async (email) => {
        try {
            await updateEmail(user, email);
            return await sendEmailVerification(user);
        } catch (error) {
            console.error("Error updating email:", error);
            throw error; 
        }
    };

    //UPDATE USER'S AUTH PASSWORD
    const updateUserPassword = (password) =>{
        return updatePassword(user, password);
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
        <UserContext.Provider value={{ createUser, user, logOut, signIn, loading, validateUserPassword, sendPasswordReset, getUid,updateUserEmail,updateUserPassword, updateUserDisplayName, sendUserEmailVerification }}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}
