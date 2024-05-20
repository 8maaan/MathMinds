import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PagesCSS/LessonsBox.css';
import LessonsTopicAccordion from './LessonsTopicAccordion';
import { Box, Button, TextField, Typography, Menu, MenuItem, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getAllLessonsFromDb, insertLessonToDb, deleteLessonFromDb } from '../API-Services/LessonAPI';
import CloseIcon from '@mui/icons-material/Close';

const TeacherLessonsBox = () => {
    const [lessons, setLessons] = useState([]);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [newLessonDescription, setNewLessonDescription] = useState('');
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
        const { success, data, error } = await insertLessonToDb(newLessonTitle, newLessonDescription);
        if (success) {
            setLessons([...lessons, data]);
            handleCancelLesson(); // Reset the form
        } else {
            console.error("Failed to save lesson");
            console.error("Error details:", error);
        }
    };

    const handleCancelLesson = () => {
        setShowLessonForm(false);
        setNewLessonTitle('');
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
        navigate('/*'); // Replace with your actual route
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
                        <Typography class="lesson-title">Create a new lesson</Typography>
                        <TextField
                            label="Lesson Title"
                            fullWidth
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            label="Lesson Description"
                            fullWidth
                            value={newLessonDescription}
                            onChange={(e) => setNewLessonDescription(e.target.value)}
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
                        <IconButton 
                            aria-label="delete"
                            onClick={() => handleOpenDialog(lesson.lessonId)}
                            class='delete-button'
                        >
                            <CloseIcon />
                        </IconButton>
                        <div>
                            <p className="lesson-number">Lesson {index + 1}</p>
                            <h2 className="lesson-title">{lesson.lessonTitle}</h2>    
                        </div>
                        <LessonsTopicAccordion lesson={lesson} />
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
