import React from 'react'
import '../PagesCSS/LessonsPage.css'
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import LessonsBox from '../ReusableComponents/LessonsBox';

const LessonsPage = () => {

    return (
        <div>
            <ReusableAppBar/>
            <LessonsBox/>
        </div>
      )
}

export default LessonsPage