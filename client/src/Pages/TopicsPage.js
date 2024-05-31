import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../PagesCSS/TopicsPage.css';
import { getLessonById } from '../API-Services/LessonAPI';
import { Button } from '@mui/material';

const TopicsPage = () => {
  const { lessonId, topicId } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [feedBackColor, setFeedBackColor] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [lessonQuizzes, setLessonQuizzes] = useState([]); // State to hold the quizzes

  const navigateTo = useNavigate();
  const [topicsState, setTopicsState] = useState({});
  const colors = ['color-1', 'color-2', 'color-3'];
  let colorIndex = 0;

  useEffect(() => {
    const fetchLessonTopics = async () => {
      try {
        const fetchResult = await getLessonById(lessonId);
        setLessonData(fetchResult.data);
        if (fetchResult.data && fetchResult.data.lessonTopics) {
          const initialTopic = fetchResult.data.lessonTopics[parseInt(topicId) - 1];
          setSelectedTopic(initialTopic);
        }
        if (fetchResult.data && fetchResult.data.lessonQuiz) {
          setLessonQuizzes(fetchResult.data.lessonQuiz);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchLessonTopics();
  }, [lessonId, topicId]);

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
    setFeedBackColor(isCorrect ? 'green' : 'maroon');
  };

  const getNextColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

  const handleTopicClick = (topic, index) => {
    setSelectedTopic(topic);
    navigateTo(`/lesson/${lessonId}/${index + 1}`);
  };

  const isLastTopic = () => {
    if (!lessonData || !lessonData.lessonTopics || !selectedTopic) return false;
    const lastTopic = lessonData.lessonTopics[lessonData.lessonTopics.length - 1];
    return lastTopic.topicId === selectedTopic.topicId;
  };

  const handleProceedToQuiz = () => {
    const quiz = lessonQuizzes.length ? lessonQuizzes[0] : null; // Assuming you take the first quiz associated with the lesson
    if (quiz) {
      navigateTo(`/lesson/${lessonId}/quiz/${quiz.lessonQuizId}`); // Pass the quiz ID to the quiz form
    } else {
      alert('No quiz available for this lesson.');
    }
  };

  if (!lessonData) {
    return <div>Loading...</div>;
  }

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
                      {topic.lessonId}.{topicIndex + 1} {topic.topicTitle}
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
              <h4 style={{ color: '#181A52' }}>Lesson {lessonData.lessonId}</h4>
              <h1 style={{ color: '#181A52' }}>{lessonData.lessonTitle}</h1>
            </div>
            {selectedTopic && (
              <div>
                <h4 style={{ color: '#404040' }}>Lesson {selectedTopic.lessonId}.{lessonData.lessonTopics.indexOf(selectedTopic) + 1} - {selectedTopic.topicTitle}</h4>
                <div className="lesson-content">
                  {Object.entries(selectedTopic.topicContent).map(([key, value]) => (
                    <div key={key} className={`lesson-item ${getNextColor()}`}>
                      {value.type === "text" && <div style={{ textAlign: 'left', marginLeft: '30px' }} dangerouslySetInnerHTML={{ __html: value.content }} />}
                      {value.type === "question" && (
                        <div>
                          <p>{value.question}</p>
                          <div className="question-container">
                            <div className="option-container">
                              {Object.values(value.incorrectAnswers).map((option, idx) => (
                                <Button
                                  key={idx}
                                  onClick={() => handleOptionClick(selectedTopic.topicId, key, option)}
                                  variant='contained'
                                  fullWidth
                                  size='large'
                                >
                                  {option}
                                </Button>
                              ))}
                              <Button
                                onClick={() => handleOptionClick(selectedTopic.topicId, key, value.correctAnswer)}
                                variant='contained'
                                fullWidth
                                size='large'
                              >
                                {value.correctAnswer}
                              </Button>
                            </div>
                            <div className="check-container">
                              <Button
                                onClick={() => selectedTopic?.topicId != null && key != null && value?.correctAnswer != null && handleCheckAnswer(selectedTopic.topicId, key, value.correctAnswer)}
                                variant='contained'
                                sx={{ color: '#101436', backgroundColor: '#FFB100', fontFamily: 'Poppins', '&:hover': { backgroundColor: '#e9a402' } }}
                              >
                                Check
                              </Button>
                            </div>
                          </div>
                          {topicsState[selectedTopic.topicId]?.[key]?.checked && (
                            <p style={{ fontWeight: '600', color: `${feedBackColor}` }}>{topicsState[selectedTopic.topicId][key].feedback}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {isLastTopic() && (
                  <div className="proceed-to-quiz">
                    <Button
                      variant='contained'
                      sx={{ color: '#101436', backgroundColor: '#FFB100', fontFamily: 'Poppins', '&:hover': { backgroundColor: '#e9a402' } }}
                      onClick={handleProceedToQuiz}
                    >
                      Proceed to Quiz
                    </Button>
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
