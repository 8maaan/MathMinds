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
import ReusableSnackbar from '../ReusableComponents/ReusableSnackbar';
import ReusableDialog from '../ReusableComponents/ReusableDialog';

const CreatePractice = () => {
    const [selectedLesson, setSelectedLesson] = useState(''); 
    const [practiceTopic, setPracticeTopic] = useState('');
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [openDialog, setOpenDialog] = useState(false); 
    const [snackbar, setSnackbar] = useState({ status: false, severity: '', message: '' });
    const [topicName, setTopicName]= useState('');
 
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

    const handleTopicChange = (event) => {
        const selectedTopicId = event.target.value;
        const selectedTopic = filteredTopics.find(topic => topic.topicId === selectedTopicId);
        
        setPracticeTopic(selectedTopicId);
        setTopicName(selectedTopic?.topicTitle || '');
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
        
        const practiceQAObject = practiceQuestions.reduce((acc, item, index) => {
            
            acc[index + 1] = {
                question: item.question,
                correctAnswer: item.correctAnswer,
                incorrectAnswers: item.incorrectAnswers
            };
            return acc;
        }, {});
        
        const requestBody = {
            topic: { topicId: practiceTopic },
            practice_qa: practiceQAObject
        };
        
        // console.log('Request Body:', requestBody);
        
        const response = await insertPracticeToDb(requestBody);
        // console.log('Response:', response);
        
        if (response.success) {
            handleSnackbarOpen('success', 'Practice has been created successfully!');
            setTimeout(() => {
                navigate('/lessons-teacher');
            }, 1250);
        } else {
            handleSnackbarOpen('error', 'Failed to create practice, try again later.');
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
        }));
    };

    const buttonStyle = {
        variant: 'contained',
        bgcolor: '#AA75CB',
        '&:hover': {
            bgcolor: '#9163ad'
        },
        mt:'5px'
    };

    return (
        <div className='createPractice-bg'>
            <form onSubmit={handleOpenDialog}>
                <div className='createPractice-body'>
                    <Typography class='createPractice-title'>Create a Practice for a Topic</Typography>
                    <div className='practice-config-container'>
                        <div className='practice-select-container'>
                         {/* Select Lesson - Added */}
                         <FormControl variant="filled" sx={{ minWidth: 180, mb: 1 }}>
                            <InputLabel>Select Lesson</InputLabel>
                            <Select label='Select Lesson' value={selectedLesson} autoWidth onChange={handleLessonChange} required sx={{backgroundColor:'#f4f4f4'}}>
                                {lessons.map(lesson => (
                                    <MenuItem key={lesson.lessonId} value={lesson.lessonId}>{lesson.lessonTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Practice Topic - Updated to use filteredTopics */}
                        <FormControl variant="filled" sx={{ minWidth: 180, mt: 3 }}>
                            <InputLabel>Select Topic</InputLabel>
                            <Select label='Select Topic' value={practiceTopic} autoWidth onChange={handleTopicChange} required sx={{backgroundColor:'#f4f4f4'}}>
                                {filteredTopics.map(topic => (
                                    <MenuItem key={topic.topicId} value={topic.topicId}>{topic.topicTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{ marginTop: '1.5%' }}>
                            <Button onClick={handleAddQuestion} variant='contained' sx={buttonStyle}>Add Question</Button>
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
                    <Button type="submit" variant='contained' sx={{mt: 2, backgroundColor:'#ffb100', fontWeight:'600', color: '#181A52', '&:hover': {backgroundColor: '#e39e02'}}}>Create</Button>
                </div>
            </form>
            <ReusableDialog
                status={openDialog} 
                onClose={handleCloseDialog} 
                title="Confirm Practice Topic Creation" 
                context={`Are you sure you want to create the practice for the topic titled ${topicName}?`}
            />
            <ReusableSnackbar open={snackbar.status} onClose={handleSnackbarClose} severity={snackbar.severity} message={snackbar.message}/>
        </div>
    );
};

export default CreatePractice;
