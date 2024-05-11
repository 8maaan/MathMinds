import React, { useState } from 'react';
import '../PagesCSS/QuizPage.css';
import ReusableAppBar from './ReusableAppBar';


/*

Callable as a Component with this variable passed on:

const questions = [
        {
          question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A"
        },
        {
          question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A"
        },
        {
          question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A"
        },
        {
          question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A"
        },
      ];

<QuizPage questions={questions} />

*/


// Reloading restarts the whole quiz
const QuizPage = ({ questions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
  
    const handleOptionClick = (option) => {
      setSelectedOption(option);
  
      if (option === questions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
  
      setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption('');
        } else {
          setShowResult(true);
        }
      }, 1000); 
    };
  
    const handleLesson = () => {
      console.log('lesson page')
    };
  
    return (
      <div className='root'>
        <ReusableAppBar/>
          <div style={{display: 'flex' , flexDirection:'row', marginTop: '110px'}}>
          <h1 style={{ textAlign: 'center', fontWeight: 15000, fontFamily: 'Poppins, sans-serif'}}> Final Assessment </h1>
          </div>
          <div className="quiz-container">
          {showResult ? (
              <div style={{textAlign:'left'}}>
              <h2>Quiz Result</h2>
              <p>Your Score: {score} out of {questions.length}</p>
              <button onClick={handleLesson} className='lesson-button'>Back to Lesson</button>
              </div>
          ) : (
              <div className="question-container">
              <h2>Item {currentQuestionIndex + 1}</h2>
              <p>{questions[currentQuestionIndex].question}</p>
              
              </div>
          )}
          </div>
          {showResult ? (
              <></>
          ) : (
              <div className="options-container">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                      key={index}
                      className={`option-button ${index === 0 ? 'top-left' : index === 1 ? 'top-right' : index === 2 ? 'bottom-left' : 'bottom-right'}`}
                      onClick={() => handleOptionClick(option)}
                  >
                      {option}
                  </button>
                  ))}
              </div>
          )}
      </div>
    );
  };

export default QuizPage;
