import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../PagesCSS/LessonsTopicAccordion.css';
import { useNavigate } from 'react-router-dom';

const colorPalettes = [
    { summaryBgColor: "#F94848", detailsBgColor: "#F8A792", accordionColor: "#FE7A7A" },
    { summaryBgColor: "#518BBC", detailsBgColor: "#A4C3CF", accordionColor: "#77A4C5" },
    { summaryBgColor: "#4CAE4F", detailsBgColor: "#9BC88B", accordionColor: "#69B865" },
    { summaryBgColor: "#FFB100", detailsBgColor: "#F9D37D", accordionColor: "#FCC13B" }
    // Add more color palettes as needed
];

const TeacherLessonsTopicAccordion = ({ lesson }) => {
    const navigateTo = useNavigate();
    const [expanded, setExpanded] = useState(null);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleStartTopic = (lessonId,topicId) =>{
        console.log(lessonId)
        navigateTo(`/lesson/${lessonId}/${topicId}`)
    }

    const handleEditTopic = (topicId) => {
        navigateTo(`/edit-topic/${topicId}`);
    };

    // Ensure lessonTopics is an array
    const lessonTopics = lesson.lessonTopics || [];

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
                                <Typography className="lesson-number" sx={{fontFamily:"Poppins", paddingTop:'1%', paddingLeft:'1%'}}>{topic.topicDescription}</Typography>
                                
                                <AccordionActions>
                                    {/* Added edit -den */}
                                    <EditIcon onClick={() => handleEditTopic(topic.topicId)} style={{color:"#181A52"}}/>
                                    {/* Added onClick function -Ribo */}
                                    <Button style={{ backgroundColor: colorPalette.accordionColor, fontFamily:'Poppins', color:'#181A52', fontWeight:'bold' }} onClick={()=>{handleStartTopic(topic.lessonId, topic.topicId)}}>Start</Button>
                            </AccordionActions>
                            </AccordionDetails>
                        </Accordion>
                    );
                })
            ) : (
                <Typography style={{color: '#181A52'}}>No topics available yet</Typography>
            )}
        </div>
    );
}

export default TeacherLessonsTopicAccordion;