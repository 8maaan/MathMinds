import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import "../PagesCSS/CreateTopic.css";

const TopicContentYoutubeVid = ({ id, youtubeLink, youtubeVidDescription, updateYoutubeVidContent, deleteContent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: isEditing });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const extractVideoId = (url) => {
        if (!url) return null;
        const regex = /[?&]v=([^&#]*)/;
        const match = url.match(regex);
        return match && match[1] ? match[1] : null;
    };
    
    const handleYoutubeLink = (e) => {
        const inputUrl = e.target.value;
        const formattedYoutubeLink = extractVideoId(inputUrl);
        if (formattedYoutubeLink) {
            const embedUrl = `https://www.youtube.com/embed/${formattedYoutubeLink}`;
            updateYoutubeVidContent(id, { youtubeLink: embedUrl });
        } else {
            updateYoutubeVidContent(id, { youtubeLink: '' });
        }
    };

    const handleVidDescription = (e) => {
        const value = e.target.value;
        updateYoutubeVidContent(id, { youtubeVidDescription: value });
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div
                className='topicYoutubeVidContainer'
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onBlur={handleBlur}
                onFocus={handleFocus}
            >
                <TextField 
                    placeholder='Paste youtube link here *'
                    fullWidth
                    onChange={handleYoutubeLink}      
                    required
                    value={youtubeLink}           
                />
                <div className='yt-embeddedVideo-container'>
                    {youtubeLink ? (
                        <iframe
                            height="350"
                            width="100%"
                            src={youtubeLink}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="YouTube Video"
                            loading="lazy"
                        />
                    ) : (
                        <p style={{color:'white', padding: '25px'}}>Video from YouTube will be shown here</p>
                    )}
                </div>
                <TextField 
                    label='Description' 
                    placeholder='E.g: How to perform subtraction by MathMinds'
                    variant='filled' 
                    fullWidth 
                    required 
                    multiline 
                    rows={2} 
                    autoComplete='off'
                    value={youtubeVidDescription} // Use the description state
                    onChange={handleVidDescription} // Handle description change
                />
            </div>
            <div className='topic-content-actions' style={style}>
                <IconButton onClick={() => deleteContent(id)} size="large"><DeleteIcon fontSize='rem' color='error' /></IconButton>
            </div>
        </>
    );
};

export default TopicContentYoutubeVid;
