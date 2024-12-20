import React from 'react'
import '../PagesCSS/HomePage.css'
import {Box, Typography, Button} from '@mui/material'
import { Link } from 'react-router-dom';
import homepageDashboardBtn from '../Images/HomePage_DashboardBtn2.png';
import homepageLessonBtn from '../Images/HomePage_LessonsBtn.png';
import homepagePracticeBtn from '../Images/HomePage_PracticeBtn2.png';
import { UserAuth } from '../Context-and-routes/AuthContext';
import { useUserRoles } from '../ReusableComponents/useUserRoles';

const HomePage = () => {
    const { user } = UserAuth();
    const { isTeacher, isAdmin } = useUserRoles(user ? user.uid : null);

    return (
        <div className='App-home-body'>
            <div className="Homepage">
                <Box>
                    <Typography class="home-header">
                        Hey there, {user.displayName ? user.displayName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : 'math explorer'}!
                    </Typography>
                    <Typography class="home-paragraph">
                        Ready to dive into the world of numbers and have some math fun together?
                    </Typography>
                </Box>

                <Box className="image-buttons">
                    <Link to={(isTeacher || isAdmin) ? "/dashboard-analytics" : "/studentDashboard"} className="image-buttons-margin">
                        <Button className="img-button-size">
                            <img src={homepageDashboardBtn} alt="Dashboard" className="img-button-size" />
                        </Button>
                    </Link>
                    <Link to="/lessons" className="image-buttons-margin" style={{ marginLeft: '24px', marginRight: '24px' }}>
                        <Button className="img-button-size">
                            <img src={homepageLessonBtn} alt="Lessons" className="img-button-size" />
                        </Button>
                    </Link>
                    <Link to="/practice" className="image-buttons-margin">
                        <Button className="img-button-size">
                            <img src={homepagePracticeBtn} alt="Practice" className="img-button-size" />
                        </Button>
                    </Link>
                </Box>
            </div>       
        </div>
    )
}

export default HomePage
