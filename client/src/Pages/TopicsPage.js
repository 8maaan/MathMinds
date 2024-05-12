import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../PagesCSS/TopicsPage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';

const TopicsPage = () => {

  const params = useParams();
  const lessonId = params.lessonId; {/*assuming lessonId is passed when TopicsPage.js is called?*/}
  const [selectedTopic, setSelectedTopic] = useState(null);

  {/* Test JSON Data */}
  const [lessonData] = useState([{
      "lessonId": 3,
      "lessonTitle": "New Jeans",
      "lessonTopics": [
        {
          "topicId": 4,
          "lessonId": 3,
          "topicTitle": "Testing 123",
          "topicContent": {
            "1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.",
            "2": "Bash2",
            "3": "Bosh3"
          }
        },
        {
          "topicId": 5,
          "lessonId": 3,
          "topicTitle": "Testing 1234",
          "topicContent": {
            "1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.",
            "2": "Bash2",
            "3": "Bosh3",
          }
        }
        ]
        }]);
  
  {/* here we fetch topics by utilizing the lessonId passed */}
  const fetchLessons = async() => {
    try {

    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
   console.log(lessonData); 
  })

  {/* for the mini seatwork*/}
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  {/* to get colors for the rectangle containers*/}
  const colors = ['color-1', 'color-2', 'color-3'];
  let colorIndex = 0;

  
  {/* for the mini seatwork*/}
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  {/* for the mini seatwork*/}
  const handleCheckAnswer = (correctAnswer) => {
    if (selectedOption === correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('Wrong!');
    }
    setChecked(true);
  };

  {/* to get colors for the rectangle containers*/}
  const getNextColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  {/* RENDER ALL OF THE TOPICS IN RWD SINCE SIDEBAR DISAPPEARS */}
  return (
    <div className='root'>
      <ReusableAppBar />
      <div className="container">
        <div className="sidebar">
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {lessonData.map((lesson, index) => (
              <li key={index}>
                {lesson.lessonId}. {lesson.lessonTitle}
                {lesson.lessonTopics && (
                  <ul style={{ paddingLeft: '20px' }}>
                    {lesson.lessonTopics.map((topic, topicIndex) => (
                      <li key={topicIndex} onClick={() => handleTopicClick(topic)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                        {lesson.lessonId}.{topic.topicId}. {topic.topicTitle}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          {lessonData.map((lesson, index) => (
            <div key={index}>
              <div className="lesson-header">
                <h4>Lesson {lesson.lessonId}</h4>
                <h1>{lesson.lessonTitle}</h1>
              </div>
              {selectedTopic && (
                <div>
                  <h4>Lesson {selectedTopic.lessonId}.{selectedTopic.topicId} - {selectedTopic.topicTitle}</h4>
                  <div className='lesson-content'>
                    {Object.keys(selectedTopic.topicContent).map((content, contentIndex) => (
                      <div key={contentIndex} className={`lesson-item ${getNextColor()}`}>
                        <p>{selectedTopic.topicContent[content]}</p>
                        {(contentIndex === Object.keys(selectedTopic.topicContent).length - 1 && selectedTopic.topicId === lesson.lessonTopics[lesson.lessonTopics.length - 1].topicId) && (
                          <p style={{ fontWeight: 'bold', textAlign: 'center' }}>END OF LESSON</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(selectedTopic && selectedTopic.lessonId === lessonData[lessonData.length - 1].lessonId && selectedTopic.topicId === lessonData[lessonData.length - 1].lessonTopics[lessonData[lessonData.length - 1].lessonTopics.length - 1].topicId) && (
                <button className='proceed-button'>PROCEED TO QUIZ</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;



/*  OLD TOPIC MAIN CONTENT

{lessons.map((lesson, index) => (
            <div key={index} className="lesson">
              <div className="lesson-header">
                <h4>Lesson {lesson.lessonNumber}</h4>
                <h1>{lesson.title}</h1>
              </div>
              <h4>Topic {lesson.topicNumber}</h4>
              <div className="lesson-content">
                {lesson.content.map((item, i) => (
                  <div key={i} className={`lesson-item ${getNextColor()}`}>
                    {item.type === 'text' && <p>{item.text}</p>}
                    {item.type === 'image' && (
                      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                        <p>{item.text}</p>
                        <img src={item.imageUrl} alt="Lesson" style={{ maxWidth: '100%', alignSelf: 'center' }} />
                      </div>
                    )}
                    {item.type === 'question' && (
                      <div>
                        <p>{item.question}</p>
                        <div className="question-container">
                          <div className="option-container">
                            {item.options.map((option, idx) => (
                              <button key={idx} onClick={() => handleOptionClick(option, item.answer)} className="option-button">
                                {option}
                              </button>
                            ))}
                          </div>
                          <div className="check-container">
                            <button onClick={() => handleCheckAnswer(item.answer)} className="confirm-button">Check</button>
                          </div>
                        </div>
                        {checked && <p>{feedback}</p>}
                      </div>
                    )}
                    {i === lesson.content.length - 1 && (
                      <p style={{ fontWeight: 'bold', textAlign: 'center' }}>END OF LESSON</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
*/
