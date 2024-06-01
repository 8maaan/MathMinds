import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/ReusableChoices.css';



export default function ReusableChoices(){

    const navigateTo = useNavigate();

    return (
    
        
                        <div className='choicess-container'>
                            <div className='PI-button' onClick={()=> navigateTo('/profile')}>Personal Information</div>
                            <div className='LessonProg-button' onClick={()=> navigateTo('/lesson-progress')}>Lesson Progress</div>
                            <div className='Badges-button' onClick={()=> navigateTo('/badges')}>Badges</div>
                        </div>
            
                    
                    
    );
}


