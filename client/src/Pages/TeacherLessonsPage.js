import React from 'react'
import '../PagesCSS/LessonsPage.css'
import TeacherLessonsBox from '../ReusableComponents/TeacherLessonsBox';

const TeacherLessonsPage = () => {

    return (
        <div className='App-lessons-body'>
            <TeacherLessonsBox/>
        </div>
      )
}

export default TeacherLessonsPage