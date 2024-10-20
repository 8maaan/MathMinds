import { useCallback, useEffect, useState } from 'react'
import api from '../API-Services/axiosConfig';

export const useUserRoles = (uid) => {
    // add other roles later
    const [isTeacher, setIsTeacher] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    const fetchUserRoles = useCallback(async () => {
        try {
            const userRole = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_USER_ROLE}${uid}`);
            const role = userRole.data;
            setIsTeacher(role === 'Teacher');
            setIsAdmin(role === 'Admin');
        } catch (e) {
            console.error(e);
        }
    }, [uid]);

    useEffect(() =>{
        if(uid){
            fetchUserRoles();
        }
    }, [uid, fetchUserRoles])

    return { isTeacher, isAdmin }
}
