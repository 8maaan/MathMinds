import React from 'react'
import '../PagesCSS/LessonsPage.css'
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import TeacherLessonsBox from '../ReusableComponents/TeacherLessonsBox';

const TeacherLessonsPage = () => {

    return (
        <div>
            <ReusableAppBar/>
            <TeacherLessonsBox/>
        </div>
      )
}

export default TeacherLessonsPage