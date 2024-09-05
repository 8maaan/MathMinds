import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, Typography } from '@mui/material';
import '../PagesCSS/CreateTopic.css';
import TopicContentQuestion from '../ReusableComponents/TopicContentQuestions';
import ReusableDialog from '../ReusableComponents/ReusableDialog';
import ReusableSnackbar from '../ReusableComponents/ReusableSnackbar'
import { updatePracticeInDb, getPracticeByTopicId, deletePracticeInDb } from '../API-Services/PracticeAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const EditPractice = () => {
    const { topicId } = useParams();    
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ status: false, severity: '', message: '' });
    const [practiceId, setPracticeId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPractice = async () => {
            try {
                const practiceData = await getPracticeByTopicId(topicId);
                console.log("PracticeId:",practiceData.data[0].practiceId);
                setPracticeId(practiceData.data[0].practiceId);
                if (practiceData.success) {
                    const practiceQA = practiceData.data[0].practice_qa;
                    const formattedQuestions = Object.entries(practiceQA).map(([key, value], index) => ({
                        id: index.toString(),
                        question: value.question,
                        correctAnswer: value.correctAnswer,
                        incorrectAnswers: Array.isArray(value.incorrectAnswers) ? value.incorrectAnswers : Object.values(value.incorrectAnswers)
                    }));
                    setPracticeQuestions(formattedQuestions);
                } else {
                    throw new Error(practiceData.message);
                }
            } catch (e) {
                console.error(e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPractice();
    }, [topicId]);
    
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const practiceQA = practiceQuestions.reduce((acc, item, index) => {
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

        console.log("RB:", requestBody);
        console.log("practiceId:",practiceId);
        console.log(process.env.REACT_APP_SPRINGBOOT_EDIT_PRACTICE)

        const response = await updatePracticeInDb(practiceId, requestBody);
        if (response.success) {
            navigate('/lessons-teacher');
            console.log(response.message);
        } else {
            console.log(response.message);
        }
    };

    const handleDelete = async () => {
            try {
                const { success, message } = await deletePracticeInDb(topicId);
                if (success) {
                    console.log("Practice deleted successfully:", topicId);
                    navigate('/lessons-teacher');
                    handleSnackbarOpen('success', 'The practice has been deleted successfully.');
                } else {
                    console.error("Failed to delete practice:", message);
                    handleSnackbarOpen('error', 'Error deleting the practice, try again later.');
                }
            } catch (error) {
                console.error("An error occurred while deleting the practice:", error);
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

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = (confirmed) => {
        setOpenDialog(false);
        if (confirmed) {
            handleDelete();
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
                        <div style={{ marginTop: '1.5%'}}>
                            <Button onClick={handleAddQuestion} variant='contained' style={{ fontFamily: 'Poppins', marginRight: '0.5%'}}>Add Question</Button>
                            <Button onClick={handleOpenDialog} variant='contained' color='error' style={{ fontFamily: 'Poppins' }}>Delete Practice</Button>
                        </div>
                    </div>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className='topic-form-container'>
                            <SortableContext items={practiceQuestions.map(item => item.id)} strategy={verticalListSortingStrategy}>
                                {practiceQuestions.map(item => (
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
                            {practiceQuestions.length === 0 ? <p style={{ color: 'gray', margin: '10%' }}>No questions currently 📝</p> : null}
                        </div>
                    </DndContext>
                    <Button type="submit" variant='contained' style={{ marginTop: '2%', fontFamily: 'Poppins' }}>Submit</Button>
                </div>
            </form>

            <ReusableDialog
                status={openDialog} 
                onClose={handleCloseDialog} 
                title="Confirm Delete" 
                context="Are you sure you want to delete this practice?"
            />
            <ReusableSnackbar open={snackbar.status} onClose={handleSnackbarClose} severity={snackbar.severity} message={snackbar.message}/>
        </div>
    );
};

export default EditPractice;