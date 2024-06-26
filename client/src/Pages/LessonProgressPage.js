import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';
import '../PagesCSS/LessonProgressPage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
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
                                    <ul>
                                        {Object.entries(lessonProgress).map(([lessonTitle, progress]) => (
                                            <li key={lessonTitle}>
                                                {lessonTitle}: {progress}%
                                                <div className="progress-bar-wrapper">
                                                <LinearProgress 
                                            variant="determinate" 
                                            value={(progress)} // Convert progress to a number
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

                                            </li>
                                        ))}
                                    </ul>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonProgressPage;
