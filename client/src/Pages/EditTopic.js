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

const EditTopic = () => {
    const { topicId } = useParams();
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

    const deleteContent = (id) => {
        setTopicContents(topicContents.filter(item => item.id !== id));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            navigateTo('/lessons-teacher');
        } else {
            console.error(response.message);
        }
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Typography class='createTopic-title'>Edit a Topic</Typography>
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
                        <div style={{ marginTop: '1.5%' }}>
                            <Button onClick={handleAddContent} variant='contained'>Add Text</Button>
                            <Button onClick={handleAddQuestion} variant='contained' sx={{ ml: 1 }}>Add Question</Button>
                        </div>
                    </div>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                            {topicContents.length === 0 ? <p style={{ color: 'gray', margin: '10%' }}>No contents currently 📝</p> : null}
                        </div>
                    </DndContext>
                    <Button type="submit" variant='contained' sx={{ mt: 2 }}>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default EditTopic;
