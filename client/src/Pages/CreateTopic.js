import React, { useState } from 'react';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, TextField } from '@mui/material';
import axios from "axios";
import '../PagesCSS/CreateTopic.css';
import TopicContentContainer from '../ReusableComponents/TopicContentContainer';
import TopicContentQuestion from '../ReusableComponents/TopicContentQuestions';

const CreateTopic = () => {
    const [topicContents, setTopicContents] = useState([]);
    const [topicTitle, setTopicTitle] = useState('');

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
        event.preventDefault();
        const topicContentObject = topicContents.reduce((acc, item, index) => {
            if (item.type === 'content') {
                acc[index + 1] = { type: 'text', content: item.content };
            } else if (item.type === 'question') {
                const incorrectAnswersObj = item.incorrectAnswers.reduce((obj, answer, i) => {
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
          lesson: { lessonId: 1 },
          topicTitle: topicTitle,
          topicContent: topicContentObject
        };

        console.log(requestBody);
      
        try {
          const response = await axios.post(process.env.REACT_APP_SPRINGBOOT_CREATE_TOPIC, requestBody);
          console.log(response.data);
        } catch (error) {
          console.error("Error:", error);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTopicContents((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                console.log(arrayMove(items, oldIndex, newIndex))
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    console.log(topicTitle);
    console.log(topicContents);
    return (
        <div>
            <ReusableAppBar />
            <form onSubmit={handleSubmit}>
                <div className='createTopic-body'>
                    <div className='topic-config-container'>
                        <TextField label="Topic Title" fullWidth required onChange={(event) => {setTopicTitle(event.target.value)}}/>
                        <div style={{marginTop:'1.5%'}}>
                            <Button onClick={handleAddContent} variant='contained'>Add Text</Button>
                            <Button onClick={handleAddQuestion} variant='contained' sx={{ml: 1}}>Add Question</Button>
                        </div>
                    </div>
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
                    <Button type="submit" variant='contained' sx={{mt: 2}}>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default CreateTopic;
