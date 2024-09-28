import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/ReusableChoices.css';



export default function ReusableChoices(){

    const navigateTo = useNavigate();

    return (
    
        
                        <div className='choicess-container'>
                            <div className='Persona-button' onClick={()=> navigateTo('/profile')}>Personal Information</div>
                            <div className='LessonProgress-button' onClick={()=> navigateTo('/lesson-progress')}>Lesson Progress</div>
                            <div className='Badgess-button' onClick={()=> navigateTo('/badges')}>Badges</div>
                        </div>
            
                    
                    
    );
}


