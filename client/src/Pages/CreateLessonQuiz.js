import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import '../PagesCSS/CreateTopic.css';
import TopicContentQuestion from '../ReusableComponents/TopicContentQuestions';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';
import { insertLessonQuiz } from '../API-Services/LessonQuizAPI';
import { useNavigate } from 'react-router-dom';

const CreateLessonQuiz = () => {
    const [quizLesson, setQuizLesson] = useState('');
    const [quizTitle, setQuizTitle] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [lessons, setLessons] = useState([]);

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
            lesson: { lessonId: quizLesson },
            lessonQuizQA: lessonQuizQA
        };

        const response = await insertLessonQuiz(requestBody);
        if (response.success) {
            navigate('/lessons-teacher');
            console.log(response.message);
        } else {
            console.log(response.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='createTopic-body'>
                    <div className='topic-config-container'>
                        {/* Quiz Lesson */}
                        <FormControl sx={{ minWidth: 180, mt: 3 }}>
                            <InputLabel>Select Lesson</InputLabel>
                            <Select label='Select Lesson' value={quizLesson} autoWidth onChange={(event) => { setQuizLesson(event.target.value) }} required>
                                {lessons && lessons.map(lesson => (
                                    <MenuItem key={lesson.lessonId} value={lesson.lessonId}>{lesson.lessonTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Quiz Title */}
                        <TextField 
                            label='Quiz Title' 
                            fullWidth 
                            required 
                            onChange={(event) => { setQuizTitle(event.target.value) }} 
                            autoComplete='off' 
                            value={quizTitle}
                        />
                        <div style={{ marginTop: '1.5%' }}>
                            <Button onClick={handleAddQuestion} variant='contained'>Add Question</Button>
                        </div>
                    </div>
                    {/* For quiz questions */}
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                        <div className='topic-form-container'>
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
                    </DndContext>
                    <Button type="submit" variant='contained' sx={{ mt: 2 }}>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default CreateLessonQuiz;
