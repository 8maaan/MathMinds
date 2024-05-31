import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../PagesCSS/TopicsPage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import { getLessonById } from '../API-Services/LessonAPI';

// ⚠ SPAGHETTI CODE ⚠
// WILL REFACTOR LATER
// IDEAL REFERENCE IS SIMILAR TO W3SCHOOL
// TODO: WILL USE <Button> from MUI instead of regular <button> wtf

const TopicsPage = () => {
  const { lessonId, topicId } = useParams(); /*assuming lessonId is passed when TopicsPage.js is called?*/
  const [selectedTopic, setSelectedTopic] = useState(null);
  /* JSON Data */
  const [lessonData, setLessonData] = useState(null);

  const navigateTo = useNavigate();

  // PUT FUNCTION INSIDE CUS WHY SEPARATE ?
  useEffect(() => {
    const fetchLessonTopics = async () => {
      try {
        const fetchResult = await getLessonById(lessonId);
        setLessonData(fetchResult.data);
        if (fetchResult.data && fetchResult.data.lessonTopics) {
          const initialTopic = fetchResult.data.lessonTopics[parseInt(topicId)];
          setSelectedTopic(initialTopic);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchLessonTopics();
  }, [lessonId, topicId]);

  const [topicsState, setTopicsState] = useState({});

  /* to get colors for the rectangle containers*/
  const colors = ['color-1', 'color-2', 'color-3'];
  let colorIndex = 0;

  /*  for the mini seatwork */
  const handleOptionClick = (topicId, questionKey, option) => {
    setTopicsState((prevState) => ({
      ...prevState,
      [topicId]: {
        ...prevState[topicId],
        [questionKey]: {
          ...prevState[topicId]?.[questionKey],
          selectedOption: option,
          checked: false,
          feedback: null,
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
  };

  /* to get colors for the rectangle containers*/
  const getNextColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

  const handleTopicClick = (topic, index) => {
    setSelectedTopic(topic);
    navigateTo(`/lesson/${lessonId}/${index}`);
  };

  const isLastTopic = () => {
    if (!lessonData || !lessonData.lessonTopics || !selectedTopic) return false;
    const lastTopic = lessonData.lessonTopics[lessonData.lessonTopics.length - 1];
    return lastTopic.topicId === selectedTopic.topicId;
  };

  if (!lessonData) {
    return <div>Loading...</div>;
  }

  // NEEDS NEXT BUTTON - RIBO

  /* RENDER ALL OF THE TOPICS IN RWD SINCE SIDEBAR DISAPPEARS */
  /* WHY REMOVE SIDEBAR WHEN RESIZED? HOW WOULD THE USER NAVIGATE TO OTHER TOPICS? MYBE USE DRAWER FROM MUI? -RIBO*/
  return (
    <div className='root'>
      <ReusableAppBar />
      <div className="container">
        <div className="sidebar">
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li key={lessonData.lessonId}>
              {lessonData.lessonId}. {lessonData.lessonTitle}
              {lessonData.lessonTopics && (
                <ul>
                  {lessonData.lessonTopics.map((topic, topicIndex) => (
                    <li key={topicIndex} onClick={() => handleTopicClick(topic, topicIndex)} className='sidebar-list-item'>
                      {topic.lessonId}.{topicIndex}. {topic.topicTitle}
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
              <h4>Lesson {lessonData.lessonId}</h4>
              <h1>{lessonData.lessonTitle}</h1>
            </div>
            {selectedTopic && (
              <div>
                <h4>Lesson {selectedTopic.lessonId}.{lessonData.lessonTopics.indexOf(selectedTopic)} - {selectedTopic.topicTitle}</h4>
                <div className="lesson-content">
                  {Object.entries(selectedTopic.topicContent).map(([key, value], index, array) => (
                    <div key={key} className={`lesson-item ${getNextColor()}`}>
                      {value.type === "text" && <p>{value.content}</p>}
                      {value.type === "question" && (
                        <div>
                          <p>{value.question}</p>
                          <div className="question-container">
                            <div className="option-container">
                              {Object.values(value.incorrectAnswers).map((option, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleOptionClick(selectedTopic.topicId, key, option)}
                                  className="option-button"
                                >
                                  {option}
                                </button>
                              ))}
                              <button
                                onClick={() => handleOptionClick(selectedTopic.topicId, key, value.correctAnswer)}
                                className="option-button"
                              >
                                {value.correctAnswer}
                              </button>
                            </div>
                            <div className="check-container">
                              <button
                                onClick={() => handleCheckAnswer(selectedTopic.topicId, key, value.correctAnswer)}
                                className="confirm-button"
                              >
                                Check
                              </button>
                            </div>
                          </div>
                          {topicsState[selectedTopic.topicId]?.[key]?.checked && (
                            <p>{topicsState[selectedTopic.topicId][key].feedback}</p>
                          )}
                        </div>
                      )}
                      {index === array.length - 1 && isLastTopic() ? (
                        <p style={{ fontWeight: 'bold', textAlign: 'center' }}>END OF LESSON</p>
                      ) : null}
                    </div>
                  ))}
                </div>
                {isLastTopic() && (
                  <div className="proceed-to-quiz">
                    <button className="proceed-button">Proceed to Quiz</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
