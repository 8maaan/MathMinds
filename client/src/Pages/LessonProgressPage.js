import React, { useEffect, useState } from 'react';
import { LinearProgress, CircularProgress } from '@mui/material';
import '../PagesCSS/LessonProgressPage.css';
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
                } else {
                    console.error("Failed to fetch lesson progress:", result.message);
                }
                setLoading(false);
            }
        };
        fetchLessonProgress();
    }, [user]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <div className='lessprog-profile-wrapper'>
                <div className='lessprog-profile-content-container'>
                    <div className='lessprog-personalinfo-right-side'>
                        <div className='lessprog-PI-container'>
                            
                            <div className="lesprog-lessons-wrapper">
                                {Object.entries(lessonProgress).map(([lessonTitle, progress]) => (
                                    <div className="lesprog-lesson-container" key={lessonTitle}>
                                        <div className="lesprog-lesson-header">
                                            <span className="lesprog-lesson-title">{lessonTitle}</span>
                                            <span className="lesprog-progress-percentage">{progress.toFixed(0)}%</span>
                                        </div>
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
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonProgressPage;
