import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../PagesCSS/CreateTopic.css';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TopicContentContainer = ({ id, content, updateContent, deleteContent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: isEditing });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const handleBlur = (e) => {
        updateContent(id, e.target.innerHTML);
        setIsEditing(false);
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className='topicContentContainer'
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder='Add a content here'
            >
                {content}
            </div>
            <div 
                className='topic-content-actions'
                // ref={setNodeRef}
                style={style}
                // {...attributes}
                // {...listeners}
                >
                <IconButton onClick={() => deleteContent(id)} size="large"><DeleteIcon fontSize='rem' color='error' /></IconButton>
            </div>
        </>
    );
};

export default TopicContentContainer;
