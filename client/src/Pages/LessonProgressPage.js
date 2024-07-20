import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';
import '../PagesCSS/LessonProgressPage.css';
import ReusableChoices from '../ReusableComponents/ReusableChoices';
import { getProgressForAllLessonsFromDb } from '../API-Services/UserAPI';
import { UserAuth } from '../Context-and-routes/AuthContext';

const LessonProgressPage = () => {
    const { user } = UserAuth();
    const [lessonProgress, setLessonProgress] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessonProgress = async () => {
            if (user) {
                const result = await getProgressForAllLessonsFromDb(user.uid);
                if (result.success) {
                    setLessonProgress(result.data);
                    console.log("Lesson Progress Data:", result.data);
                } else {
                    console.error("Failed to fetch lesson progress:", result.message);
                }
                setLoading(false);
            }
        };
        fetchLessonProgress();
    }, [user]);

    return (
        <div className="Profilepage">
            <div className='profile-wrapper'>
                <div className='profile-content-container'>
                    <div className='personalinfo-left-side'>
                        <ReusableChoices />
                    </div>
                    <div className='personalinfo-right-side-lesson'>
                        <div className="PI-container-lesson">
                            <div className="PI-title-lesson">Lesson Progress</div>
                            <div className="lessons-scrollable-container">
                                <div className="lessons-wrapper">
                                    {Object.entries(lessonProgress).map(([lessonTitle, progress]) => (
                                        <div className="lesson-container" key={lessonTitle}>
                                            <div className="lesson-title">{lessonTitle}</div>
                                            <LinearProgress 
                                                className="progress-bar-wrapper"
                                                variant="determinate" 
                                                value={progress} 
                                                sx={{
                                                    height: '0.75rem',
                                                    borderRadius: 5,
                                                    backgroundColor: '#ffffff',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: '#4CAE4F',
                                                        borderRadius: 5,
                                                        margin: "3px"
                                                    }
                                                }}
                                            />
                                            <div className="progress-percentage">{progress}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonProgressPage;
