import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import '../PagesCSS/CreatePractice.css';
import PracticeQuestion from '../ReusableComponents/PracticeQuestions';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';
import { getAllTopicsFromDb } from '../API-Services/TopicAPI';
import { insertPracticeToDb } from '../API-Services/PracticeAPI';
import { useNavigate } from 'react-router-dom';

const CreatePractice = () => {
    const [selectedLesson, setSelectedLesson] = useState(''); 
    const [practiceTopic, setPracticeTopic] = useState('');
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]); 

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

    useEffect(() => {
        const fetchTopics = async () => {
            const topicsList = await getAllTopicsFromDb();
            if (topicsList.success) {
                setTopics(topicsList.data);
            } else {
                console.error(topicsList.message);
            }
        };

        fetchTopics();
    }, []);

    useEffect(() => {
        if (selectedLesson) {
            const filtered = topics.filter(topic => topic.lessonId === selectedLesson);
            setFilteredTopics(filtered); 
        } else {
            setFilteredTopics([]);
        }
    }, [selectedLesson, topics]);

    const handleLessonChange = (event) => {
        setSelectedLesson(event.target.value); 
    };

    const handleAddQuestion = () => {
        setPracticeQuestions([
            ...practiceQuestions,
            { id: practiceQuestions.length.toString(), question: '', correctAnswer: '', incorrectAnswers: ['', '', ''] }
        ]);
    };

    const updateQuestion = (id, updatedQuestion) => {
        setPracticeQuestions(
            practiceQuestions.map(item =>
                item.id === id ? { ...item, ...updatedQuestion } : item
            )
        );
    };

    const deleteQuestion = (id) => {
        setPracticeQuestions(practiceQuestions.filter(item => item.id !== id));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const practiceQAObject = practiceQuestions.reduce((acc, item, index) => {
            const filteredIncorrectAnswers = item.incorrectAnswers.filter(answer => answer !== '');
            acc[index + 1] = {
                question: item.question,
                correctAnswer: item.correctAnswer,
                incorrectAnswers: filteredIncorrectAnswers
            };
            return acc;
        }, {});
    
        const requestBody = {
            topic: { topicId: practiceTopic },
            practice_qa: practiceQAObject
        };
    
        console.log('Request Body:', requestBody);
    
        const response = await insertPracticeToDb(requestBody);
        console.log('Response:', response);
    
        if (response.success) {
            navigate('/lessons-teacher');
            console.log(response.message); 
        } else {
            console.error(response.message); 
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setPracticeQuestions((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };


    return (
        <div>
            <Typography class='createPractice-title'>Create a quiz for Practice</Typography>
            <form onSubmit={handleSubmit}>
                <div className='createPractice-body'>
                    <div className='practice-config-container'>
                        <div className='practice-select-container'>
                         {/* Select Lesson - Added */}
                         <FormControl sx={{ minWidth: 180, mt: 3 }}>
                            <InputLabel>Select Lesson</InputLabel>
                            <Select label='Select Lesson' value={selectedLesson} autoWidth onChange={handleLessonChange} required>
                                {lessons.map(lesson => (
                                    <MenuItem key={lesson.lessonId} value={lesson.lessonId}>{lesson.lessonTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Practice Topic - Updated to use filteredTopics */}
                        <FormControl sx={{ minWidth: 180, mt: 3 }}>
                            <InputLabel>Select Topic</InputLabel>
                            <Select label='Select Topic' value={practiceTopic} autoWidth onChange={(event) => setPracticeTopic(event.target.value)} required>
                                {filteredTopics.map(topic => (
                                    <MenuItem key={topic.topicId} value={topic.topicId}>{topic.topicTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{ marginTop: '1.5%' }}>
                            <Button onClick={handleAddQuestion} variant='contained'>Add Question</Button>
                        </div>
                    </div>
                    </div>
                     {/* For practice questions */}
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                        <div className='practice-form-container'>
                            <div className='practice-scrollable'>
                            <SortableContext items={practiceQuestions.map(item => item.id)} strategy={verticalListSortingStrategy}>
                                    {practiceQuestions.map(item => (
                                        <PracticeQuestion
                                            key={item.id}
                                            id={item.id}
                                            question={item.question}
                                            correctAnswer={item.correctAnswer}
                                            incorrectAnswers={item.incorrectAnswers}
                                            updateQuestion={updateQuestion}
                                            deleteQuestion={deleteQuestion}
                                        />
                                    ))}
                                </SortableContext>
                                {practiceQuestions.length === 0 ? <p style={{ color: 'gray', margin: '10%' }}>No questions currently 📝</p> : null}

                            </div>
                            
                        </div>
                    </DndContext>
                    <Button type="submit" variant='contained' sx={{ mt: 2 }}>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default CreatePractice;
