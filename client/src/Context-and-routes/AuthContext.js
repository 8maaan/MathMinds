import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "firebase/auth";

import { auth } from "../Firebase/firebaseConfig";

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    // REGISTER A USER
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // LOG-IN
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    // SIGN OUT
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
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
        <UserContext.Provider value={{ createUser, user, logOut, signIn, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}