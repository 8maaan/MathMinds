import React, {useState} from "react";
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

const lessonsTopicData = [
    { tnumber: 1, topicTitle: 'Introduction to React', subtopics: ['JSX', 'Components'] },
    { tnumber: 2, topicTitle: 'Components and Props', subtopics: ['Props', 'State'] },
    { tnumber: 3, topicTitle: 'Components and Props2', subtopics: ['Props2', 'State2'] },
    { tnumber: 4, topicTitle: 'Components and Props2', subtopics: ['Props2', 'State2'] },
    // Add more lesson objects as needed
];

const LessonsTopicAccordion = () => {
    const navigateTo = useNavigate();

    const [expanded, setExpanded] = useState(null);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    return(
        <div>
            {lessonsTopicData.map((topic, index) => {
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
                                <Typography className="topic-number" style={{ fontSize: '20px'}}>{`Topic ${topic.tnumber}`}</Typography> 
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
                                               backgroundColor: colorPalette.accordionColor,
                                               transition: 'background-color', // Add transition for smooth effect
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
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    )
}

export default LessonsTopicAccordion;