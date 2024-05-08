import React, {useState, useEffect} from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
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

const LessonsTopicAccordion = ({lesson}) => {
    const navigateTo = useNavigate();
    const [expanded, setExpanded] = useState(null);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };
    

    return (
        <div>
            {lesson.lessonTopics.map((topic, topicIndex) => {
                const colorPaletteIndex = topicIndex % colorPalettes.length;
                const colorPalette = colorPalettes[colorPaletteIndex];
                const isExpanded = expanded === `panel${lesson.lessonId}-${topicIndex + 1}`;

                return (
                    <Accordion
                        sx={{
                            marginTop:'1.5%',
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
                                <Typography className="topic-number" style={{ fontSize: '18px'}}>{`Topic ${topicIndex + 1}`}</Typography>
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
                            <Typography>Hello!</Typography>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
    
    {/*return(
        <div>
            {lessonsData && lessonsData.map((topic, index) => {
                const colorPaletteIndex = index % colorPalettes.length;
                const colorPalette = colorPalettes[colorPaletteIndex];
                const isExpanded = expanded === `panel${index + 1}`;

                return (
                    <Accordion
                        sx={{
                            marginTop:'1.5%',
                            borderRadius: "10px"
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
                                <Typography className="topic-number" style={{ fontSize: '18px'}}>{`Topic ${topic.tnumber}`}</Typography>
                                <Typography className="topic-title" style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Poppins' }}>{topic.topicTitle}</Typography>
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
                                {topic.subtopics.map((subtopic, subIndex) => (
                                    <Box className="accordion-details" 
                                         sx={{ fontSize: '18px',
                                               cursor: 'pointer', 
                                               backgroundColor: colorPalette.accordionColor,
                                               transition: 'background-color',
                                               "&:hover": {
                                                   backgroundColor: `rgba(${parseInt(colorPalette.accordionColor.slice(-6, -4), 16)}, 
                                                                          ${parseInt(colorPalette.accordionColor.slice(-4, -2), 16)}, 
                                                                          ${parseInt(colorPalette.accordionColor.slice(-2), 16)}, 0.5)`, // Change background color on hover to a faded version of the color palette
                                               } 
                                            }} 
                                         key={subIndex}
                                         onClick={()=> navigateTo('*')}>
                                        <Typography className="topic-number">
                                            {`Sub-Topic ${topic.tnumber}.${subIndex + 1}`}
                                        </Typography>
                                        <Typography className="topic-title" 
                                                    style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'Poppins' }}>
                                            {subtopic}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Typography>Hello!</Typography>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    )*/}
}

export default LessonsTopicAccordion;