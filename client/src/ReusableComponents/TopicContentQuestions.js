import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import "../PagesCSS/CreateTopic.css";

const TopicContentQuestion = ({ id, question, correctAnswer, incorrectAnswers, updateQuestion, deleteContent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: isEditing });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const handleUpdate = (field, value) => {
        const updatedQuestion = { question, correctAnswer, incorrectAnswers, [field]: value };
        updateQuestion(id, updatedQuestion);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div
                className='topicQuestionContainer'
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onBlur={handleBlur}
                onFocus={handleFocus}
            >
                <TextField
                    variant='filled'
                    label="Question"
                    value={question}
                    onChange={e => handleUpdate('question', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Correct Answer"
                    value={correctAnswer}
                    onChange={e => handleUpdate('correctAnswer', e.target.value)}
                    fullWidth
                />
                {incorrectAnswers.map((answer, index) => (
                    <TextField
                        key={index}
                        label={`Incorrect Answer ${index + 1}`}
                        value={answer}
                        onChange={e => {
                            const newIncorrectAnswers = [...incorrectAnswers];
                            newIncorrectAnswers[index] = e.target.value;
                            handleUpdate('incorrectAnswers', newIncorrectAnswers);
                        }}
                        fullWidth
                    />
                ))}
            </div>
            <div className='topic-content-actions'>
                <IconButton onClick={() => deleteContent(id)} size="large"><DeleteIcon fontSize='rem' color='error' /></IconButton>
            </div>
        </>
    );
};

export default TopicContentQuestion;
