import React from 'react'
import '../PagesCSS/LessonsBox.css'
import LessonsTopicAccordion from './LessonsTopicAccordion';
import { Box } from '@mui/material';

const lessonsData = [
    { number: 1, title: 'Introduction to React' },
    { number: 2, title: 'Components and Props' },
    { number: 3, title: 'Components and Props2' },
    // Add more lesson objects as needed
];

const LessonsBox = () => {
    return (
        <div>
            <div className="lessons-container">
                {lessonsData.map((lesson, index) => (
                    <Box key={index} className="lesson-box">
                        <p className="lesson-number">Lesson {lesson.number}</p>
                        <h2 className="lesson-title">{lesson.title}</h2>
                        <LessonsTopicAccordion/>
                    </Box>
                ))}
            </div>
        </div>
      )
}

export default LessonsBox