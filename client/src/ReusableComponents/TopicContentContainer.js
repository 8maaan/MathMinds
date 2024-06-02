import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DOMPurify from 'dompurify'; /*npm install dompurify -den*/
import '../PagesCSS/CreateTopic.css';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TopicContentContainer = ({ id, content, updateContent, deleteContent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: isEditing });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const handleBlur = (e) => {
        const sanitizedContent = DOMPurify.sanitize(e.target.innerHTML); /*used to clean the HTML before saving it -den*/
        updateContent(id, sanitizedContent);
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
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content)}} // transferred 
            >
                {/* <div dangerouslySetInnerHTML={{ __html: content }} /> ensure html is displayed correctly -den */}
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
