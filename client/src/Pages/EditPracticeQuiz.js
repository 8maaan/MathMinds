import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, Typography } from '@mui/material';
import '../PagesCSS/CreateTopic.css';
import TopicContentQuestion from '../ReusableComponents/TopicContentQuestions';
import { getAllPractices, updatePracticeInDb } from '../API-Services/PracticeAPI';
import { useNavigate, useParams } from 'react-router-dom';

const EditPracticeQuiz = () => {
    const { topicId } = useParams();
    const [practices, setPractices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPractices = async () => {
            try {
                const fetchResult = await getAllPractices();
                if (fetchResult.success) {
                    const filteredPractices = fetchResult.data.find(practice => practice.topic.topicId === Number(topicId));
                    if (filteredPractices) {
                        const formattedQuestions = Object.entries(filteredPractices.practice_qa).map(([_, value], index) => ({
                            id: String(index),
                            question: value.question,
                            correctAnswer: value.correctAnswer,
                            incorrectAnswers: Array.isArray(value.incorrectAnswers) ? value.incorrectAnswers : Object.values(value.incorrectAnswers),
                        }));
                        setPractices(formattedQuestions);
                    }
                }
            } catch (e) {
                console.error(e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPractices();
    }, [topicId]);
    
    const handleAddQuestion = () => {
        setPractices([
            ...practices,
            { id: practices.length.toString(), question: '', correctAnswer: '', incorrectAnswers: ['', '', ''] }
        ]);
    };

    const updateQuestion = (id, updatedQuestion) => {
        setPractices(
            practices.map(item =>
                item.id === id ? { ...item, ...updatedQuestion } : item
            )
        );
    };

    const deleteQuestion = (id) => {
        setPractices(practices.filter(item => item.id !== id));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPractices((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const practiceQA = practices.reduce((acc, item, index) => {
            acc[index + 1] = {
                question: item.question,
                correctAnswer: item.correctAnswer,
                incorrectAnswers: item.incorrectAnswers
            };
            return acc;
        }, {});

        const requestBody = {
            practice_qa: practiceQA
        };

        const response = await updatePracticeInDb(topicId, requestBody);
        if (response.success) {
            navigate('/lessons-teacher');
            console.log(response.message);
        } else {
            console.log(response.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Typography class='createTopic-title'>Edit a practice</Typography>
                <div className='createTopic-body' style={{ marginTop: '2%' }}>
                    <div className='topic-config-container'>
                        <div style={{ marginTop: '1.5%' }}>
                            <Button onClick={handleAddQuestion} variant='contained' style={{ fontFamily: 'Poppins' }}>Add Question</Button>
                        </div>
                    </div>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className='topic-form-container'>
                            <SortableContext items={practices.map(item => item.id)} strategy={verticalListSortingStrategy}>
                                {practices.map(item => (
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
                            {practices.length === 0 ? <p style={{ color: 'gray', margin: '10%' }}>No questions currently 📝</p> : null}
                        </div>
                    </DndContext>
                    <Button type="submit" variant='contained' style={{ marginTop: '2%', fontFamily: 'Poppins' }}>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default EditPracticeQuiz;
