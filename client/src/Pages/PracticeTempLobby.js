import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { firebaseRTDB } from '../Firebase/firebaseConfig'
import { ref, onValue, off, update } from "firebase/database";
import { getPracticeByTopicId } from "../API-Services/PracticeAPI"
import { UserAuth } from '../Context-and-routes/AuthContext';

const PracticeTempLobby = () => {
    const { roomCode } = useParams();
    const [isHost, setIsHost] = useState(false);
    const [players, setPlayers] = useState({});
    const [roomData, setRoomData] = useState(null);
    const navigateTo = useNavigate();
    const { user } = UserAuth();

    useEffect(() => {
        const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);
        
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

        return () => {
            off(roomRef);
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
                    playerScores: initialPlayerScores
                });
            } else {
                console.error("Failed to fetch questions");
            }
        } catch (error) {
            console.error("Error starting game:", error);
        }
        
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
        </div>
    );
}

export default PracticeTempLobby