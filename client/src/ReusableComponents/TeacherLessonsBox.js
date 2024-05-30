import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/LessonsBox.css';
import TeacherLessonsTopicAccordion from './TeacherLessonsTopicAccordion';
import { Box, Button, TextField, Typography, Menu, MenuItem, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getAllLessonsFromDb, insertLessonToDb, updateLessonInDb, deleteLessonFromDb } from '../API-Services/LessonAPI'; // Assuming you have updateLessonInDb
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const TeacherLessonsBox = () => {
    const [lessons, setLessons] = useState([]);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLesson, setCurrentLesson] = useState({ title: '', description: '', lessonId: null });
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const navigate = useNavigate();

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

    const handleSaveLesson = async () => {
        try {
            if (isEditing && currentLesson.lessonId !== null) {
                // If editing an existing lesson, call updateLessonInDb
                const { success, data, error } = await updateLessonInDb(currentLesson.lessonId, currentLesson.title, currentLesson.description);
                if (success) {
                    // Update the lessons state with the updated lesson
                    setLessons(lessons.map(lesson => lesson.lessonId === currentLesson.lessonId ? data : lesson));
                    // Reset the form and editing state
                    handleCancelLesson();
                } else {
                    console.error("Failed to update lesson", error);
                }
            } else {
                // If creating a new lesson, call insertLessonToDb
                const { success, data, error } = await insertLessonToDb(currentLesson.title, currentLesson.description);
                if (success) {
                    // Add the new lesson to the lessons state
                    setLessons([...lessons, data]);
                    // Reset the form
                    handleCancelLesson();
                } else {
                    console.error("Failed to save lesson", error);
                }
            }
        } catch (error) {
            console.error("Error while saving lesson:", error);
        }
    };

    const handleCancelLesson = () => {
        setShowLessonForm(false);
        setCurrentLesson({ title: '', description: '', lessonId: null });
        setIsEditing(false);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddLessonClick = () => {
        setShowLessonForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        handleMenuClose();
    };

    const handleAddTopicClick = () => {
        navigate('/create-topic'); // Replace with your actual route // Replaced -RIBO
        handleMenuClose();
    };

    const handleOpenDialog = (lessonId) => {
        setSelectedLessonId(lessonId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedLessonId(null);
    };

    const handleDeleteLesson = async () => {
        if (selectedLessonId) {
            const { success, message } = await deleteLessonFromDb(selectedLessonId);
            if (success) {
                setLessons(lessons.filter(lesson => lesson.lessonId !== selectedLessonId));
                handleCloseDialog();
            } else {
                console.error("Failed to delete lesson:", message);
            }
        }
    };

    const handleEditLesson = (lesson) => {
        setCurrentLesson({ title: lesson.lessonTitle, description: lesson.lessonDescription, lessonId: lesson.lessonId });
        setIsEditing(true);
        setShowLessonForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <div className='circular-button-container'>
                <Button
                    class='circular-add-button'
                    variant="contained"
                    color="primary"
                    onClick={handleMenuClick}
                    style={{ margin: '10px' }}
                >
                    <p className='circular-add-button-size'>+</p>
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleAddLessonClick}>Add a Lesson</MenuItem>
                    <MenuItem onClick={handleAddTopicClick}>Add a Topic</MenuItem>
                </Menu>
            </div>
            
            <div className="lessons-container">
                {showLessonForm && (
                    <Box className="new-lesson-form">
                        <Typography class="lesson-title">{isEditing ? 'Edit lesson' : 'Create a new lesson'}</Typography>
                        <TextField
                            label="Lesson Title"
                            fullWidth
                            value={currentLesson.title}
                            onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            label="Lesson Description"
                            fullWidth
                            value={currentLesson.description}
                            onChange={(e) => setCurrentLesson({ ...currentLesson, description: e.target.value })}
                            style={{ marginBottom: '20px' }}
                        />
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
                                style={{backgroundColor:'#813cb9', color: '#181A52', fontFamily: 'Poppins', fontWeight:'bold'}}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Box>
                )}
                {lessons.map((lesson, index) => (
                    <Box key={index} className="lesson-box">
                        <div className="lesson-buttons">
                            <IconButton 
                                aria-label="edit"
                                onClick={() => handleEditLesson(lesson)}
                                class='edit-button'
                            >
                                <EditIcon 
                                    sx={{
                                        color: "#181A52",
                                        '&:hover': {
                                            color: "#FFB100",
                                            cursor: 'pointer'
                                        }
                                    }}/>
                            </IconButton>
                            <IconButton 
                                aria-label="delete"
                                onClick={() => handleOpenDialog(lesson.lessonId)}
                                class='delete-button'
                            >
                                <CloseIcon 
                                    sx={{
                                        color: "#181A52",
                                        '&:hover': {
                                            color: "#FF0000",
                                            cursor: 'pointer'
                                        }
                                    }}/>
                            </IconButton>
                        </div>
                        <div>
                            <p className="lesson-number">Lesson {index + 1}</p>
                            <h2 className="lesson-title">{lesson.lessonTitle}</h2>    
                        </div>
                        <TeacherLessonsTopicAccordion lesson={lesson} />
                    </Box>
                ))}
            </div>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle style={{ color: '#181A52' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this lesson?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} style={{ color: '#ffb100' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteLesson} style={{ color: '#813cb9' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TeacherLessonsBox;
