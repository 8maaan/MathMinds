import React, { useState, useEffect } from "react";
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../PagesCSS/PracticeLessonList.css';
import { useNavigate } from 'react-router-dom';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI'; 
import AccordionCustomButton from "./AccordionCustomButton";
import ForwardIcon from '@mui/icons-material/Forward';

const colorPalettes = [
    { summaryBgColor: "#F94848", detailsBgColor: "#F8A792", accordionColor: "#FE7A7A" },
    { summaryBgColor: "#518BBC", detailsBgColor: "#A4C3CF", accordionColor: "#77A4C5" },
    { summaryBgColor: "#4CAE4F", detailsBgColor: "#9BC88B", accordionColor: "#69B865" },
    { summaryBgColor: "#FFB100", detailsBgColor: "#F9D37D", accordionColor: "#FCC13B" }
    // Add more color palettes as needed
];

const PracticeLessonList = ({ onLessonStart }) => {
    const navigateTo = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [expanded, setExpanded] = useState({}); // Store expanded state for all panels

    useEffect(() => {
        const fetchLessons = async () => {
            const { success, data } = await getAllLessonsFromDb();
            if (success) {
                setLessons(data);

                // Set all panels to be expanded initially
                const initialExpandedState = {};
                data.forEach((_, index) => {
                    initialExpandedState[`panel${index + 1}`] = true;
                });
                setExpanded(initialExpandedState);
            } else {
                console.error("Failed to fetch lessons");
            }
        };
        fetchLessons();
    }, []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded((prevState) => ({
            ...prevState,
            [panel]: isExpanded,
        }));
    };

    const handleStartClick = (lesson) => {
        const { lessonId, lessonTopics } = lesson;
        // console.log("Lesson ID:", lessonId);
        const topicId = lessonTopics.length > 0 ? lessonTopics[0].topicId : null; 
        // console.log("Topic ID:", topicId);
        navigateTo(`/practice-event/${lessonId}/${topicId}`);
    }

    return (
        <div className='lesson-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {lessons.map((lesson, index) => {
                const colorPaletteIndex = index % colorPalettes.length;
                const colorPalette = colorPalettes[colorPaletteIndex];
                const panelId = `panel${index + 1}`;
                const isExpanded = expanded[panelId];

                return (
                    <Accordion
                        sx={{
                            marginTop: '1.5%',
                            borderRadius: "15px",
                            width: '80%',
                        }}
                        key={index}
                        expanded={isExpanded}  // Set expanded based on state
                        onChange={handleChange(panelId)}
                    >
                        <AccordionSummary
                            sx={{
                                backgroundColor: colorPalette.summaryBgColor,
                                borderTopRightRadius: "15px",
                                borderTopLeftRadius: "15px",
                                borderBottomLeftRadius: isExpanded ? '0px' : '15px',
                                borderBottomRightRadius: isExpanded ? '0px' : '15px',
                                textAlign: 'left'
                            }}
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls={`${panelId}-content`}
                            id={`${panelId}-header`}
                        >
                            <div>
                                <Typography className="lesson-number" style={{ fontSize: '18px' }}>Lesson {index + 1}</Typography>
                                <Typography className="lesson-title" style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Poppins' }}>{lesson.lessonTitle}</Typography>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                backgroundColor: colorPalette.detailsBgColor,
                                textAlign: 'left',
                                borderBottomRightRadius: "15px",
                                borderBottomLeftRadius: "15px",
                            }}
                        >
                            <Box>
                                <Typography className="lesson-number" sx={{ fontFamily: "Poppins", paddingTop: '1%', paddingLeft: '1%' }}>{lesson.lessonDescription}</Typography>
                            </Box>

                            <AccordionActions>
                                <ForwardIcon className='arrow' style={{ marginTop: '10px', fontSize:'2.5rem' }} />
                                <AccordionCustomButton
                                    sx={{
                                        backgroundColor: colorPalette.accordionColor, // Existing accordion color
                                        fontFamily: 'Poppins',
                                        color: '#181A52',
                                        fontWeight: 'bold',
                                        summaryBgColor: colorPalette.summaryBgColor, // Pass summaryBgColor for boxShadow
                                        }}
                                    onClick={() => handleStartClick(lesson)}
                                >
                                    Start
                                </AccordionCustomButton>
                            </AccordionActions>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    )
}

export default PracticeLessonList;
