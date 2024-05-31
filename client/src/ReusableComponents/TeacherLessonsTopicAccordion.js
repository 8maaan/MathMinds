import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../PagesCSS/LessonsTopicAccordion.css';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { deleteTopicFromDb } from '../API-Services/TopicAPI';

const colorPalettes = [
    { summaryBgColor: "#F94848", detailsBgColor: "#F8A792", accordionColor: "#FE7A7A", hoverColor: "#F94848" },
    { summaryBgColor: "#518BBC", detailsBgColor: "#A4C3CF", accordionColor: "#77A4C5", hoverColor: "#518BBC" },
    { summaryBgColor: "#4CAE4F", detailsBgColor: "#9BC88B", accordionColor: "#69B865", hoverColor: "#4CAE4F" },
    { summaryBgColor: "#FFB100", detailsBgColor: "#F9D37D", accordionColor: "#FCC13B", hoverColor: "#FFB100" }
    // Add more color palettes as needed
];

const TeacherLessonsTopicAccordion = ({ lesson }) => {
    const navigateTo = useNavigate();
    const [expanded, setExpanded] = useState(null);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [lessonTopics, setLessonTopics] = useState(lesson.lessonTopics || []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleStartTopic = (lessonId, topicId) => {
        navigateTo(`/lesson/${lessonId}/${topicId}`);
    };

    const handleEditTopic = (topicId) => {
        navigateTo(`/edit-topic/${topicId}`);
    };

    const handleOpenDialog = (topicId) => {
        setSelectedTopicId(topicId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTopicId(null);
    };

    const handleDeleteTopic = async () => {
        if (selectedTopicId) {
            try {
                console.log("Deleting topic ID:", selectedTopicId); // Debugging log
                const { success, message } = await deleteTopicFromDb(selectedTopicId);
                if (success) {
                    console.log("Topic deleted successfully:", selectedTopicId);
                    setLessonTopics(lessonTopics.filter(topic => topic.topicId !== selectedTopicId));
                    handleCloseDialog();
                } else {
                    console.error("Failed to delete topic:", message);
                }
            } catch (error) {
                console.error("An error occurred while deleting the topic:", error);
            }
        }
    };

    return (
        <div>
            {lessonTopics.length > 0 ? (
                lessonTopics.map((topic, topicIndex) => {
                    const colorPaletteIndex = topicIndex % colorPalettes.length;
                    const colorPalette = colorPalettes[colorPaletteIndex];
                    const isExpanded = expanded === `panel${lesson.lessonId}-${topicIndex + 1}`;

                    return (
                        <Accordion
                            sx={{
                                marginTop: '1.5%',
                                borderRadius: "10px"
                            }}
                            key={`${lesson.lessonId}-${topicIndex}`}
                            expanded={isExpanded}
                            onChange={handleChange(`panel${lesson.lessonId}-${topicIndex + 1}`)}
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
                                    <Tooltip title="Edit Topic">
                                        <IconButton>
                                            <EditIcon
                                                onClick={() => handleEditTopic(topic.topicId)}
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
                                        <IconButton>
                                            <CloseIcon
                                                onClick={() => handleOpenDialog(topic.topicId)}
                                                sx={{
                                                    color: "#181A52",
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

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle style={{ color: '#181A52' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this topic?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} style={{ color: '#ffb100' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTopic} style={{ color: '#813cb9' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TeacherLessonsTopicAccordion;