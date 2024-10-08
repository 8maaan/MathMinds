import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, FormControlLabel, Checkbox } from '@mui/material';
import '../PagesCSS/CreateTopic.css';
import TopicContentQuestion from '../ReusableComponents/TopicContentQuestions';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';
import { insertLessonQuiz } from '../API-Services/LessonQuizAPI';
import { useNavigate } from 'react-router-dom';
import ReusableDialog from '../ReusableComponents/ReusableDialog';
import ReusableSnackbar from '../ReusableComponents/ReusableSnackbar';

const CreateLessonQuiz = () => {
    const [quizLesson, setQuizLesson] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [isAdministered, setIsAdministered] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ status: false, severity: '', message: '' });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLessons = async () => {
            const lessonList = await getAllLessonsFromDb();
            if (lessonList.success) {
                setLessons(lessonList.data);
            } else {
                console.error(lessonList.message);
            }
        };
        fetchLessons();
    }, []);

    const handleLessonChange = (event) => {
        const selectedLessonId = event.target.value;
        setQuizLesson(selectedLessonId);
      
        // Find the selected lesson from the lessons array
        const selectedLesson = lessons.find(lesson => lesson.lessonId === selectedLessonId);
        if (selectedLesson) {
          setSelectedLesson(selectedLesson.lessonTitle);
        }
    };

    const handleAddQuestion = () => {
        setQuizQuestions([
            ...quizQuestions,
            { id: quizQuestions.length.toString(), type: 'question', question: '', correctAnswer: '', incorrectAnswers: ['', '', ''] }
        ]);
    };

    const updateQuestion = (id, updatedQuestion) => {
        setQuizQuestions(
            quizQuestions.map(item =>
                item.id === id ? { ...item, ...updatedQuestion } : item
            )
        );
    };

    const deleteQuestion = (id) => {
        setQuizQuestions(quizQuestions.filter(item => item.id !== id));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setQuizQuestions((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSubmit = async (event) => {
        const lessonQuizQA = quizQuestions.reduce((acc, item, index) => {
            acc[index + 1] = {
                question: item.question,
                correctAnswer: item.correctAnswer,
                incorrectAnswers: item.incorrectAnswers
            };
            return acc;
        }, {});

        const requestBody = {
            lesson: { lessonId: quizLesson },
            lessonQuizQA: lessonQuizQA,
            isAdministered: isAdministered
        };

        const response = await insertLessonQuiz(requestBody);
        if (response.success) {
            handleSnackbarOpen('success', `Quiz for lesson ${selectedLesson} has been created successfully.`);
            setTimeout(() => {
                navigate('/lessons-teacher');
            }, 1250)
        } else {
            handleSnackbarOpen('error', `Could not create a quiz for lesson ${selectedLesson} try again later.`);
        }
    };

    const handleOpenDialog = (event) => {
        event.preventDefault();
        setOpenDialog(true);
    };

    const handleCloseDialog = (confirmed) => {
        setOpenDialog(false);
        if (confirmed) {
            handleSubmit();
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
            <form onSubmit={handleOpenDialog}>
                <Typography class='createTopic-title'>Add Lesson Quiz</Typography>
                <div className='createTopic-body'>
                    <div className='topic-config-container'>
                        {/* Quiz Lesson */}
                        <FormControl sx={{ minWidth: 180, mt: 3 }}>
                            <InputLabel>Select Lesson</InputLabel>
                            <Select
                                label="Select Lesson"
                                value={quizLesson}
                                autoWidth
                                onChange={handleLessonChange}
                                required
                                >
                                {lessons && lessons.map(lesson => (
                                    <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
                                    {lesson.lessonTitle}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{ marginTop: '1.5%' }}>
                            <Button onClick={handleAddQuestion} variant='contained' sx={{ fontFamily:'Poppins' }}>Add Question</Button>
                        </div>
                    </div>

                    {/* Existing quiz questions and submit button */}
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className='topic-form-container'>
                            <div className='topic-scrollable'>
                                <SortableContext items={quizQuestions.map(item => item.id)} strategy={verticalListSortingStrategy}>
                                    {quizQuestions.map(item => (
                                        <TopicContentQuestion
                                            key={item.id}
                                            id={item.id}
                                            question={item.question}
                                            correctAnswer={item.correctAnswer}
                                            incorrectAnswers={item.incorrectAnswers}
                                            updateQuestion={updateQuestion}
                                            deleteContent={deleteQuestion}
                                        />
                                    ))}
                                </SortableContext>
                                {quizQuestions.length === 0 ? <p style={{ color: 'gray', margin: '10%', fontFamily:'Poppins' }}>No questions currently 📝</p> : null}
                            </div>  
                        </div>
                    </DndContext>

                    {/* New: Administer Quiz Option */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isAdministered}
                                onChange={(event) => setIsAdministered(event.target.checked)}
                                color="primary"
                            />
                        }
                        label="Administer quiz"
                        sx={{ mt: 2 }}
                    />

                    <Button type="submit" variant='contained' sx={{ mt: 2, fontFamily:'Poppins' }}>Submit</Button>
                </div>
            </form>
            <ReusableDialog
                status={openDialog} 
                onClose={handleCloseDialog} 
                title="Confirm Lesson Quiz Creation" 
                context={`Are you sure you're done creating the quiz for "${selectedLesson}" lesson?`}
            />
            <ReusableSnackbar open={snackbar.status} onClose={handleSnackbarClose} severity={snackbar.severity} message={snackbar.message}/>
        </div>
    );
};

export default CreateLessonQuiz;
