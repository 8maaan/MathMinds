import { useEffect, useState } from 'react';
import { FormControl, MenuItem, Select, Slider, Backdrop, Box, Modal, Fade, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function GameSettingsModal({status, handleStatus, gameSettings, onSettingsChange}) {
    const open = status;
    const [numberOfQuestions, setNumberOfQuestions] = useState(gameSettings.questionAmount); 
    const [secondsPerQuestion, setSecondsPerQuestion] = useState(gameSettings.questionTimer); 

    const marks = [
        { value: 5, label: '5s' },
        { value: 10, label: '10s' },
        { value: 15, label: '15s' },
        { value: 20, label: '20s' },
        { value: 25, label: '25s' },
    ];

    useEffect(() => {
        onSettingsChange({
            questionAmount: numberOfQuestions,
            questionTimer: secondsPerQuestion,
        });
    }, [numberOfQuestions, secondsPerQuestion, onSettingsChange]);

    const handleSliderChange = (event) => {
        setSecondsPerQuestion(event.target.value);
        
    }

    const handleSelectChange = (event) => {
        setNumberOfQuestions(event.target.value);
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleStatus}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: { timeout: 500, },}}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography variant="h6" sx={{ mb: 1, color: "#525252"}}>
                            Time limit for each question:
                        </Typography>
                        <Slider
                            aria-label="Custom marks"
                            value={secondsPerQuestion}
                            step={1}
                            onChange={handleSliderChange}
                            valueLabelDisplay="auto"
                            min={5}
                            max={20}
                            marks={marks}
                            sx={{color: '#f2bc46'}}
                        />
                        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#525252"}}>
                            Number of questions:
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                value={numberOfQuestions}
                                inputProps={{ 'aria-label': 'Without label' }}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value={5}>Five (5)</MenuItem>
                                <MenuItem value={10}>Ten (10)</MenuItem>
                                <MenuItem value={15}>Fifteen (15)</MenuItem>
                                <MenuItem value={20}>Twenty (20)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Fade>
            </Modal>
        </div>
  );
}