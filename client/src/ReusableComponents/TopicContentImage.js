import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import "../PagesCSS/CreateTopic.css";


const TopicContentImage = ({ id, imageUrl, imageDescription, updateImageDescription, deleteContent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: isEditing });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div
                className='topicImageContainer'
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onBlur={handleBlur}
                onFocus={handleFocus}
            >
                
                <div className='topicImageWrapper'>
                    <img src={imageUrl} alt="Topic Content"/>
                </div>
                
                <TextField 
                    label='Image Description' 
                    variant='outlined' 
                    fullWidth 
                    required 
                    multiline 
                    rows={2} 
                    autoComplete='off'
                    sx={{mt: 1.5, width: '70%', height: '70%'}}
                    value={imageDescription}
                    onChange={(e) => updateImageDescription(id, e.target.value)}
                />
            </div>
            <div className='topic-content-actions' style={style}>
                <IconButton onClick={() => deleteContent(id)} size="large"><DeleteIcon fontSize='rem' color='error' /></IconButton>
            </div>
        </>
    );
};

export default TopicContentImage;
