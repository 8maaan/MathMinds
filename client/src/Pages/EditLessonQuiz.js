import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, Checkbox, FormControlLabel } from '@mui/material';
import '../PagesCSS/CreateTopic.css';
import TopicContentQuestion from '../ReusableComponents/TopicContentQuestions';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';
import { getLessonQuizById, updateLessonQuiz } from '../API-Services/LessonQuizAPI';
import { useNavigate, useParams } from 'react-router-dom';

const EditLessonQuiz = () => {
    const { lessonQuizId } = useParams();
    const [quizLesson, setQuizLesson] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdministered, setIsAdministered] = useState(false);


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

        const fetchQuizData = async () => {
            try {
                const quizData = await getLessonQuizById(lessonQuizId);
                if (quizData.success) {
                    const { lessonTitle, lessonQuizQA, isAdministered } = quizData.data; // Fetch isAdministered
                    setQuizLesson(lessonTitle);
                    setIsAdministered(isAdministered); // Set isAdministered status
                    const formattedQuestions = Object.entries(lessonQuizQA).map(([key, value], index) => ({
                        id: index.toString(),
                        question: value.question,
                        correctAnswer: value.correctAnswer,
                        incorrectAnswers: Array.isArray(value.incorrectAnswers) ? value.incorrectAnswers : Object.values(value.incorrectAnswers)
                    }));
                    setQuizQuestions(formattedQuestions);
                } else {
                    throw new Error(quizData.message);
                }
            } catch (err) {
                console.error("Error fetching quiz data: ", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
        fetchQuizData();
    }, [lessonQuizId]);

    const handleAddQuestion = () => {
        setQuizQuestions([
            ...quizQuestions,
            { id: quizQuestions.length.toString(), question: '', correctAnswer: '', incorrectAnswers: ['', '', ''] }
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
        event.preventDefault();

        const lessonQuizQA = quizQuestions.reduce((acc, item, index) => {
            acc[index + 1] = {
                question: item.question,
                correctAnswer: item.correctAnswer,
                incorrectAnswers: item.incorrectAnswers
            };
            return acc;
        }, {});

        const requestBody = {
            lessonTitle: quizLesson,
            lessonQuizQA: lessonQuizQA,
            isAdministered: isAdministered
        };

        const response = await updateLessonQuiz(lessonQuizId, requestBody);
        if (response.success) {
            navigate('/lessons-teacher', {
                state: {
                    snackbar: { status: true, severity: 'success', message: response.message }
                }
            });
            console.log(response.message);
        } else {
            console.log(response.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Typography class='createTopic-title'>Edit a quiz</Typography>
                <div className='createTopic-body' sx={{marginTop:'2%'}}>
                    <div className='topic-config-container'>
                        <FormControl sx={{ minWidth: 180, mt: 3 }}>
                            <InputLabel>Select Lesson</InputLabel>
                            <Select label='Select Lesson' value={quizLesson} autoWidth onChange={(event) => { setQuizLesson(event.target.value) }} required>
                                {lessons && lessons.map(lesson => (
                                    <MenuItem key={lesson.lessonTitle} value={lesson.lessonTitle}>{lesson.lessonTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{ marginTop: '1.5%' }}>
                            <Button onClick={handleAddQuestion} variant='contained' sx={{fontFamily:'Poppins'}}>Add Question</Button>
                        </div>
                    </div>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
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
                                {quizQuestions.length === 0 ? <p style={{ color: 'gray', margin: '10%' }}>No questions currently 📝</p> : null}
                            </div>
                        </div>
                    </DndContext>

                    <FormControl sx={{ mt: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAdministered}
                                    onChange={(e) => setIsAdministered(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Administer Quiz"
                        />
                    </FormControl>

                    <Button type="submit" variant='contained' sx={{ mt: 2, fontFamily:'Poppins' }}>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default EditLessonQuiz;
