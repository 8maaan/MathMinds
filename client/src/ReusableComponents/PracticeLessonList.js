import React, { useState, useEffect } from "react";
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, Typography, Box, Button } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../PagesCSS/PracticeLessonList.css';
import { useNavigate } from 'react-router-dom';
import { getAllLessonsFromDb } from '../API-Services/LessonAPI'; // Import your API service

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
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const fetchLessons = async () => {
            const { success, data } = await getAllLessonsFromDb();
            if (success) {
                setLessons(data);
            } else {
                console.error("Failed to fetch lessons");
            }
        };
        fetchLessons();
    }, []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleStartClick = (lesson) =>{
        const { lessonId, lessonTopics } = lesson;
        console.log("Lesson ID:", lessonId);
        const topicId = lessonTopics.length > 0 ? lessonTopics[0].topicId : null; // Assuming you want the first topic ID
        console.log("Topic ID:", topicId);
        navigateTo(`/practice-event/${lessonId}/${topicId}`);
    }
    

    return(
        <div className='lesson-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {lessons.map((lesson, index) => {
                const colorPaletteIndex = index % colorPalettes.length;
                const colorPalette = colorPalettes[colorPaletteIndex];
                const isExpanded = expanded === `panel${index + 1}`;

                return (
                    <Accordion
                        sx={{
                            marginTop:'1.5%',
                            borderRadius: "10px",
                            width:'80%',
                        }}
                        key={index}
                        expanded={isExpanded}
                        onChange={handleChange(`panel${index + 1}`)}
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
                            aria-controls={`panel${index + 1}-content`}
                            id={`panel${index + 1}-header`}
                        >
                            <div>
                                <Typography className="lesson-number" style={{ fontSize: '18px'}}>Lesson {index + 1}</Typography> 
                                <Typography className="lesson-title" style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Poppins'}}>{lesson.lessonTitle}</Typography>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                backgroundColor: colorPalette.detailsBgColor,
                                textAlign: 'left',
                                borderBottomRightRadius: "10px",
                                borderBottomLeftRadius: "10px",
                            }}
                        >
                            <Box>
                                <Typography className="lesson-number" sx={{fontFamily:"Poppins", paddingTop:'1%', paddingLeft:'1%'}}>{lesson.lessonDescription}</Typography>
                            </Box>

                            <AccordionActions>
                                <Button
                                    style={{ backgroundColor: colorPalette.accordionColor, fontFamily:'Poppins', color:'#181A52', fontWeight:'bold' }}
                                    onClick={() => handleStartClick(lesson)}
                                >
                                    Start
                                </Button>
                            </AccordionActions>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    )
}

export default PracticeLessonList;

