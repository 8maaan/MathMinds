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
            <div className="lessonProgressPage">
                <div className='lessprog-profile-wrapper'>
                    <div className='lessprog-profile-content-container'>
                        <div className='lessprog-personalinfo-left-side'>
                            <ReusableChoices/>
                        </div>
                        <div className='lessprog-personalinfo-right-side'>
                            <div className='lessprog-PI-container'>
                                <div className='lessprog-PI-title'>Lesson Progress</div>
                                <div className="lesprog-lessons-scrollable-container">
                                <div className="lesprog-lessons-wrapper">
                                    {Object.entries(lessonProgress).map(([lessonTitle, progress]) => (
                                        <div className="lesprog-lesson-container" key={lessonTitle}>
                                            <div className="lesprog-lesson-title">{lessonTitle}</div>
                                            <LinearProgress 
                                                className="lesprog-progress-bar-wrapper"
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
                                            <div className="lesprog-progress-percentage">{progress.toFixed(0)}%</div>
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
