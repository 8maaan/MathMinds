import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Lottie from 'lottie-react';
import BackgroundChoicesModal from '../LottieFiles/BackgroundChoicesModal';
import AnimationChoicesModal from '../LottieFiles/AnimationChoicesModal';

import "../PagesCSS/CreateTopic.css";

const TopicContentStoryboard = ({ id, storyboardBgImage, storyboardAnimations, deleteContent, updateStoryboardContent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: isEditing });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const [openAnimationChoicesModal, setOpenAnimationChoicesModal] = useState(false);
    const [openBackgroundChoicesModal, setBackgroundChoicesModal] = useState(false);
    const [clickedBox, setClickedBox] = useState(null);
    const [loadedAnimations, setLoadedAnimations] = useState({});

    useEffect(() => {
        // Load animation data when paths change
        const loadAnimations = async () => {
            const newLoadedAnimations = {};
            for (let i = 0; i < storyboardAnimations.length; i++) {
                if (storyboardAnimations[i]) {
                    try {
                        const animationModule = await import(`../LottieFiles/LottieAnimations${storyboardAnimations[i]}`);
                        newLoadedAnimations[i] = animationModule.default;
                    } catch (error) {
                        console.error(`Failed to load animation: ${storyboardAnimations[i]}`, error);
                    }
                }
            }
            setLoadedAnimations(newLoadedAnimations);
        };
        loadAnimations();
    }, [storyboardAnimations]);

    // console.log("Loaded Animations:",loadedAnimations);
    // console.log("Storyboard Animations:",storyboardAnimations)

    const handleAnimationChoicesModal = (boxId) => {
        setClickedBox(boxId);
        setOpenAnimationChoicesModal(true);
    };

    const handleBackgroundChoicesModal = () => {
        setBackgroundChoicesModal(true);
    };

    const onBackgroundSelect = (imageUrl) => {
        updateStoryboardContent(id, { storyboardBgImage: imageUrl });
    };

    const onAnimationSelect = (animationPath) => {
        const newAnimations = [...storyboardAnimations];
        newAnimations[clickedBox - 1] = animationPath;
        updateStoryboardContent(id, { storyboardAnimations: newAnimations });
        setOpenAnimationChoicesModal(false);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div style={{...style, width: '75%'}}>
                <Button 
                    variant='contained' 
                    onClick={handleBackgroundChoicesModal} 
                    style={{marginTop:'1.5%', backgroundColor:'#c25b89'}}
                >
                    Select Background
                </Button>
            </div>
            <div
                className='topicStoryBoardContainer'
                ref={setNodeRef}
                style={{ ...style, backgroundImage: `url(${storyboardBgImage})` }}
                {...attributes}
                {...listeners}
                onBlur={handleBlur}
                onFocus={handleFocus}
            >   
                {[1, 2, 3, 4].map(boxId => (
                    <div
                        key={boxId}
                        className={`box${boxId}`}
                    >
                        {loadedAnimations[boxId - 1] && (
                            <Lottie
                                animationData={loadedAnimations[boxId - 1]}
                                style={{ height: '150px', width: 'inherit'}}
                            />
                        )}
                        <Button 
                            variant='contained' 
                            style={{backgroundColor:'#c25b89'}}
                            onClick={() => handleAnimationChoicesModal(boxId)}
                        >
                            Choose Animation {boxId}
                        </Button>
                    </div>
                ))}           
            </div>
            <div className='topic-content-actions' style={style}>
                <IconButton onClick={() => deleteContent(id)} size="large">
                    <DeleteIcon fontSize='rem' color='error' />
                </IconButton>
            </div>

            {openAnimationChoicesModal && 
                <AnimationChoicesModal 
                    openModal={openAnimationChoicesModal} 
                    handleModalClose={() => setOpenAnimationChoicesModal(false)}
                    onAnimationSelect={onAnimationSelect}
                />
            }

            {openBackgroundChoicesModal && 
                <BackgroundChoicesModal
                    openModal={openBackgroundChoicesModal} 
                    handleModalClose={() => setBackgroundChoicesModal(false)}
                    onBackgroundSelect={onBackgroundSelect}
                />
            }
        </>
    );
};

export default TopicContentStoryboard;