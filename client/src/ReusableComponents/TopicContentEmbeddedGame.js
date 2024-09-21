import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import "../PagesCSS/CreateTopic.css";
import GameChoicesModal from '../VirtualManipulative/GameChoicesModal';

const TopicContentEmbeddedGame = ({ id, embeddedGameLink, embeddedGameName, embeddedGameTags, updateEmbeddedGameContent, deleteContent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: isEditing });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const [openGameChoiceModal, setOpenGameChoiceModal] = useState(false);

    const handleOpenGameChoiceModal = () => {
        setOpenGameChoiceModal(true);
    }

    const handleSelectedGame = (choiceData) =>{
        updateEmbeddedGameContent(id, { 
            embeddedGameLink: choiceData.embedLink,
            embeddedGameName: choiceData.name,
            embeddedGameTags: choiceData.tags
        });
    }


    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div style={{...style, marginTop:'1.5%'}}>
                <Button variant="contained" onClick={handleOpenGameChoiceModal}>
                    Select Game
                </Button>
            </div>
            <div
                className='topicEmbeddedGameContainer'
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onBlur={handleBlur}
                onFocus={handleFocus}
            >
                {embeddedGameLink === '' ? 
                    <div style={{textAlign:'center', padding:'4.5%'}}>
                        Click the "Select Game" button to choose a game
                    </div> :
                    <div>
                        <iframe src={embeddedGameLink} width="100%" height="350" title="Embedded Game" allowFullScreen/>
                        <p><span style={{fontWeight:'600'}}>Selected Game:</span> {embeddedGameName}</p>
                        <p><span style={{fontWeight:'600'}}>Tags:</span> {embeddedGameTags}</p>
                    </div>                  
                }
                {openGameChoiceModal && <GameChoicesModal openModal={openGameChoiceModal} handleModalClose={() => setOpenGameChoiceModal(false)} onManipulativeSelect={handleSelectedGame}/>}
            </div>
            <div className='topic-content-actions' style={style}>
                <IconButton onClick={() => deleteContent(id)} size="large"><DeleteIcon fontSize='rem' color='error' /></IconButton>
            </div>
        </>
    );
};

export default TopicContentEmbeddedGame;
