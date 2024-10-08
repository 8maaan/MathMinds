import React, { useState, useEffect } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../PagesCSS/LessonsTopicAccordion.css';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Tune from '@mui/icons-material/Tune';
import { deleteTopicFromDb } from '../API-Services/TopicAPI';
import { getAllPractices } from '../API-Services/PracticeAPI';
import ReusableDialog from "./ReusableDialog";
import ReusableSnackbar from './ReusableSnackbar'

const colorPalettes = [
    { summaryBgColor: "#F94848", detailsBgColor: "#F8A792", accordionColor: "#FE7A7A", hoverColor: "#F94848" },
    { summaryBgColor: "#518BBC", detailsBgColor: "#A4C3CF", accordionColor: "#77A4C5", hoverColor: "#518BBC" },
    { summaryBgColor: "#4CAE4F", detailsBgColor: "#9BC88B", accordionColor: "#69B865", hoverColor: "#4CAE4F" },
    { summaryBgColor: "#FFB100", detailsBgColor: "#F9D37D", accordionColor: "#FCC13B", hoverColor: "#FFB100" }
    // Add more color palettes as needed
];

const TeacherLessonsTopicAccordion = ({ lesson }) => {
    const navigateTo = useNavigate();
    const [expanded, setExpanded] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [lessonTopics, setLessonTopics] = useState(lesson.lessonTopics || []);
    const [snackbar, setSnackbar] = useState({ status: false, severity: '', message: '' });

    // Automatically expand all panels on first render
    useEffect(() => {
        if (lessonTopics.length > 0) {
            setExpanded(lessonTopics.map((_, index) => `panel${lesson.lessonId}-${index + 1}`));
        }
    }, [lessonTopics, lesson.lessonId]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded((prevExpanded) =>
            isExpanded ? [...prevExpanded, panel] : prevExpanded.filter(p => p !== panel)
        );
    };

    const handleStartTopic = (lessonId, topicId) => {
        navigateTo(`/lesson/${lessonId}/${topicId}`);
    };

    const handleEditTopic = (topicId, currentTopicTitle) => {
        // console.log(currentTopicTitle);
        navigateTo(`/edit-topic/${topicId}/${currentTopicTitle}`);
    };

    const handleEditPractice = async (topicId, currentTopicTitle) => {
        try {
            const practices = await getAllPractices();
            const practiceExists = practices.data.some(practice => practice.topic.topicId === Number(topicId));
            if (practiceExists) {
                navigateTo(`/edit-practice/${topicId}/${currentTopicTitle}`);
            } else {
                handleSnackbarOpen('error', 'No practice exists for this topic yet.');
                console.error("No practice exists for this topic yet or Topic ID is missing.");
                return;
            }
    
        } catch (error) {
            console.error("An error has occured:", error);
        }
    };

    const handleOpenDialog = (topicId) => {
        setSelectedTopicId(topicId);
        setOpenDialog(true);
    };

    const handleCloseDialog = (confirmed) => {
        setOpenDialog(false);
        if (confirmed && selectedTopicId) {
            handleDeleteTopic();
        }
        setSelectedTopicId(null);
    };

    const handleDeleteTopic = async () => {
        if (selectedTopicId) {
            try {
                // console.log("Deleting topic ID:", selectedTopicId); // Debugging log
                const { success, message } = await deleteTopicFromDb(selectedTopicId);
                if (success) {
                    console.log("Topic deleted successfully:", selectedTopicId);
                    setLessonTopics(lessonTopics.filter(topic => topic.topicId !== selectedTopicId));
                    handleSnackbarOpen('success', 'Topic has been deleted successfully.');
                } else {
                    console.error("Failed to delete topic:", message);
                    handleSnackbarOpen('error', 'Error deleting a topic, try again later.');
                }
            } catch (error) {
                console.error("An error occurred while deleting the topic:", error);
            }
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

    return (
        <div>
            {lessonTopics.length > 0 ? (
                lessonTopics.map((topic, topicIndex) => {
                    const colorPaletteIndex = topicIndex % colorPalettes.length;
                    const colorPalette = colorPalettes[colorPaletteIndex];
                    const panelId = `panel${lesson.lessonId}-${topicIndex + 1}`;
                    const isExpanded = expanded.includes(panelId);

                    return (
                        <Accordion
                            sx={{
                                marginTop: '1.5%',
                                borderRadius: "10px"
                            }}
                            key={panelId}
                            expanded={isExpanded}
                            onChange={handleChange(panelId)}
                        >
                            <AccordionSummary
                                sx={{
                                    backgroundColor: colorPalette.summaryBgColor,
                                    borderTopRightRadius: "10px",
                                    borderTopLeftRadius: "10px",
                                    borderBottomLeftRadius: isExpanded ? '0px' : '10px',
                                    borderBottomRightRadius: isExpanded ? '0px' : '10px',
                                    textAlign: 'left'
                                }}
                                expandIcon={<ArrowDropDownIcon />}
                            >
                                <div>
                                    <Typography className="topic-number" style={{ fontSize: '18px' }}>{`Topic ${topicIndex + 1}`}</Typography>
                                    <Typography className="topic-title" style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Poppins' }}>{topic.topicTitle}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    backgroundColor: colorPalette.detailsBgColor,
                                    textAlign: 'left',
                                    borderBottomRightRadius: "10px",
                                    borderBottomLeftRadius: "10px"
                                }}
                            >
                                <Typography className="lesson-number" sx={{ fontFamily: "Poppins", paddingTop: '1%', paddingLeft: '1%' }}>{topic.topicDescription}</Typography>
                                
                                <AccordionActions>
                                    <Tooltip title="Edit Practice">
                                        <IconButton onClick={() => handleEditPractice(topic.topicId, topic.topicTitle)}>
                                            <Tune
                                                sx={{
                                                    color: "#181A52",
                                                    '&:hover': {
                                                        color: colorPalette.hoverColor,
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Topic">
                                        <IconButton onClick={() => handleEditTopic(topic.topicId, topic.topicTitle)}>
                                            <EditIcon
                                                sx={{
                                                    color: "#181A52",
                                                    '&:hover': {
                                                        color: colorPalette.hoverColor,
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Topic">
                                        <IconButton onClick={() => handleOpenDialog(topic.topicId)}>
                                            <CloseIcon
                                                sx={{
                                                    color: "#181A52",
                                                    marginRight: "12px",
                                                    '&:hover': {
                                                        color: "#FF0000",
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Button
                                        sx={{
                                            backgroundColor: colorPalette.accordionColor,
                                            fontFamily: 'Poppins',
                                            color: '#181A52',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: `${colorPalette.hoverColor}` // Slightly darken color on hover
                                            }
                                        }}
                                        onClick={() => handleStartTopic(topic.lessonId, topic.topicId)}
                                    >
                                        Start
                                    </Button>
                                </AccordionActions>
                              
                            </AccordionDetails>
                        </Accordion>
                    );
                })
            ) : (
                <Typography style={{ color: '#181A52' }}>No topics available yet</Typography>
            )}

            <ReusableDialog
                status={openDialog} 
                onClose={handleCloseDialog} 
                title="Confirm Delete" 
                context="Are you sure you want to delete this topic?"
            />
            <ReusableSnackbar open={snackbar.status} onClose={handleSnackbarClose} severity={snackbar.severity} message={snackbar.message} />
        </div>
    );
};

export default TeacherLessonsTopicAccordion;