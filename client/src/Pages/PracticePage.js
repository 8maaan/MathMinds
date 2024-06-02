import React, { useState } from 'react';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import PracticeLessonList from '../ReusableComponents/PracticeLessonList';
import '../PagesCSS/PracticePage.css';
import { Typography, Box } from '@mui/material';
import PracticeEvent from './practiceEvent'; // Import the PracticeEvent component

const PracticePage = () => {
    const [selectedLesson, setSelectedLesson] = useState(null);

    const handleLessonStart = (lesson) => {
        setSelectedLesson(lesson);
    };

    return (
        <div>
            <ReusableAppBar />
            <Box>
                <Typography class='practice-header'>Welcome to the Practice Area!</Typography>
                <Typography class='practice-paragraph'>Dive into our practice zone for a fun-filled journey through numbers!</Typography>
            </Box>
            <PracticeLessonList onLessonStart={handleLessonStart} />
            {selectedLesson && (
                <PracticeEvent lessonId={selectedLesson.id} topicId={selectedLesson.selectedTopic.id} />
            )}
        </div>
    );
};

export default PracticePage;

