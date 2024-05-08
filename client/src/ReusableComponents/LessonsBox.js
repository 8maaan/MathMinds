import React, { useState, useEffect } from 'react';
import '../PagesCSS/LessonsBox.css';
import LessonsTopicAccordion from './LessonsTopicAccordion';
import { Box } from '@mui/material';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';

const LessonsBox = () => {
    const [lessons, setLessons] = useState([]);

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

    return (
        <div>
            <div className="lessons-container">
                {lessons.map((lesson, index) => (
                    <Box key={index} className="lesson-box">
                        <p className="lesson-number">Lesson {index +1}</p>{/*lesson.lessonId to index+1*/}
                        <h2 className="lesson-title">{lesson.lessonTitle}</h2>
                        <LessonsTopicAccordion lesson={lesson} key={index} />
                    </Box>
                ))}
            </div>
        </div>
    );
};

export default LessonsBox;
