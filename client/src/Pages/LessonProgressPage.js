import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';
import '../PagesCSS/LessonProgressPage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import ReusableChoices from '../ReusableComponents/ReusableChoices';
import { getProgressForAllLessonsFromDb } from '../API-Services/UserAPI';
import { UserAuth } from '../Context-and-routes/AuthContext';

const LessonProgressPage = () => {
    const { user } = UserAuth();
    const [lessonProgress, setLessonProgress] = useState(null);
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
            <ReusableAppBar />
            <div className='profile-wrapper'>
                <div className='profile-content-container'>
                    <div className='personalinfo-left-side'>
                        <ReusableChoices />
                    </div>
                    <div className='personalinfo-right-side'>
                        <div className="PI-container-lesson">
                            <div className="PI-title">LEARNING PROGRESS</div>
                            <div className="lesson-container">
                                {loading ? (
                                    <p>Loading lesson progress...</p>
                                ) : (
                                    lessonProgress ? (
                                        Object.entries(lessonProgress).map(([lessonTitle, progress]) => (
                                            <div key={lessonTitle} className="lesson-container-bar">
                                                <div className="lesson-title">{lessonTitle}: {progress}%</div>
                                                <div className="progress-bar-wrapper">
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={progress}
                                                        sx={{
                                                            height: '0.75rem',
                                                            width: '98%',
                                                            backgroundColor: '#ffffff',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: '#76c043',
                                                                marginTop: '1.5px',
                                                                borderRadius: 25,
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No lesson progress data available.</p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonProgressPage;
