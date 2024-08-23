import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue, off, update, serverTimestamp, get } from "firebase/database";
import { firebaseRTDB } from '../Firebase/firebaseConfig';
import { UserAuth } from '../Context-and-routes/AuthContext';
import MultiplayerLeaderboardModal from '../ReusableComponents/MultiplayerLeaderboardModal';
import ReusableCountdownTimer from '../ReusableComponents/ReusableCountdownTimer';
import { Box, Slide } from '@mui/material';
import "../PagesCSS/PracticeQuestionFormMultiplayer.css"

//  W/ comments para way libog
const PracticeQuestionFormMultiplayer = () => {
    const { roomCode } = useParams();
    const [gameData, setGameData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timer, setTimer] = useState(null); // Initial timer (countdown) b4 start
    const [isHost, setIsHost] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false); // New state to track if the user has answered
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Store the selected answer
    const [answerTime, setAnswerTime] = useState(null); 
    const [totalScore, setTotalScore] = useState(0); // Current user's total score
    const [isFinished, setIsFinished] = useState(false); // Indicator if game is finished or nawt
    const [playerScores, setPlayerScores] = useState({}); // Overall total scores from players
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const { user } = UserAuth();
    const navigateTo = useNavigate();

    useEffect(() => {
        const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);
        
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
    
            if (data && data.state === "playing") {
                setGameData(data);

                if (data.currentQuestionStartTime) {
                    const currentTime = Date.now();
                    const elapsedTime = (currentTime - data.currentQuestionStartTime) / 1000;
                    const remainingTime = Math.max(0, 9 - elapsedTime);
                    console.log("Remaining time: ",remainingTime);
                    setTimer(Math.floor(remainingTime));
                }
    
                // Only update the current question and reset the timer if the question changes
                if (data.currentQuestionIndex !== (gameData?.currentQuestionIndex || 0)) {
                    setCurrentQuestion(data.questions[data.currentQuestionIndex]);
                    // setTimer(10); // Reset timer for all players when question changes
                    setHasAnswered(false); // Reset answer state for the new question
                    setSelectedAnswer(null); // Reset selected answer for the new question
                    setAnswerTime(null);
                }

                // Update all player scores
                if (data.playerScores) {
                    setPlayerScores(data.playerScores);
                }
                
                // Update current user's total score
                if (data.playerScores && data.playerScores[user.uid]) {
                    const playerScores = data.playerScores[user.uid];
                    const currentScore = Object.values(playerScores).reduce((sum, score) => sum + score, 0);
                    setTotalScore(currentScore);
                }
                setIsHost(data.host === user.uid);
            }

            if (data && data.state === "finished"){
                setIsFinished(true);
            }
        });
    
        return () => off(roomRef);
    }, [roomCode, user.uid, gameData?.currentQuestionIndex]);
    

    useEffect(() => {
        let timerId;
        if (timer > 0 && gameData?.state === "playing") {
            timerId = setTimeout(() => setTimer(timer - 1), 1000);
        }else if(timer === 0 && !currentQuestion) {
            moveToNextQuestion();
        } else if (timer === 0) {
            calculateScore();
            setTimeout(() => setShowLeaderboard(true), 2000);
            setTimeout(()=>{
                moveToNextQuestion(); 
                handleShowLeaderboard();
            }, 7000); // Automatically move to the next question after a delay
        }
        return () => clearTimeout(timerId);
    }, [timer, gameData]);


    const moveToNextQuestion = async () => {
        if (!gameData) return; // Ensure gameData is available
        
        // Random delay between 0 and 300 milliseconds
        await new Promise(resolve => setTimeout(resolve, Math.random() * 300));

        const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);
        
        // Get the current state from the database
        const snapshot = await get(roomRef);
        const currentData = snapshot.val();
    
        // Check if the question has already been updated
        if (currentData.currentQuestionIndex > gameData.currentQuestionIndex) {
            console.log("Yep");
            console.log("Question has already been updated by another client");
            return; // Exit the function if the question has already been updated
        }
    
        const nextIndex = currentData.currentQuestionIndex + 1;
    
        if (nextIndex <= Object.keys(currentData.questions).length) {
            // Update to next question
            await update(roomRef, {
                currentQuestionIndex: nextIndex,
                playerAnswers: {},
                currentQuestionStartTime: serverTimestamp(),
            });
        } else {
            // End the game
            await update(roomRef, { state: "finished" });
        }
    };

    const submitAnswer = (answer) => {
        if (!hasAnswered) {
            setHasAnswered(true); // Mark the user as having answered
            setSelectedAnswer(answer); // Store the selected answer
            setAnswerTime(timer);

            // You can also add UI logic here to highlight the selected answer, if desired.
        }
    };

    // Function for checking and calculating the score after answer submission
    const calculateScore = async () => {
        if (hasAnswered && selectedAnswer) {
            let score = 0;
    
            // Check if the selected answer is correct
            if (selectedAnswer === currentQuestion.correctAnswer) {
                score = answerTime * 100;
            }

            // Update the Firebase Realtime Database with the selected answer and score
            await update(ref(firebaseRTDB, `rooms/${roomCode}/playerScores/${user.uid}`), {
                [`question_${gameData.currentQuestionIndex}`]: score,
            });
        }
    };


    // Function for calculating the total scores for each questions
    const calculateTotalScore = (scores) => {
        return Object.values(scores).reduce((sum, score) => sum + score, 0);
    };

    const handleNavigateBacktoLobby = () => {
        navigateTo(`/lobby/${roomCode}`)
    }
    
    const handleShowLeaderboard = () =>{
        setShowLeaderboard(false);
    }

    // console.log("Total Score:", totalScore);
    // console.log("Answer Time:", answerTime);
    console.log(timer);

    if (!currentQuestion) {
        return (     
            <ReusableCountdownTimer initialTimer={timer}/>
        )
    }

    return (
        <div>
            <Slide direction="right" in={true} mountOnEnter unmountOnExit>
                {/* Added box to enable slide transition */}
                <Box className='pqfm-body'> 
                    <Box className='pqfm-first-section-container'>
                        <h2>Question: {currentQuestion.question}</h2>
                        <p>Time left: {timer} seconds</p>
                        {/* <p>Total score {"(Individual)"}: {totalScore} </p>
                        <h3>Player Scores:</h3>
                        <ul>
                            {Object.entries(playerScores).map(([playerId, scores]) => (
                                <li key={playerId}>
                                    {gameData.players[playerId]?.name}: {calculateTotalScore(scores)}
                                </li>
                            ))}
                        </ul> */}
                    </Box>
                    {/* Answer Choices */}
                    <Box className='pqfm-second-section-container'>
                        {[currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers].map((answer, index) => (
                            <button 
                                key={index} 
                                onClick={() => submitAnswer(answer)} 
                                disabled={hasAnswered || timer === 0} // Disable buttons after an answer is selected or if timer is 0
                            >
                            {answer}
                        </button>
                        ))}

                        {isFinished && 
                            <>
                                <p>The quiz has finished</p>
                                <button onClick={() => handleNavigateBacktoLobby()}>Go back to lobby</button>
                            </>
                        }

                        <MultiplayerLeaderboardModal 
                            open={showLeaderboard} 
                            onClose={handleShowLeaderboard} 
                            scores={Object.fromEntries(
                                Object.entries(playerScores).map(([playerId, scores]) => [
                                    gameData.players[playerId]?.name,
                                    calculateTotalScore(scores),
                                ])
                            )}
                        />
                    </Box>
                </Box>
            </Slide>
        </div>
    );
}

export default PracticeQuestionFormMultiplayer