import React from 'react';
import { LinearProgress} from '@mui/material';
import '../PagesCSS/ProfilePage.css'; 
import '../PagesCSS/ProfileLesson.css';
import { useNavigate } from 'react-router-dom';

const ProfileLesson = () => {
   
    const navigate = useNavigate();
    const lessons = [
        { title: "Lesson 1: The test ", progress: 60 },
        { title: "Lesson 2: Test the", progress: 30 }
    ];

    const profilebutton = () =>{
        navigate('/profile');
    }


    const lessonprogressbutton = () => {
        navigate('/profilelesson');
    }
   
    
    

    return (
        <div className="Profilepage">
    <div className='profile-wrapper'>
        <div className='profile-content-container'>
            <div className='personalinfo-left-side'>
                <div className='choices-container'>
                    <div className='PI-button' onClick={profilebutton}>
                        Personal Information
                    </div>
                    <div className='LessonProg-button' onClick={lessonprogressbutton}>
                        Lesson Progress
                    </div>
                    <div className='Badges-button'>
                        Badges
                    </div>
                </div>
            </div>
            <div className='personalinfo-right-side'>
                <div className="PI-container-lesson">
                    <div className="PI-title">LEARNING PROGRESS</div>
                        {lessons.map((lesson, index) => (
                            <div key={index} className="lesson-container">
                                <div className="lesson-title">{lesson.title}</div>
                                <div className="progress-bar-wrapper">
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={lesson.progress}
                                        sx={{
                                            height: '0.75rem',
                                            borderRadius: 5,
                                            backgroundColor: '#ffffff',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#76c043',
                                                borderRadius: 5,
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    </div>
</div>
    );
};

export default ProfileLesson;
