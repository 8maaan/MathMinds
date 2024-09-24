import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';

const TextToSpeech = ({ text, rate = 1, pitch = 1, lang = 'en-US' }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);  // To track if it's speaking
    const [isPaused, setIsPaused] = useState(false);      // To track if it's paused
    const [currentUtterance, setCurrentUtterance] = useState(null);  // To track the current utterance

    const speak = () => {
        if ('speechSynthesis' in window) {
            if (!isSpeaking) {
                // Start speech
                window.speechSynthesis.cancel(); // Clear any previous speech
                const sentences = text.split(/(?<=[.!?])\s+/);
                let utteranceIndex = 0;

                const speakSentence = () => {
                    if (utteranceIndex < sentences.length) {
                        const utterance = new SpeechSynthesisUtterance(sentences[utteranceIndex]);
                        utterance.rate = rate;
                        utterance.pitch = pitch;
                        utterance.lang = lang;

                        utterance.onend = () => {
                            utteranceIndex += 1;
                            speakSentence(); // Proceed to next sentence
                        };

                        window.speechSynthesis.speak(utterance);
                        setCurrentUtterance(utterance); // Store the current utterance
                    } else {
                        // Finished speaking all sentences
                        setIsSpeaking(false); // Reset state when all sentences are finished
                    }
                };

                speakSentence();
                setIsSpeaking(true); // Mark speaking as true
                setIsPaused(false);  // Reset paused state
            } else if (isSpeaking && !isPaused) {
                // Pause speech if already speaking
                window.speechSynthesis.pause();
                setIsPaused(true);
            } else if (isSpeaking && isPaused) {
                // Resume speech if it's paused
                window.speechSynthesis.resume();
                setIsPaused(false);
            }
        } else {
            console.error('Speech synthesis not supported in this browser.');
        }
    };

    const stopSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel(); // Stop the speech
            setIsSpeaking(false);            // Reset state
            setIsPaused(false);              // Reset paused state
        }
    };

    return (
        <div>
            <IconButton onClick={speak}>
                {isSpeaking ? (isPaused ? <PlayCircleIcon/> : <PauseCircleIcon/>) : <VolumeUpIcon/>}
            </IconButton>
            {isSpeaking && 
                <IconButton onClick={stopSpeech}>
                    <StopCircleIcon/>
                </IconButton>
            }
        </div>
    );
};

export default TextToSpeech;
