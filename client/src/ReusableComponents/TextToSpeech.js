import React, { useState } from 'react';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { IconButton } from '@mui/material';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const TextToSpeech = ({ text, rate = 1, pitch = 1, lang = 'en-US' }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const cleanText = (text) => {
        // Remove HTML tags
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text; // Set the innerHTML
        return tempDiv.innerText; // Get the plain text without HTML tags
    };

    const speak = () => {
        if ('speechSynthesis' in window) {
            if (!isSpeaking) {
                // Stop any ongoing speech and clear the queue
                window.speechSynthesis.cancel();

                const plainText = cleanText(text); // Clean the incoming text
                const sentences = plainText.split(/(?<=[.!?])\s+/);
                let utteranceIndex = 0;

                const speakSentence = () => {
                    if (utteranceIndex < sentences.length) {
                        const utterance = new SpeechSynthesisUtterance(sentences[utteranceIndex]);
                        utterance.rate = rate;
                        utterance.pitch = pitch;
                        utterance.lang = lang;

                        utterance.onend = () => {
                            utteranceIndex += 1;
                            speakSentence(); // Proceed to the next sentence
                        };

                        window.speechSynthesis.speak(utterance);
                    } else {
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
                    <VolumeOffIcon/>
                </IconButton>
            }
        </div>
    );
};

export default TextToSpeech;
