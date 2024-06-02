import React, { useEffect, useState } from 'react';
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
            <div className='lessonprog-wrapper'>
                <div className='lessonprog-content-container'>
                    <div className='lessonproginfo-left-side'>
                        <ReusableChoices />
                    </div>
                    <div className='lessonproginfo-right-side'>
                        <div className='lessonprog-container'>
                            <div className='lessonprog-title'>Learning Progress</div>
                            <div className='userlessonprog-container'>
                                {loading ? (
                                    <p>Loading lesson progress...</p>
                                ) : (
                                    lessonProgress ? (
                                        <ul>
                                            {lessonProgress.map(lesson => (
                                                <div key={lesson.lessonId}>
                                                    <div>Title: {lesson.lessonTitle}</div>
                                                    <div>Progress: {lesson.progress}%</div>
                                                </div>
                                            ))}
                                        </ul>
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
