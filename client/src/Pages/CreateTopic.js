import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import '../PagesCSS/CreateTopic.css';
import TopicContentContainer from '../ReusableComponents/TopicContentContainer';
import TopicContentQuestion from '../ReusableComponents/TopicContentQuestions';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';
import { insertTopic } from '../API-Services/TopicAPI';
import { useNavigate } from 'react-router-dom';
import ReusableDialog from '../ReusableComponents/ReusableDialog';
import ReusableSnackbar from '../ReusableComponents/ReusableSnackbar';

const CreateTopic = () => {
    // Separated for simplicity 
    const [topicLesson, setTopicLesson] = useState('');
    const [topicContents, setTopicContents] = useState([]);
    const [topicTitle, setTopicTitle] = useState('');
    const [topicDescription, setTopicDescription] = useState('');

    const [loading, setLoading] = useState(false) //FOR CIRCULAR PROGRESS
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ status: false, severity: '', message: '' });

    // Lesson list
    const [lessons, setLessons] = useState(null);

    const navigateTo = useNavigate();

    useEffect(() =>{
        const getLessonList = async () => {
            const lessonList = await getAllLessonsFromDb();
            if(lessonList.success){
                setLessons(lessonList.data);
            } else {
                console.error(lessonList.message);
            }
        }
        getLessonList();
    }, []);

    const handleAddContent = () => {
        setTopicContents([
            ...topicContents,
            { id: topicContents.length.toString(), type: 'content'}
        ]);
    };

    const handleAddQuestion = () => {
        setTopicContents([
            ...topicContents,
            { id: topicContents.length.toString(), type: 'question', question:'', correctAnswer: '', incorrectAnswers:['', '', ''] }
        ]);
    };

    const updateContent = (id, newContent) => {
        setTopicContents(
            topicContents.map(item =>
                item.id === id ? { ...item, content: newContent } : item
            )
        );
    };

    const updateQuestion = (id, updatedQuestion) => {
        setTopicContents(
            topicContents.map(item =>
                item.id === id ? { ...item, ...updatedQuestion } : item
            )
        );
    };

    const deleteContent = (id) => {
        setTopicContents(topicContents.filter(item => item.id !== id));
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        const topicContentObject = topicContents.reduce((acc, item, index) => {
            if (item.type === 'content') {
                acc[index + 1] = { type: 'text', content: item.content };
            } else if (item.type === 'question') {
                // Filter out null values from incorrectAnswers
                const filteredIncorrectAnswers = item.incorrectAnswers.filter(answer => answer !== '');
    
                const incorrectAnswersObj = filteredIncorrectAnswers.reduce((obj, answer, i) => {
                    obj[i] = answer;
                    return obj;
                }, {});
    
                acc[index + 1] = {
                    type: 'question',
                    question: item.question,
                    correctAnswer: item.correctAnswer,
                    incorrectAnswers: incorrectAnswersObj
                };
            }
            return acc;
        }, {});
      
        const requestBody = {
          lesson: { lessonId: topicLesson },
          topicTitle: topicTitle,
          topicDescription: topicDescription,
          topicContent: topicContentObject
        };

        const response = await insertTopic(requestBody);
        if(response.success){
            console.log(response.message); // Use this for snackbar message l8er
            handleSnackbarOpen('success', 'Topic has been created successfully.');
            setTimeout(() => {
                navigateTo('/lessons-teacher');
            }, 1250)
        }else{
            console.log(response.message); // Use this for snackbar message l8er
            handleSnackbarOpen('error', 'Could not create a topic, try again later.');
        }
        setLoading(false);
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

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTopicContents((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div>
            <form onSubmit={handleOpenDialog}>
                <div className='createTopic-body'>
                    <div className='topic-config-container'>
                        {/* Topic Lesson */}
                        <FormControl sx={{minWidth: 180, mt: 3}}>
                            <InputLabel>Select Lesson</InputLabel>
                            <Select label='Select Lesson' value={topicLesson} autoWidth onChange={(event) => {setTopicLesson(event.target.value)}} required>
                                {lessons && lessons.map(lessons => (
                                    <MenuItem key={lessons.lessonId} value={lessons.lessonId}>{lessons.lessonTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Topic Title */}
                        <TextField label='Topic Title' fullWidth required onChange={(event) => {setTopicTitle(event.target.value)}} autoComplete='off'/>
                        {/* Topic Description */}
                        <TextField label='Topic Description' variant='filled' fullWidth required multiline rows={3} onChange={(event) => {setTopicDescription(event.target.value)}} autoComplete='off'/>
                        <div style={{marginTop:'1.5%'}}>
                            <Button onClick={handleAddContent} variant='contained' sx={{backgroundColor: '#AA75CB', '&:hover': {backgroundColor: '#9163ad'}}}>Add Text</Button>
                            <Button onClick={handleAddQuestion} variant='contained' sx={{ml: 1, backgroundColor: '#AA75CB', '&:hover': {backgroundColor: '#9163ad'}}}>Add Question</Button>
                        </div>
                    </div>
                    {/* For topic contents */}
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                        <div className='topic-form-container'>
                            <SortableContext items={topicContents.map(item => item.id)} strategy={verticalListSortingStrategy}>
                                {topicContents.map(item => {
                                    if (item.type === 'content') {
                                        return (
                                            <TopicContentContainer
                                                key={item.id}
                                                id={item.id}
                                                content={item.content}
                                                updateContent={updateContent}
                                                deleteContent={deleteContent}
                                            />
                                        );
                                    } else if (item.type === 'question') {
                                        return (
                                            <TopicContentQuestion
                                                key={item.id}
                                                id={item.id}
                                                question={item.question}
                                                correctAnswer={item.correctAnswer}
                                                incorrectAnswers={item.incorrectAnswers}
                                                updateQuestion={updateQuestion}
                                                deleteContent={deleteContent}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </SortableContext>
                            {topicContents.length === 0 ? <p style={{color: 'gray', margin:'10%'}}>No contents currently 📝</p> : null}
                        </div>
                    </DndContext>
                    <Button 
                        type="submit" 
                        variant='contained' 
                        sx={{mt: 2, backgroundColor:'#ffb100', fontWeight:'600', color: '#181A52', '&:hover': {backgroundColor: '#e39e02'}}} 
                        size='large'
                    >
                            {loading ? <CircularProgress color="inherit" size="1.5rem" /> : 'Submit'}
                    </Button>
                </div>
            </form>
            <ReusableDialog
                status={openDialog} 
                onClose={handleCloseDialog} 
                title="Confirm Topic Creation" 
                context={`Are you sure you want to create the topic titled "${topicTitle}"`}
            />
            <ReusableSnackbar open={snackbar.status} onClose={handleSnackbarClose} severity={snackbar.severity} message={snackbar.message}/>
        </div>
    );
};

export default CreateTopic;
