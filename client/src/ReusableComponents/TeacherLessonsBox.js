import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../PagesCSS/LessonsBox.css';
import TeacherLessonsTopicAccordion from './TeacherLessonsTopicAccordion';
import { Box, Button, TextField, Typography, Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import { getAllLessonsFromDb, insertLessonToDb, updateLessonInDb, deleteLessonFromDb } from '../API-Services/LessonAPI';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ReusableDialog from './ReusableDialog';
import ReusableSnackbar from './ReusableSnackbar';
import QuizIcon from '@mui/icons-material/Quiz';

const TeacherLessonsBox = () => {
    const [lessons, setLessons] = useState([]);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLesson, setCurrentLesson] = useState({ title: '', description: '', lessonId: null });
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [snackbar, setSnackbar] = useState({ status: false, severity: '', message: '' });

    const navigate = useNavigate();
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

    const handleSaveLesson = async () => {
        try {
            if (isEditing && currentLesson.lessonId !== null) {
                const { success, data, error } = await updateLessonInDb(currentLesson.lessonId, currentLesson.title, currentLesson.description);
                if (success) {
                    setLessons(lessons.map(lesson => lesson.lessonId === currentLesson.lessonId ? data : lesson));
                    handleCancelLesson();
                } else {
                    console.error("Failed to update lesson", error);
                }
            } else {
                const { success, data, error } = await insertLessonToDb(currentLesson.title, currentLesson.description);
                if (success) {
                    setLessons([...lessons, data]);
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
        navigate('/create-topic');
        handleMenuClose();
    };

    const handleAddQuizClick = () => {
        navigate('/create-lesson-quiz');
        handleMenuClose();
    };

    const handleAddQuizPracticeClick = () => {
        navigate('/create-practice-quiz');
        handleMenuClose();
    };

    const handleOpenDialog = (lessonId) => {
        setSelectedLessonId(lessonId);
        setOpenDialog(true);
    };

    const handleCloseDialog = (confirmed) => {
        setOpenDialog(false);
        if (confirmed && selectedLessonId) {
            handleDeleteLesson(selectedLessonId);
        }
    };

    const handleDeleteLesson = async () => {
        if (selectedLessonId) {
            const { success, message } = await deleteLessonFromDb(selectedLessonId);
            if (success) {
                setLessons(lessons.filter(lesson => lesson.lessonId !== selectedLessonId));
                handleSnackbarOpen('success', 'Lesson has been deleted successfully.');
            } else {
                console.error("Failed to delete lesson:", message);
                handleSnackbarOpen('error', 'Error deleting a lesson, try again later.');
            }
        }
    };

    const handleEditLesson = (lesson) => {
        setCurrentLesson({ title: lesson.lessonTitle, description: lesson.lessonDescription, lessonId: lesson.lessonId });
        setIsEditing(true);
        setShowLessonForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEditQuiz = (lesson) => {
        console.log(lesson.lessonQuiz);
        if (lesson.lessonQuiz && lesson.lessonQuiz.length > 0) {
            const lessonQuizId = lesson.lessonQuiz[0].lessonQuizId;
            navigate(`/edit-lesson-quiz/${lessonQuizId}`);
        } else {
            handleSnackbarOpen('error', 'Lesson quiz ID is missing');
            console.error("Lesson quiz ID is missing");
        }
    };

    const handleSnackbarOpen = (severity, message) => {
        setSnackbar({ status: true, severity, message });
    };

    const handleSnackbarClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar((prevSnackbar) => ({
            ...prevSnackbar,
            status: false
        }))
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
                    <MenuItem onClick={handleAddQuizClick}>Add a Quiz</MenuItem>
                    <MenuItem onClick={handleAddQuizPracticeClick}>Add a Quiz For Practice</MenuItem>
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
                            <Tooltip title="Edit Quiz">
                                <IconButton
                                    aria-label="edit-quiz"
                                    onClick={() => handleEditQuiz(lesson)}
                                    className='edit-quiz-button'
                                >
                                    <QuizIcon
                                        sx={{
                                            color: "#181A52",
                                            '&:hover': {
                                                color: "#4CAE4F",
                                                cursor: 'pointer'
                                            }
                                        }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Lesson">
                                <IconButton
                                    aria-label="edit"
                                    onClick={() => handleEditLesson(lesson)}
                                    className='edit-button'
                                >
                                    <EditIcon
                                        sx={{
                                            color: "#181A52",
                                            '&:hover': {
                                                color: "#FFB100",
                                                cursor: 'pointer'
                                            }
                                        }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Lesson">
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleOpenDialog(lesson.lessonId)}
                                    className='delete-button'
                                >
                                    <CloseIcon
                                        sx={{
                                            color: "#181A52",
                                            '&:hover': {
                                                color: "#FF0000",
                                                cursor: 'pointer'
                                            }
                                        }} />
                                </IconButton>
                            </Tooltip>
                            
                        </div>
                        <div>
                            <p className="lesson-number">Lesson {index + 1}</p>
                            <Typography sx={{fontSize:"30px", fontWeight:"bold", fontFamily:"Poppins", marginBottom:"15px"}}>{lesson.lessonTitle}</Typography>
                            {lesson.score !== undefined && (
                                <Typography variant="body1" sx={{ mt: 1, color: '#181A52' }}>
                                    Quiz Score: {lesson.score}
                                </Typography>
                            )}
                        </div>
                        <TeacherLessonsTopicAccordion lesson={lesson} />
                    </Box>
                ))}
            </div>
            
            {/* REPLACED OLD DIALOG TO A REUSABLE DIALOG */}

            <ReusableDialog 
                status={openDialog} 
                onClose={handleCloseDialog} 
                title="Confirm Delete" 
                context="Are you sure you want to delete this lesson? All of its content including the topics, quizzes and progress will also be deleted."
            />
            <ReusableSnackbar open={snackbar.status} onClose={handleSnackbarClose} severity={snackbar.severity} message={snackbar.message}/>
        </div>
    );
};

export default TeacherLessonsBox;