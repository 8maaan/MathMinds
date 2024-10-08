import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { firebaseRTDB } from '../Firebase/firebaseConfig'
import { ref, onValue, off, update, serverTimestamp, push, set, onDisconnect } from "firebase/database";
import { getRandomizedPracticeByTopicId } from "../API-Services/PracticeAPI"
import { UserAuth } from '../Context-and-routes/AuthContext';
import '../PagesCSS/PracticeMultiplayerLobby.css'
import { Button, IconButton, TextField } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import GameSettingsModal from '../ReusableComponents/GameSettingsModal';

const PracticeTempLobby = () => {
    const { roomCode } = useParams();
    const [isHost, setIsHost] = useState(false);
    const [players, setPlayers] = useState({});
    const [roomData, setRoomData] = useState(null);
    const navigateTo = useNavigate();
    const { user } = UserAuth();
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [openGameSettingsModal, setOpenGameSettingsModal] = useState(false);
    const [questionAmount, setQuestionAmount] = useState(10);
    const [questionTimer, setQuestionTimer] = useState(10);
    
    const playerColorList = ['#F94848', '#518BBC', '#4CAE4F', '#FFB100'];
    const chatContainerRef = useRef(null);

    // Scroll to the bottom of the chat whenever messages change because using only CSS doesn't work idk why
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // FirebaseRTDB listener for host, players, chat and disconnection
    useEffect(() => {
        const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);
        const messagesRef = ref(firebaseRTDB, `rooms/${roomCode}/messages`);
        const playerRef = ref(firebaseRTDB, `rooms/${roomCode}/players/${user.uid}`);

        // Attach onDisconnect to remove the player from the room when they leave or disconnect
        onDisconnect(playerRef).remove();
        
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setRoomData(data);
                setPlayers(data.players || {});
                setIsHost(data.host === user.uid);
                // console.log(isHost);

                // Check if the host has disconnected
                if (data.host && !data.players[data.host]) {
                    // Select a new host
                    const playerIds = Object.keys(data.players);
                    if (playerIds.length > 0) {
                        const newHostId = playerIds[0]; // Choose first player as new host
                        update(roomRef, { host: newHostId }); // Update host in Firebase
                    }
                }
            }

            if (data && (data.state === "playing" || data.state === "starting")) {
                navigateTo(`/game/${roomCode}`);
            }
        });

        const messagesUnsubscribe = onValue(messagesRef, (snapshot) => {
            const messagesData = snapshot.val();
            if (messagesData) {
                setMessages(Object.values(messagesData));
            }
        });

        return () => {
            off(roomRef);
            off(messagesRef);
            off(playerRef);
        };
    }, [roomCode, navigateTo, user.uid]);

    useEffect(() => {
        const playerRef = ref(firebaseRTDB, `rooms/${roomCode}/players/${user.uid}`);
    
        // Check if the player is already in the room
        onValue(playerRef, (snapshot) => {
            if (!snapshot.exists()) {
                // Player not in the room, add them back
                try{
                    set(playerRef, {
                        name: (user.displayName).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
                        uid: user.uid,
                    });
                }catch(e){
                    console.log(e)
                }
            }
        });
    
        // Clean up on unmount
        return () => {
            off(playerRef);
        };
    }, [roomCode, user.uid, players, user.displayName]);

    const startGame = async() => {
        // Implement game start logic here
        console.log("Starting game...");
        if (!isHost) return;

        try {
            // console.log("Fetching new questions...");
            const { success, data } = await getRandomizedPracticeByTopicId(roomData.topicId, questionAmount);
            if (success && data.length > 0) {
                const questions = data.map(question => ({
                    ...question,
                    incorrectAnswers: question.incorrectAnswers.filter(answer => answer.trim() !== "")
                }));
                
                const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);

                // Initialize playerScores with all players and a score of 0
                const initialPlayerScores = {};
                Object.keys(roomData.players).forEach(playerId => {
                    initialPlayerScores[playerId] = { total: 0 };
                });

                await update(roomRef, {
                    state: "playing",
                    currentQuestionIndex: -1,
                    questions: questions,
                    playerAnswers: {},
                    playerScores: initialPlayerScores,
                    currentQuestionStartTime: serverTimestamp(),
                    questionTimer: questionTimer,
                    startCountdownIsFinished: false
                });
            } else {
                console.error("Failed to fetch questions");
            }
        } catch (error) {
            console.error("Error starting game:", error);
        }
        
    };

    const handleSendMessage = async () => {
        if (chatInput.trim() === "") return;
    
        const messagesRef = ref(firebaseRTDB, `rooms/${roomCode}/messages`);
        const newMessageRef = push(messagesRef);
    
        await set(newMessageRef, {
            userId: user.uid,
            userName: (user.displayName || "Anon").split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
            message: chatInput,
            timestamp: serverTimestamp()
        });
    
        setChatInput(""); // Clear input after sending
    };

    const handleShowGameSettingsModal = () => {
        setOpenGameSettingsModal(!openGameSettingsModal);
    }

    const handleGameSettingsChange = (settings) => {
        setQuestionAmount(settings.questionAmount);
        setQuestionTimer(settings.questionTimer);
    };

    const gameSettings = {
        questionAmount: questionAmount,
        questionTimer: questionTimer,
    };

    return (
        <div className='pml-body'>
            {/* ROOM DETAILS, CHAT */}
            <div className='pml-left-section'>
                {/* ROOM DETAILS */}
                <div className='pml-left-section-details'>
                    <div className='pml-left-section-title'>
                        <h2>{roomData?.topicTitle}</h2>
                    </div>
                    <div className='pml-left-section-rcs'>
                        
                        <div style={{height: '100%'}}>
                            <h3>Room Code: <span style={{color: '#ba8f22'}}>{roomCode}</span></h3>
                        </div>
                        <div style={{height: '100%', marginLeft: 'auto'}}>
                            {isHost &&
                                <IconButton aria-label="delete" onClick={handleShowGameSettingsModal}>
                                    <SettingsIcon sx={{fontSize: '30px'}}/>
                                </IconButton>
                            }
                        </div>
                        <div style={{height: '100%', marginLeft:'5px'}}>
                            {isHost && 
                            <Button
                                size='large'
                                variant='contained'
                                onClick={startGame}
                                endIcon={<PlayArrowIcon/>}
                                style={{borderRadius: '20px'}}
                            >
                                    Start
                            </Button>}
                        </div>
                    </div>
                </div>
                
                {/* CHAT */}
                <div className='pml-left-section-chat'>
                    <h3>Chat</h3>
                    <div className='pml-left-section-chat-container' ref={chatContainerRef}>
                        {messages.map((msg, index) => (
                            <p key={index}><strong style={{ color: msg.userId === user.uid ? '#dea635' : 'inherit' }}>{msg.userName}:</strong> {msg.message}</p>
                        ))}
                    </div>
                    <div className='pml-left-section-chat-input-container'>
                        <TextField
                            sx={{width: '90%', height: '100%', backgroundColor:'white'}}
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type your message"
                            autoComplete="off"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSendMessage();
                                }
                            }}
                        />
                        <Button
                            variant='text'
                            sx={{width: '10%', height: '100%'}} 
                            onClick={handleSendMessage}
                        >
                                <SendIcon sx={{fontSize: '40px'}}/>
                        </Button>
                    </div>
                </div>
            </div>

            <div className='pml-right-section'>
                {/* PARTICIPANT LIST */}
                <div className='pml-right-section-participants-container'>
                    <div style={{width: '80%'}}>
                        <h2>Players</h2>
                    </div>
                    {Object.entries(players).map(([id, player], index) => (
                        <div 
                            key={id} 
                            className='pml-right-section-participants-name'
                            style={{ backgroundColor: playerColorList[index % playerColorList.length]}}
                        >
                            <p style={{fontWeight:'600'}}>{player.name}</p>
                        </div>
                    ))}
                </div> 
            </div>
            {openGameSettingsModal && 
                <GameSettingsModal 
                    status={openGameSettingsModal} 
                    handleStatus={handleShowGameSettingsModal}
                    gameSettings={gameSettings} 
                    onSettingsChange={handleGameSettingsChange}  
                />
            }
        </div>
    );
}

export default PracticeTempLobby