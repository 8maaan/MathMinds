import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue, off, update, serverTimestamp, get, runTransaction } from "firebase/database";
import { firebaseRTDB } from '../Firebase/firebaseConfig';
import { UserAuth } from '../Context-and-routes/AuthContext';
import MultiplayerLeaderboardModal from '../ReusableComponents/MultiplayerLeaderboardModal';
import ReusableCountdownTimer from '../ReusableComponents/ReusableCountdownTimer';
import { Box, Button, IconButton, LinearProgress, Slide, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import "../PagesCSS/PracticeQuestionFormMultiplayer.css"

//  W/ comments para way libog
const PracticeQuestionFormMultiplayer = () => {
    const { roomCode } = useParams();
    const [gameData, setGameData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timer, setTimer] = useState(null); // Initial timer (countdown) b4 start
    const [hasAnswered, setHasAnswered] = useState(false); // New state to track if the user has answered
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Store the selected answer
    const [answerTime, setAnswerTime] = useState(null); 
    const [isFinished, setIsFinished] = useState(false); // Indicator if game is finished or nawt
    const [playerScores, setPlayerScores] = useState({}); // Overall total scores from players
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [questionTimer, setQuestionTimer] = useState(null);
    const [startCountdownIsFinished, setStartCountdownIsFinished] = useState(false);

    const [shuffledChoices, setShuffledChoices] = useState([]);

    const optionColors = [
        { defaultColor: "#f94848", hoverColor: "#d13d3d", disabledColor: "#bf3737" },
        { defaultColor: "#4cae4f", hoverColor: "#429645", disabledColor: "#3a853d" },
        { defaultColor: "#2874ba", hoverColor: "#2265a3", disabledColor: "#1d5991" },
        { defaultColor: "#f4cc3f", hoverColor: "#dbb739", disabledColor: "#c7a634" }
    ];

    const progress = (timer / questionTimer) * 100; // Progress in percentage

    const { user } = UserAuth();
    const navigateTo = useNavigate();
    

    useEffect(() => {
        const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);
        
        const unsubscribe = onValue(roomRef, (snapshot) => {
            try{
                const data = snapshot.val();
        
                if (data && data.state === "playing") {
                    setGameData(data);
                    setStartCountdownIsFinished(data.startCountdownIsFinished);
        
                    // Only updates the values below if the question changes
                    if (data.currentQuestionIndex !== (gameData?.currentQuestionIndex || 0)) {
                        if (data.currentQuestionStartTime) {
                            const currentTime = Date.now();
                            console.log("Server Time:", currentTime);
                            const elapsedTime = (currentTime - data.currentQuestionStartTime) / 1000;
                            console.log("Elapsed Time", elapsedTime);
                            const remainingTime = Math.max(0, data.questionTimer - elapsedTime);
                            console.log("Remaining time: ",remainingTime);
                            setTimer(Math.round(remainingTime > data.questionTimer ? data.questionTimer : remainingTime ));
                            console.log("Timer:", timer);
                        }
                        setCurrentQuestion(data.questions[data.currentQuestionIndex]);
                        setQuestionTimer(data.questionTimer);
                        setShowLeaderboard(false); // Hides the leaderboard
                        setHasAnswered(false); // Reset answer state for the new question
                        setSelectedAnswer(null); // Reset selected answer for the new question
                        setAnswerTime(null);
                    }

                    // Update all player scores
                    if (data.playerScores) {
                        setPlayerScores(data.playerScores);
                    }
                    
                    // Update current user's total score
                    // if (data.playerScores && data.playerScores[user.uid]) {
                    //     const playerScores = data.playerScores[user.uid];
                    //     const currentScore = Object.values(playerScores).reduce((sum, score) => sum + score, 0);
                    //     setTotalScore(currentScore);
                    // }
                    // setIsHost(data.host === user.uid);
                }

                if (data && data.state === "finished"){
                    setIsFinished(true);
                    setShowLeaderboard(true);
                }
            }catch (error){
                console.error("Error in room data listener:", error);
            }
        });
    
        return () => off(roomRef);
    }, [roomCode, user.uid, gameData?.currentQuestionIndex]);
    

    useEffect(() => {
        let timerId;
        if(startCountdownIsFinished && !currentQuestion) {
            moveToNextQuestion();
        }else if (timer > 0 && gameData?.state === "playing" && startCountdownIsFinished) {
            timerId = setTimeout(() => setTimer(timer - 1), 1000);
        } else if (timer === 0) {
            calculateScore();
            proceedToNextQuestionDelay();
        }
        return () => clearTimeout(timerId);
    }, [timer, gameData, startCountdownIsFinished]);

    // Checks if the question changed (Ako gibutang diri kay for some reason mu-cause og infinite loop sa first useEffect)
    useEffect(() => {
        if (currentQuestion) {
            const choices = [currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers];
            setShuffledChoices(shuffleChoicesArray(choices));
        }
    }, [currentQuestion]);


    const moveToNextQuestion = async () => {
        if (!gameData) return; // Ensure gameData is available
        
        // Random delay between 0 and 300 milliseconds
        await new Promise(resolve => setTimeout(resolve, Math.random() * 300));
    
        const roomRef = ref(firebaseRTDB, `rooms/${roomCode}`);
        
        try {
            await runTransaction(roomRef, (currentData) => {
                if (!currentData) return null; // If data doesn't exist, abort the transaction
    
                // Check if the question has already been updated
                if (currentData.currentQuestionIndex > gameData.currentQuestionIndex) {
                    console.log("Question has already been updated by another client");
                    return; // Abort the transaction if the question has already been updated
                }
        
                const nextIndex = currentData.currentQuestionIndex + 1;
        
                if (nextIndex < Object.keys(currentData.questions).length) {
                    // Update to next question
                    return {
                        ...currentData,
                        currentQuestionIndex: nextIndex,
                        playerAnswers: {},
                        currentQuestionStartTime: serverTimestamp(),
                        startCountdownIsFinished: true
                    };
                } else {
                    // End the game
                    return {
                        ...currentData,
                        state: "finished"
                    };
                }
            });
        } catch (error) {
            console.error("Error updating game state:", error);
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
        if (hasAnswered && selectedAnswer && gameData) {
            let score = 0;
    
            // Check if the selected answer is correct
            if (selectedAnswer === currentQuestion.correctAnswer) {
                score = answerTime * 100;
            }
    
            const scoreRef = ref(firebaseRTDB, `rooms/${roomCode}/playerScores/${user.uid}/question_${gameData.currentQuestionIndex}`);
    
            try {
                await runTransaction(scoreRef, (currentScore) => {
                    // Only update if the score hasn't been set yet
                    if (currentScore === null) {
                        return score;
                    } else {
                        return currentScore; // No change if score already exists
                    }
                });
            } catch (error) {
                console.error("Error updating score:", error);
            }
        }
    };

    const proceedToNextQuestionDelay = () => {
        setTimeout(() => {
            setShowLeaderboard(true);
            setTimeout(() => {
                moveToNextQuestion();
            }, 5000); // Show leaderboard for 5 seconds
        }, 2000);
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

    const handleStartCountdownIsFinished = () => {
        setStartCountdownIsFinished(true);
    };

    const shuffleChoicesArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    // console.log("Timer:", timer);
    // console.log("startCountdownIsFinished:",startCountdownIsFinished);

    if (!currentQuestion) {
        return (     
            <ReusableCountdownTimer initialTimer={10} onTimerFinish={handleStartCountdownIsFinished}/>
        )
    }

    return (
        <div>
            <Slide direction="right" in={true} mountOnEnter unmountOnExit>
                {/* Added box to enable slide transition */}
                <Box className='pqfm-body'>
                    <LinearProgress variant='determinate' value={progress} sx={{ height: '25px',  width: '100%', marginBottom:'1.5%' }}/>
                    <Box className='pqfm-exit-section-container'>
                        <Tooltip title='Exit'>
                            <IconButton>
                                <ExitToAppIcon sx={{fontSize: '1.8rem'}}/>
                            </IconButton>
                        </Tooltip>
                    </Box> 
                    <Box className='pqfm-first-section-container'>
                        <Box className='pqfm-first-section-wrapper'>
                            <Box className='pqfm-currentQuestionIndex'>
                                <h3>Question #{gameData.currentQuestionIndex + 1}</h3>
                            </Box>
                            <Box className='pqfm-question-container'>
                                <p>{currentQuestion.question}</p>
                            </Box>
                            {/* {isFinished && 
                                    <>
                                        <p>The quiz has finished{"(Temp Only)"}</p>
                                        <button onClick={() => handleNavigateBacktoLobby()}>Go back to lobby</button>
                                    </>
                                } */}
                            {/* <p>Time left: {timer} seconds</p> */}
                        </Box>
                        
                    </Box>
                    {/* Answer Choices */}
                    <Box className='pqfm-second-section-container'>
                        {shuffledChoices.map((answer, index) => (
                            <Box className='pqfm-choices-wrapper'>
                                <Button
                                    variant="contained" 
                                    key={index} 
                                    onClick={() => submitAnswer(answer)} 
                                    disabled={hasAnswered || timer === 0} // Disable buttons after an answer is selected or if timer is 0
                                    fullWidth
                                    sx={{ 
                                        bgcolor: optionColors[index % optionColors.length].defaultColor,
                                        '&:hover': {
                                            bgcolor: optionColors[index % optionColors.length].hoverColor,
                                        },
                                        '&.Mui-disabled': {
                                            bgcolor: optionColors[index % optionColors.length].disabledColor,
                                        },
                                    }}
                                >
                                    {answer}
                                </Button>
                            </Box>
                        ))}

                        <MultiplayerLeaderboardModal 
                            open={showLeaderboard} 
                            onClose={handleShowLeaderboard} 
                            scores={Object.fromEntries(
                                Object.entries(playerScores).map(([playerId, scores]) => [
                                    gameData.players[playerId]?.name,
                                    calculateTotalScore(scores),
                                ])
                            )}
                            isFinished={isFinished}
                            roomCode={roomCode}
                        />
                    </Box>
                </Box>
            </Slide>
        </div>
    );
}

export default PracticeQuestionFormMultiplayer