import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import '../PagesCSS/CreateTopic.css';
import TopicContentContainer from '../ReusableComponents/TopicContentContainer';
import TopicContentQuestion from '../ReusableComponents/TopicContentQuestions';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI';
import { getTopicById, updateTopic } from '../API-Services/TopicAPI';

import ReusableDialog from '../ReusableComponents/ReusableDialog';
import ReusableSnackbar from '../ReusableComponents/ReusableSnackbar';
import TopicContentImage from '../ReusableComponents/TopicContentImage';
import ImageUploader from '../ReusableComponents/ImageUploader';
import TopicContentStoryboard from '../ReusableComponents/TopicContentStoryboard';
import TopicContentYoutubeVid from '../ReusableComponents/TopicContentYoutubeVid';

const EditTopic = () => {
    const { topicId, currentTopicTitle } = useParams();
    const [topicLesson, setTopicLesson] = useState('');
    const [topicContents, setTopicContents] = useState([]);
    const [topicTitle, setTopicTitle] = useState('');
    const [topicDescription, setTopicDescription] = useState('');
    const [lessons, setLessons] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lessonList = await getAllLessonsFromDb();
                if (lessonList.success) {
                    setLessons(lessonList.data);
                } else {
                    throw new Error(lessonList.message);
                }

                const topicData = await getTopicById(topicId);
                console.log('Fetched topic data:', topicData); // Log the topicData to check its structure

                if (topicData.success) {
                    const { lessonId, topicTitle, topicDescription, topicContent } = topicData.data;

                    if (lessonId) {
                        setTopicLesson(lessonId);
                    } else {
                        throw new Error("Invalid lesson data");
                    }

                    setTopicTitle(topicTitle);
                    setTopicDescription(topicDescription);

                    const formattedContent = Object.entries(topicContent).map(([key, value], index) => {
                        if (value.type === 'text') {
                            return {
                                id: index.toString(),
                                type: 'content',
                                content: value.content || '',
                                question: '',
                                correctAnswer: '',
                                incorrectAnswers: ['', '', '']
                            };
                        } else if (value.type === 'question') {
                            return {
                                id: index.toString(),
                                type: 'question',
                                content: '',
                                question: value.question || '',
                                correctAnswer: value.correctAnswer || '',
                                incorrectAnswers: Array.isArray(value.incorrectAnswers) 
                                    ? value.incorrectAnswers 
                                    : Object.values(value.incorrectAnswers)
                            };
                        } else if (value.type === 'image') {
                            return {
                                id: index.toString(),
                                type: 'image',
                                imageUrl: value.imageUrl || '',
                                imageDescription: value.imageDescription || '',
                            };
                        } else if (value.type === 'storyboard') {
                            return {
                                id: index.toString(),
                                type: 'storyboard',
                                storyboardBgImage: value.storyboardBgImage,
                                storyboardAnimations: value.storyboardAnimations
                            }
                        } else if (value.type === 'youtubeVid') {
                            return {
                                id: index.toString(),
                                type: 'youtubeVid',
                                youtubeLink: value.youtubeLink,
                                youtubeVidDescription: value.youtubeVidDescription
                            }
                        }
                        return null;
                    });

                    setTopicContents(formattedContent);
                    console.log('Formatted topic contents:', formattedContent); // Log the formatted content
                } else {
                    throw new Error(topicData.message);
                }
            } catch (err) {
                console.error("Error fetching data: ", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [topicId]);

    const handleAddContent = () => {
        setTopicContents([
            ...topicContents,
            { id: topicContents.length.toString(), type: 'content', content: '' }
        ]);
    };

    const handleAddQuestion = () => {
        setTopicContents([
            ...topicContents,
            { id: topicContents.length.toString(), type: 'question', question: '', correctAnswer: '', incorrectAnswers: ['', '', ''] }
        ]);
    };

    const handleAddImage = (imageUrl) => {
        setTopicContents([
            ...topicContents,
            { id: topicContents.length.toString(), type: 'image', imageUrl: imageUrl, imageDescription: '' }
        ]);
    };

    const handleAddStoryboard = () => {
        setTopicContents([
            ...topicContents,
            { id: topicContents.length.toString(), type: 'storyboard', storyboardBgImage:'', storyboardAnimations:['','','','']}
        ]);
    }

    const handleAddYoutubeVid = () => {
        setTopicContents([
            ...topicContents,
            { id: topicContents.length.toString(), type: 'youtubeVid', youtubeLink:'', youtubeVidDescription:''}
        ]);
    }

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
                item.id === id ? { ...item, ...updatedQuestion, incorrectAnswers: Array.isArray(updatedQuestion.incorrectAnswers) ? updatedQuestion.incorrectAnswers : ['', '', ''] } : item
            )
        );
    };

    const updateImageDescription = (id, description) => {
        setTopicContents(
            topicContents.map(item =>
                item.id === id && item.type === 'image' ? { ...item, imageDescription: description } : item
            )
        );
    };

    const updateStoryboardContent = (id, updatedContent) => {
        setTopicContents(prevContents => 
            prevContents.map(item => 
                item.id === id 
                    ? { ...item, ...updatedContent } 
                    : item
            )
        );
    };

    const updateYoutubeVidContent = (id, updatedContent) => {
        setTopicContents(prevContents =>
            prevContents.map(item =>
                item.id === id ? { ...item, ...updatedContent } : item
            )
        );
    };

    const deleteContent = (id) => {
        setTopicContents(topicContents.filter(item => item.id !== id));
    };

    const handleSubmit = async () => {
        const topicContentObject = topicContents.reduce((acc, item, index) => {
            if (item.type === 'content') {
                acc[index + 1] = { type: 'text', content: item.content };
            } else if (item.type === 'question') {
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
            } else if (item.type === 'image') {
                acc[index + 1] = { type: 'image', imageUrl: item.imageUrl, imageDescription: item.imageDescription };
            } else if (item.type === 'storyboard') {
                acc[index + 1] = { type: 'storyboard', storyboardBgImage: item.storyboardBgImage, storyboardAnimations: item.storyboardAnimations};
            } else if (item.type === 'youtubeVid') { 
                acc[index + 1] = { type: 'youtubeVid',  youtubeLink: item.youtubeLink, youtubeVidDescription: item.youtubeVidDescription };
            }
            
            return acc;
        }, {});

        const requestBody = {
            lessonId: topicLesson,
            topicTitle,
            topicDescription,
            topicContent: topicContentObject
        };

        const response = await updateTopic(topicId, requestBody);
        if (response.success) {
            handleSnackbarOpen('success', 'Topic has been updated successfully.');
            setTimeout(() => {
                navigateTo('/lessons-teacher');
            }, 1250)
        } else {
            console.error(response.message);
            handleSnackbarOpen('error', 'Could not update this topic, try again later.');
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
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ status: false, severity: '', message: '' });

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
        return null;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log(currentTopicTitle);
    const buttonStyle = {
        bgcolor: '#AA75CB',
        '&:hover': {
            bgcolor: '#9163ad'
        },
        ml: 1,
    };

    return (
        <div>
            <form onSubmit={handleOpenDialog}>
                <Typography class='createTopic-title'>Edit {currentTopicTitle}</Typography>
                <div className='createTopic-body'>
                    <div className='topic-config-container'>
                        <FormControl sx={{ minWidth: 180, mt: 3 }}>
                            <InputLabel>Select Lesson</InputLabel>
                            <Select label='Select Lesson' value={topicLesson} autoWidth onChange={(event) => { setTopicLesson(event.target.value) }} required>
                                {lessons && lessons.map(lesson => (
                                    <MenuItem key={lesson.lessonId} value={lesson.lessonId}>{lesson.lessonTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label='Topic Title' fullWidth required value={topicTitle} onChange={(event) => { setTopicTitle(event.target.value) }} autoComplete='off' />
                        <TextField label='Topic Description' variant='filled' fullWidth required multiline rows={3} value={topicDescription} onChange={(event) => { setTopicDescription(event.target.value) }} autoComplete='off' />
                        <div className='topic-content-choices'>
                            <Button onClick={handleAddContent} variant='contained' sx={{...buttonStyle, ml: 0}}>Add Text</Button>
                            <Button onClick={handleAddQuestion} variant='contained' sx={buttonStyle}>Add Question</Button>
                            <Button onClick={handleAddStoryboard} variant='contained' sx={buttonStyle}>Add Storyboard</Button>
                            <Button onClick ={handleAddYoutubeVid} variant='contained' sx={buttonStyle}>Add Youtube Video</Button>
                            <ImageUploader onImageUpload={handleAddImage} />
                        </div>
                    </div>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className='topic-form-container'>
                            <div className='topic-scrollable'>
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
                                    } else if (item.type === 'image') {
                                        return (
                                            <TopicContentImage
                                                key={item.id}
                                                id={item.id}
                                                imageUrl={item.imageUrl}
                                                imageDescription={item.imageDescription}
                                                updateImageDescription={updateImageDescription}
                                                deleteContent={deleteContent}
                                            />
                                        );
                                    } else if(item.type === 'storyboard'){
                                        return (
                                            <TopicContentStoryboard
                                                key={item.id}
                                                id={item.id}
                                                storyboardBgImage={item.storyboardBgImage}
                                                storyboardAnimations={item.storyboardAnimations}
                                                deleteContent={deleteContent}
                                                updateStoryboardContent={updateStoryboardContent}
                                            />
                                        );
                                    } else if(item.type === 'youtubeVid'){
                                        return (
                                            <TopicContentYoutubeVid
                                                key={item.id}
                                                id={item.id}
                                                youtubeLink={item.youtubeLink}
                                                youtubeVidDescription={item.youtubeVidDescription}
                                                updateYoutubeVidContent={updateYoutubeVidContent}
                                                deleteContent={deleteContent}
                                            />
                                        );
                                    }
                                        return null;
                                    })}
                                </SortableContext>
                                {topicContents.length === 0 ? <p style={{ color: 'gray', margin: '10%' }}>No contents currently 📝</p> : null}
                            </div>
                            
                        </div>
                    </DndContext>
                    <Button 
                        type="submit" 
                        variant='contained' 
                        sx={{mt: 2, backgroundColor:'#ffb100', fontWeight:'600', color: '#181A52', '&:hover': {backgroundColor: '#e39e02'}}} 
                        size='large'
                    >
                            Update
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

export default EditTopic;
