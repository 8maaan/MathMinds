import React from 'react';
import '../PagesCSS/LessonProgressPage.css';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import ReusableChoices from '../ReusableComponents/ReusableChoices';



const LessonProgressPage = () => {
    return (
        <div className="Profilepage">
            <ReusableAppBar />
            <div className='lessonprog-wrapper'>
                <div className='lessonprog-content-container'>
                    <div className='lessonproginfo-left-side'>
                    <ReusableChoices/>
                    </div>
                    <div className='lessonproginfo-right-side'>
                        <div className='lessonprog-container'>
                            <div className='lessonprog-title'>Learning Progress</div>
                            <div className='userlessonprog-container'>
                                <div className='userinfo-lessonprog-container'>
                                  
                                          
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonProgressPage;
