import React, { useState, useEffect } from 'react';
import '../PagesCSS/LessonsBox.css';
import LessonsTopicAccordion from './LessonsTopicAccordion';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';

const TeacherLessonsBox = () => {
    const [lessons, setLessons] = useState([]);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [newLessonTopics, setNewLessonTopics] = useState(['']);

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

    const handleAddTopic = () => {
        setNewLessonTopics([...newLessonTopics, '']);
    };

    const handleTopicChange = (index, value) => {
        const updatedTopics = [...newLessonTopics];
        updatedTopics[index] = value;
        setNewLessonTopics(updatedTopics);
    };

    const handleSaveLesson = () => {
        // Add logic to save the new lesson
        console.log('Lesson Title:', newLessonTitle);
        console.log('Topics:', newLessonTopics);
    };

    const handleCancelLesson = () => {
        setShowLessonForm(false);
        setNewLessonTitle('');
        setNewLessonTopics(['']);
    };

    return (
        <div>
            <div className='circular-button-container'>
                <Button
                    class='circular-add-button' 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setShowLessonForm(true)}
                    style={{ margin: '10px' }}
                >
                    +
                </Button>
            </div>
            
            <div className="lessons-container">
                {showLessonForm && (
                    <Box className="new-lesson-form">
                        <Typography class="lesson-title">Create a new lesson</Typography>
                        <TextField
                            label="Lesson Title"
                            fullWidth
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        {newLessonTopics.map((topic, index) => (
                            <TextField
                                key={index}
                                label={`Topic ${index + 1} Title`}
                                fullWidth
                                value={topic}
                                onChange={(e) => handleTopicChange(index, e.target.value)}
                                style={{ marginBottom: '20px' }}
                            />
                        ))}
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={handleAddTopic}
                            style={{ marginBottom: '20px' }}
                        >
                            Add Another Topic
                        </Button>
                        <div className='nlf-button-group'>
                            <Button 
                                variant="contained" 
                                onClick={handleSaveLesson}
                                style={{ marginRight: '10px', backgroundColor:'#ffb100', color: '#181A52', fontFamily: 'Poppins', fontWeight:'bold' }}
                            >
                                Save
                            </Button>
                            <Button 
                                variant="contained"
                                onClick={handleCancelLesson}
                                style={{backgroundColor:'purple', color: '#181A52', fontFamily: 'Poppins', fontWeight:'bold'}}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Box>
                )}
                {lessons.map((lesson, index) => (
                    <Box key={index} className="lesson-box">
                        <p className="lesson-number">Lesson {index + 1}</p>
                        <h2 className="lesson-title">{lesson.lessonTitle}</h2>
                        <LessonsTopicAccordion lesson={lesson} key={index} />
                    </Box>
                ))}
            </div>
        </div>
    );
};

export default TeacherLessonsBox;
