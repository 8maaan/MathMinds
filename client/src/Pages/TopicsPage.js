import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../PagesCSS/TopicsPage.css';
import { getLessonById } from '../API-Services/LessonAPI';
import { Button, CircularProgress } from '@mui/material';
import { UserAuth } from '../Context-and-routes/AuthContext';
import { updateProgress } from '../API-Services/UserProgressAPI';

// ⚠ SPAGHETTI CODE ⚠
// WILL REFACTOR LATER
// IDEAL REFERENCE IS SIMILAR TO W3SCHOOL
// TODO: WILL USE <Button> from MUI instead of regular <button> wtf

const TopicsPage = () => {
  const { getUid } = UserAuth();
  const { lessonId, topicId } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [feedBackColor, setFeedBackColor] = useState(null);
  const [loading, setLoading] = useState(false);

  const [shuffledOptionsState, setShuffledOptionsState] = useState({});
  
  /* JSON Data */
  const [lessonData, setLessonData] = useState(null);

  const navigateTo = useNavigate();
  const [topicsState, setTopicsState] = useState({});
  const colors = ['color-1', 'color-2', 'color-3'];
  let colorIndex = 0; /*from above sa handleOptionClick, ako lang gi move dri -den*/

  const updateTopicProgress = async (topicId) => {
    if (allQuestionsAnswered(selectedTopic)) {
      const result = await updateProgress(getUid(), topicId, true);
      if (result.success) {
        console.log(result.message); 
      } else {
        console.error("Failed to update progress:", result.message);
      }
    }
  };

  // PUT FUNCTION INSIDE CUS WHY SEPARATE ?
  useEffect(() => {
    const fetchLessonTopics = async () => {
      try {
        const fetchResult = await getLessonById(lessonId);
        setLessonData(fetchResult.data);
        if (fetchResult.data && fetchResult.data.lessonTopics) {
          const initialTopic = fetchResult.data.lessonTopics.find(topic => topic.topicId === parseInt(topicId));
          setSelectedTopic(initialTopic);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchLessonTopics();
  }, [lessonId, topicId]);

  // FOR THE CHOICES
  useEffect(() => {
    if (selectedTopic && selectedTopic.topicContent) {
      const newShuffledOptions = {};
      Object.entries(selectedTopic.topicContent)
        .filter(([_, value]) => value.type === "question")
        .forEach(([key, value]) => {
          const allOptions = [
            ...Object.values(value.incorrectAnswers),
            value.correctAnswer
          ];
          newShuffledOptions[key] = shuffleArray(allOptions);
        });
      setShuffledOptionsState(newShuffledOptions);
    }
  }, [selectedTopic]);

  const handleOptionClick = (topicId, questionKey, option) => {
    setTopicsState((prevState) => ({
      ...prevState,
      [topicId]: {
        ...prevState[topicId],
        [questionKey]: {
          ...prevState[topicId]?.[questionKey],
          selectedOption: option,
          // Preserve the existing checked and feedback state (remove if error)
          checked: prevState[topicId]?.[questionKey]?.checked || false,
          feedback: prevState[topicId]?.[questionKey]?.feedback || null,
        },
      },
    }));
  };

  const handleCheckAnswer = (topicId, questionKey, correctAnswer) => {
    const isCorrect = topicsState[topicId][questionKey].selectedOption === correctAnswer;
    setTopicsState((prevState) => ({
      ...prevState,
      [topicId]: {
        ...prevState[topicId],
        [questionKey]: {
          ...prevState[topicId][questionKey],
          feedback: isCorrect ? 'Correct!' : 'Wrong!',
          checked: true,
        },
      },
    }));
    setFeedBackColor(isCorrect ? 'green' : 'maroon');
  };

  /* to get colors for the rectangle containers*/
  const getNextColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

  const getNextTopic = () => {
    if (!lessonData || !lessonData.lessonTopics || !selectedTopic) return null;

    const currentIndex = lessonData.lessonTopics.findIndex(topic => topic.topicId === selectedTopic.topicId);
    if (currentIndex === -1 || currentIndex === lessonData.lessonTopics.length - 1) return null;

    return lessonData.lessonTopics[currentIndex + 1];
  };

  const handleTopicClick = (topic, index) => {
    setSelectedTopic(topic);
    navigateTo(`/lesson/${lessonId}/${topic.topicId}`); /* */
  };

  const handleNextClick = async () => {
    setLoading(true);
    await updateTopicProgress(selectedTopic.topicId);
    setLoading(false);
  
    const nextTopic = getNextTopic();
    if (nextTopic) {
      const nextIndex = lessonData.lessonTopics.indexOf(nextTopic);
      handleTopicClick(nextTopic, nextIndex);
    }
  };

  const handleProceedToQuiz = async () => {
    setLoading(true);
    await updateTopicProgress(selectedTopic.topicId);
    setLoading(false);
    navigateTo(`/lesson/${lessonId}/quiz`);
  };

  const isLastTopic = () => {
    if (!lessonData || !lessonData.lessonTopics || !selectedTopic) return false;
    const lastTopic = lessonData.lessonTopics[lessonData.lessonTopics.length - 1];
    return lastTopic.topicId === selectedTopic.topicId;
  };

  const hasQuestions = (topic) => {
    if (!topic || !topic.topicContent) return false;
    return Object.values(topic.topicContent).some(value => value.type === "question");
  };

  const allQuestionsAnswered = (topic) => {
    if (!topic) return false;
  
    const topicQuestions = Object.entries(topic.topicContent)
      .filter(([key, value]) => value.type === "question");

    // If there are no questions, consider it "mastered" as there's nothing to answer
    if (topicQuestions.length === 0) return true;

    // If there are questions, check if all are answered correctly
    return topicQuestions.every(([key, value]) => {
      const questionState = topicsState[topic.topicId]?.[key];
      return questionState?.checked && questionState?.feedback === 'Correct!';
    });
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (!lessonData || !getUid()) {
    return <div>Loading...</div>;
  }

  // NEEDS NEXT BUTTON - RIBO

  /* RENDER ALL OF THE TOPICS IN RWD SINCE SIDEBAR DISAPPEARS */
  /* WHY REMOVE SIDEBAR WHEN RESIZED? HOW WOULD THE USER NAVIGATE TO OTHER TOPICS? MYBE USE DRAWER FROM MUI? -RIBO*/
  return (
    <div className='root'>
      <div className="container">
        <div className="sidebar">
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li key={lessonData.lessonId}>
              {lessonData.lessonId}. {lessonData.lessonTitle}
              {lessonData.lessonTopics && (
                <ul>
                  {lessonData.lessonTopics.map((topic, topicIndex) => (
                    <li key={topicIndex} onClick={() => handleTopicClick(topic, topicIndex)} className='sidebar-list-item'>
                      {topic.lessonId}.{topicIndex+1} {topic.topicTitle}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className="main-content">
          <div>
            <div className="lesson-header">
              <h4 style={{color: '#181A52'}}>Lesson {lessonData.lessonId}</h4>
              <h1 style={{color: '#181A52'}}>{lessonData.lessonTitle}</h1>
            </div>
            {selectedTopic && (
              <div>
                <h4 style={{color: '#404040'}}>Lesson {selectedTopic.lessonId}.{lessonData.lessonTopics.indexOf(selectedTopic)+1} - {selectedTopic.topicTitle}</h4>
                <div className="lesson-content">
                  {Object.entries(selectedTopic.topicContent).map(([key, value], index, array) => (
                    <div key={key} className={`lesson-item ${getNextColor()}`}>
                      {value.type === "text" && <div style={{ textAlign: 'left', marginLeft:'30px' }} dangerouslySetInnerHTML={{ __html: value.content }} />} {/*ensure html is displayed correctly -den*/}
                      {value.type === "question" && (
                        <div>
                          <p>{value.question}</p>
                          <div className="question-container">
                            <div className="option-container">
                              {shuffledOptionsState[key]?.map((option, idx) => (
                                <Button
                                  key={`${selectedTopic.topicId}-${key}-option-${idx}`}
                                  onClick={() => handleOptionClick(selectedTopic.topicId, key, option)}
                                  variant='contained'
                                  fullWidth
                                  size='large'
                                >
                                  {option}
                                </Button>
                              ))}
                            </div>
                            <div className="check-container">
                              <Button
                                onClick={() => handleCheckAnswer(selectedTopic.topicId, key, value.correctAnswer)}
                                variant='contained'
                                sx={{color:'#101436', backgroundColor:'#FFB100', fontFamily:'Poppins', '&:hover': { backgroundColor: '#e9a402'}}}
                              >
                                Check
                              </Button>
                            </div>
                          </div>
                          {topicsState[selectedTopic.topicId]?.[key]?.checked && (
                            <p style={{fontWeight: '600', color:`${feedBackColor}` }}>{topicsState[selectedTopic.topicId][key].feedback}</p>
                          )}
                        </div>
                      )}
                      {index === array.length - 1 && isLastTopic() ? (
                        <p style={{ fontWeight: 'bold', textAlign: 'center', color:'#2f3163'}}>END OF LESSON</p>
                      ) : null}
                    </div>
                  ))}
                </div>
                {isLastTopic() ? (
                  <div className="proceed-to-quiz">
                    <Button
                      variant='contained'
                      sx={{color:'#101436', backgroundColor:'#FFB100', fontFamily:'Poppins', '&:hover': { backgroundColor: '#e9a402'}}}
                      onClick={handleProceedToQuiz}
                      disabled={hasQuestions(selectedTopic) && !allQuestionsAnswered(selectedTopic)}
                    >
                      Proceed to Quiz
                    </Button>
                  </div>
                ) :
                  <div className="proceed-to-quiz">
                    <Button
                      variant='contained'
                      sx={{color:'#101436', backgroundColor:'#FFB100', fontFamily:'Poppins', '&:hover': { backgroundColor: '#e9a402'}}}
                      onClick={handleNextClick}
                      disabled={hasQuestions(selectedTopic) && !allQuestionsAnswered(selectedTopic)}
                    >
                      {loading ? <CircularProgress color="inherit" size="1.5rem" /> : "Next"}
                    </Button>
                  </div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
