import { useCallback, useEffect, useState } from 'react'
import api from '../API-Services/axiosConfig';

export const useUserInfo = (uid) => {
    // add other Data later 
    const [userData, setUserData]= useState(null);

    const fetchUserData = useCallback(async () => {
        try{
            const userInfo = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_USER_PROFILE_INFO}?uid=${uid}`);
            setUserData(userInfo.data);
        }catch(e){
            console.error(e);
        }
    }, [uid]);

    useEffect(() =>{
        if(uid){
            fetchUserData();
        }
    }, [uid, fetchUserData])
    
    return { userData }
}
