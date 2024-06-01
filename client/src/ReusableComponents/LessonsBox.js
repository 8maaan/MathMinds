import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../PagesCSS/LessonsBox.css';
import LessonsTopicAccordion from './LessonsTopicAccordion';
import { Box, Typography } from '@mui/material';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';

const LessonsBox = () => {
    const [lessons, setLessons] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchLessons = async () => {
            const { success, data } = await getAllLessonsFromDb();
            if (success) {
                setLessons(data);
            } else {
                console.error("Failed to fetch lessons");
            }
        };
        fetchLessons();
    }, []);

    useEffect(() => {
        if (location.state && location.state.lessonId !== undefined && location.state.score !== undefined) {
            setLessons(prevLessons =>
                prevLessons.map(lesson =>
                    lesson.lessonId === location.state.lessonId
                        ? { ...lesson, score: location.state.score }
                        : lesson
                )
            );
        }
    }, [location.state]);

    return (
        <div>
            <div className="lessons-container">
                {lessons.map((lesson, index) => (
                    <Box key={index} className="lesson-box">
                        <p className="lesson-number">Lesson {index + 1}</p>
                        <h2 className="lesson-title">{lesson.lessonTitle}</h2>
                        {lesson.score !== undefined && (
                            <Typography variant="body1" sx={{ mt: 1, color: '#181A52' }}>
                                Quiz Score: {lesson.score}
                            </Typography>
                        )}
                        <LessonsTopicAccordion lesson={lesson} />
                    </Box>
                ))}
            </div>
        </div>
    );
};

export default LessonsBox;
