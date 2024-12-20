import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, Typography } from '@mui/material';
import '../PagesCSS/CreatePractice.css';
import PracticeQuestion from '../ReusableComponents/PracticeQuestions';
import ReusableDialog from '../ReusableComponents/ReusableDialog';
import ReusableSnackbar from '../ReusableComponents/ReusableSnackbar'
import { updatePracticeInDb, getPracticeByTopicId, deletePracticeInDb } from '../API-Services/PracticeAPI';
import { useNavigate, useParams } from 'react-router-dom';

const EditPractice = () => {
    const { topicId, currentTopicTitle } = useParams();    
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [practiceId, setPracticeId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ status: false, severity: '', message: '' });


    const navigate = useNavigate();

    useEffect(() => {
        const fetchPractice = async () => {
            try {
                const practiceData = await getPracticeByTopicId(topicId);
                // console.log("PracticeId:",practiceData.data[0].practiceId);
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

    const handleSubmit = async () => {

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

        // console.log("RB:", requestBody);
        // console.log("practiceId:",practiceId);
        // console.log(process.env.REACT_APP_SPRINGBOOT_EDIT_PRACTICE)

        const response = await updatePracticeInDb(practiceId, requestBody);
        if (response.success) {
            navigate('/lessons-teacher', {
                state: {
                    snackbar: { status: true, severity: 'success', message: 'Practice has been updated sucessfully!' }
                }
            });
        } else {
            console.error(response.message);
            navigate('/lessons-teacher', {
                state: {
                    snackbar: { status: true, severity: 'error', message: 'Failed to update practice, try again later.' }
                }
            });
        }
    };

    const handleDelete = async () => {
            try {
                const { success, message } = await deletePracticeInDb(practiceId);
                if (success) {
                    //console.log("Practice deleted successfully:", practiceId);
                    navigate('/lessons-teacher', {
                        state: {
                            snackbar: { status: success, severity: 'success', message: 'Practice has been deleted successfully!' }
                        }
                    });
                } else {
                    handleSnackbarOpen('error', 'Failed to delete practice, try again later.');
                }
            } catch (error) {
                console.error("Failed to delete practice, try again later.", error);
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

    const handleOpenUpdateDialog = (event) => {
        setOpenUpdateDialog(true);
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseUpdateDialog = (confirmed) => {
        setOpenUpdateDialog(false);
        if (confirmed) {
            handleSubmit(); 
        }
    };

    const handleCloseDeleteDialog = (confirmed) => {
        setOpenDeleteDialog(false);
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

    // console.log(currentTopicTitle);
    const buttonStyle = {
        variant: 'contained',
        bgcolor: '#AA75CB',
        '&:hover': {
            bgcolor: '#9163ad'
        },
        mr: 1,
    };

    return (
        <div className='createPractice-bg'>
            <form onSubmit={handleSubmit}>
                <div className='createPractice-body'>
                    <Typography class='createPractice-title'>Edit "{currentTopicTitle}" practice</Typography>
                    <div className='practice-config-container'>
                        <div style={{ marginTop: '1.5%'}}>
                            <Button onClick={handleAddQuestion} variant='contained' sx={buttonStyle}>Add Question</Button>
                            <Button onClick={handleOpenDeleteDialog} variant='contained' color='error' style={{ fontFamily: 'Poppins' }}>Delete Practice</Button>
                        </div>
                    </div>
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
                    <Button onClick={handleOpenUpdateDialog} variant='contained' sx={{mt: 2, backgroundColor:'#ffb100', fontWeight:'600', color: '#181A52', '&:hover': {backgroundColor: '#e39e02'}}}>Update</Button>
                </div>
            </form>
            <ReusableDialog
                status={openUpdateDialog} 
                onClose={handleCloseUpdateDialog} 
                title="Confirm Practice Topic Update" 
                context={`Are you sure you're done editing the contents of the practice for the topic titled "${currentTopicTitle}"?`}
            />
            <ReusableDialog
                status={openDeleteDialog} 
                onClose={handleCloseDeleteDialog} 
                title="Confirm Practice Topic Deletion" 
                context={`Are you sure you want to delete the practice for the topic titled "${currentTopicTitle}"? This action cannot be undone.`}
            />
            <ReusableSnackbar open={snackbar.status} onClose={handleSnackbarClose} severity={snackbar.severity} message={snackbar.message}/>
        </div>
    );
};

export default EditPractice;