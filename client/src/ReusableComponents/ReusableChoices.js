import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/ReusableChoices.css';
import { useUserRoles } from './useUserRoles';
import { UserAuth } from '../Context-and-routes/AuthContext';



export default function ReusableChoices(){
    const { user } = UserAuth();
    const { isTeacher, isAdmin } = useUserRoles(user ? user.uid : null);
    const navigateTo = useNavigate();

    return (
    
        
        <div className='choicess-container'>
            <div className='Persona-button' onClick={()=> navigateTo('/profile')}>Personal Information</div>
            <div className='Dashboard-button' onClick={()=> navigateTo((isTeacher || isAdmin) ? '/dashboard-analytics' : '/studentDashboard')}>Dashboard</div>
            {/*<div className='LessonProgress-button' onClick={()=> navigateTo('/lesson-progress')}>Lesson Progress</div>
            <div className='Badgess-button' onClick={()=> navigateTo('/badges')}>Badges</div>*/}
        </div>
            
                    
                    
    );
}


