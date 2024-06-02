import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import PracticeQuestion from '../ReusableComponents/PracticeQuestions';
import { getAllTopicsFromDb } from '../API-Services/TopicAPI';
import { insertPracticeToDb } from '../API-Services/PracticeAPI';
import'../PagesCSS/CreatePractice.css';

const CreatePractice = () => {
    const [practiceTopic, setPracticeTopic] = useState('');
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [topics, setTopics] = useState(null);

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
            <form onSubmit={handleSubmit}>
                <div className='createPractice-body'>
                    <div className='practice-config-container'>
                        {/* Practice Topic */}
                        <FormControl sx={{ minWidth: 180, mt: 3 }}>
                            <InputLabel>Select Topic</InputLabel>
                            <Select label='Select Topic' value={practiceTopic} autoWidth onChange={(event) => { setPracticeTopic(event.target.value) }} required>
                                {topics && topics.map(topic => (
                                    <MenuItem key={topic.topicId} value={topic.topicId}>{topic.topicTitle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{ marginTop: '1.5%' }}>
                            <Button onClick={handleAddQuestion} variant='contained'>Add Question</Button>
                        </div>
                    </div>
                    {/* For practice questions */}
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className='practice-form-container'>
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
                    </DndContext>
                    <Button type="submit" variant='contained' sx={{ mt: 2 }}>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default CreatePractice;
