import React from 'react'
import '../PagesCSS/LessonsBox.css'

const lessonsData = [
    { number: 1, title: 'Introduction to React' },
    { number: 2, title: 'Components and Props' },
    // Add more lesson objects as needed
  ];

const LessonsBox = () => {
    return (
        <div>
            <div className="lessons-container">
                {lessonsData.map((lesson, index) => (
                    <div key={index} className="lesson-box">
                    <p>Lesson {lesson.number}</p>
                    <h2>{lesson.title}</h2>
                    
                    </div>
                ))}
            </div>
        </div>
      )
}

export default LessonsBox