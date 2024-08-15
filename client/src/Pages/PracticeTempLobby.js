import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { firebaseRTDB } from '../Firebase/firebaseConfig'
import { ref, onValue, off, update, serverTimestamp, push, set } from "firebase/database";
import { getPracticeByTopicId } from "../API-Services/PracticeAPI"
import { UserAuth } from '../Context-and-routes/AuthContext';

const PracticeTempLobby = () => {
    const { roomCode } = useParams();
    const [isHost, setIsHost] = useState(false);
    const [players, setPlayers] = useState({});
    const [roomData, setRoomData] = useState(null);
    const navigateTo = useNavigate();
    const { user } = UserAuth();

    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");

    useEffect(() => {
        const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);
        const messagesRef = ref(firebaseRTDB, `rooms/${roomCode}/messages`);
        
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setRoomData(data);
                setPlayers(data.players || {});
                setIsHost(data.host === user.uid);
                console.log(isHost);
            }

            if (data && data.state === "playing") {
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
        };
    }, [roomCode, navigateTo]);

    const startGame = async() => {
        // Implement game start logic here
        console.log("Starting game...");
        if (!isHost) return;

        try {
            const { success, data } = await getPracticeByTopicId(roomData.topicId);
            if (success && data.length > 0) {
                const questions = data[0].practice_qa;
                const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);

                // Initialize playerScores with all players and a score of 0
                const initialPlayerScores = {};
                Object.keys(roomData.players).forEach(playerId => {
                    initialPlayerScores[playerId] = { total: 0 };
                });

                await update(roomRef, {
                    state: "playing",
                    currentQuestionIndex: 0,
                    questions: questions,
                    playerAnswers: {},
                    playerScores: initialPlayerScores,
                    currentQuestionStartTime: serverTimestamp()
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
            userName: players[user.uid]?.name || "Anonymous",
            message: chatInput,
            timestamp: serverTimestamp()
        });
    
        setChatInput(""); // Clear input after sending
    };

    return (
        <div>
            <h1>Lobby</h1>
            <h2>Room Code: {roomCode}</h2>
            <h3>Topic: {roomData?.topicTitle}</h3>
            <h3> Topic Id: {roomData?.topicId} </h3>
            <h3>Players:</h3>
            <ul>
                {Object.entries(players).map(([id, player]) => (
                    <li key={id}>{player.name}</li>
                ))}
            </ul>
            {isHost && <button onClick={startGame}>Start Game</button>}
    
            {/* Chat Section */}
            <div>
                <h3>Chat</h3>
                <div>
                    {messages.map((msg, index) => (
                        <p key={index}><strong>{msg.userName}:</strong> {msg.message}</p>
                    ))}
                </div>
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default PracticeTempLobby