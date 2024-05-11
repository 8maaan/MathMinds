import React, { useState } from 'react';
import '../PagesCSS/TopicsPage.css';
import ReusableAppBar from './ReusableAppBar';

/*

Callable as a component with this variable passed on:

const lessonsData = [
        {
          lessonNumber: 1,
          topicNumber: 1,
          title: 'Introduction to SIA',
          content: [
            { type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.' },
            { type: 'image', imageUrl: 'example.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.'},
            { type: 'question',
              question: 'What is SIA?',
              options: ['System IA', 'System integrati A', 'Systems Integration and Architecture'],
              answer: 'Systems Integration and Architecture'
            },
            { type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.'},
          ],
        },
      ];

<TopicsPage lessons={lessonsData}/>

*/
const TopicsPage = ({ lessons }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const colors = ['color-1', 'color-2', 'color-3'];
  let colorIndex = 0;

  const renderLessonOutline = (lesson, index) => {
    return (
      <li key={index}>
        {lesson.lessonNumber}. {lesson.title}
        {lesson.topics && (
          <ul>
            {lesson.topics.map((topic, topicIndex) => (
              <li key={topicIndex}>
                Topic {topic.topicNumber}: {topic.title}
                {topic.subTopics && (
                  <ul>
                    {topic.subTopics.map((subTopic, subTopicIndex) => (
                      <li key={subTopicIndex}>
                        Sub-Topic {subTopic.subTopicNumber}: {subTopic.title}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleCheckAnswer = (correctAnswer) => {
    if (selectedOption === correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('Wrong!');
    }
    setChecked(true);
  };

  const getNextColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

  return (
    <div style={{display: 'flex', flexDirection:'row'}}>
      <ReusableAppBar/>
      <div className="container">
        <div className="sidebar">
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {lessons.map((lesson, index) => renderLessonOutline(lesson, index))}
          </ul>
        </div>
        <div className="main-content">
          {lessons.map((lesson, index) => (
            <div key={index} className="lesson">
              <div className="lesson-header" style={{display: 'flex', flexDirection: 'column'}}>
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
          <button className='proceed-button'>PROCEED TO QUIZ</button>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
