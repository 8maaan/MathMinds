import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Button } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../PagesCSS/LessonsTopicAccordion.css';
import { useNavigate } from 'react-router-dom';

const colorPalettes = [
    { summaryBgColor: "#F94848", detailsBgColor: "#F8A792", accordionColor: "#FE7A7A", hoverColor: "#F94848" },
    { summaryBgColor: "#518BBC", detailsBgColor: "#A4C3CF", accordionColor: "#77A4C5", hoverColor: "#518BBC" },
    { summaryBgColor: "#4CAE4F", detailsBgColor: "#9BC88B", accordionColor: "#69B865", hoverColor: "#4CAE4F" },
    { summaryBgColor: "#FFB100", detailsBgColor: "#F9D37D", accordionColor: "#FCC13B", hoverColor: "#FFB100" }
    // Add more color palettes as needed
];

const LessonsTopicAccordion = ({ lesson }) => {
    const navigateTo = useNavigate();
    const [expanded, setExpanded] = useState(null);
    const [lessonTopics, setLessonTopics] = useState(lesson.lessonTopics || []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleStartTopic = (lessonId, topicId) => {
        navigateTo(`/lesson/${lessonId}/${topicId}`);
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
        </div>
    );
};

export default LessonsTopicAccordion;
