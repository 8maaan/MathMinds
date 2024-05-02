import React, {useState} from "react";
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, Typography, Box, Button } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../PagesCSS/PracticeLessonList.css';
import { useNavigate } from 'react-router-dom';

const colorPalettes = [
    { summaryBgColor: "#F94848", detailsBgColor: "#F8A792", accordionColor: "#FE7A7A" },
    { summaryBgColor: "#518BBC", detailsBgColor: "#A4C3CF", accordionColor: "#77A4C5" },
    { summaryBgColor: "#4CAE4F", detailsBgColor: "#9BC88B", accordionColor: "#69B865" },
    { summaryBgColor: "#FFB100", detailsBgColor: "#F9D37D", accordionColor: "#FCC13B" }
    // Add more color palettes as needed
];

const lessonsData = [
    { number: 1, title: 'Introduction to React' },
    { number: 2, title: 'Components and Props' },
    { number: 3, title: 'Components and Props2' },
    { number: 4, title: 'Components and Props3' },
    // Add more lesson objects as needed
];

const PracticeLessonList = () => {
    const navigateTo = useNavigate();

    const [expanded, setExpanded] = useState(null);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    return(
        <div className='lesson-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {lessonsData.map((lesson, index) => {
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
                                <Typography className="lesson-number" style={{ fontSize: '18px'}}>{`Lesson ${lesson.number}`}</Typography> 
                                <Typography className="lesson-title" style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Poppins'}}>{lesson.title}</Typography>
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
                                <Typography className="lesson-number" sx={{fontFamily:"Poppins", paddingTop:'1%', paddingLeft:'1%'}}>Are you ready to put your newfound skills to the test? Let's practice what we've learned and become masters!</Typography>
                            </Box>

                            <AccordionActions>
                                <Button style={{ backgroundColor: colorPalette.accordionColor, fontFamily:'Poppins', color:'#181A52', fontWeight:'bold' }}>Start</Button>
                            </AccordionActions>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    )
}

export default PracticeLessonList;