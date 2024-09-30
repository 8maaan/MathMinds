import React from 'react';
import LandingAppBar from '../ReusableComponents/LandingAppBar';
import '../PagesCSS/AttributionPage.css';
import '../PagesCSS/Global.css';
import { Box, Paper, Typography, Link } from '@mui/material';

const AttributionPage = () => {
    return (
        <>
            <LandingAppBar />
            <Box className='attribution-body'>
                <Paper className='attribution-content-wrapper'>
                    <Typography variant='h4' align='center' fontWeight={600} sx={{ mb: '3.5%', mt:'15px'}}>
                       Attributions
                    </Typography>

                    {/* PhET Simulation Attribution */}
                    <section style={{ marginBottom: '20px', padding: '10px', borderRadius: '8px' }}>
                        <Typography variant='h5' gutterBottom >
                            Math Simulations
                        </Typography>
                        <Typography variant='body1' paragraph>
                            To enhance the learning experience for our 3rd-grade students, we integrated several interactive simulations from PhET Interactive Simulations.
                            These simulations offer dynamic and visually engaging tools that allow students to manipulate variables and visualize mathematical concepts in real time.
                            By incorporating these simulations, we aim to provide a hands-on, experimental approach to learning that can help reinforce theoretical concepts and make abstract 
                            mathematical ideas more tangible. These resources align perfectly with our goal of creating a more interactive and immersive learning platform for young students.
                        </Typography>
                        <Typography variant='body2'>
                            PhET Interactive Simulations:
                            <Link href="https://phet.colorado.edu/" target="_blank" rel="noopener noreferrer">
                                phet.colorado.edu
                            </Link>
                        </Typography>
                    </section>

                    {/* Lottie Files Attribution */}
                    <section style={{ marginBottom: '20px', padding: '10px', borderRadius: '8px' }}>
                        <Typography variant='h5' gutterBottom >
                            Visual Animations
                        </Typography>
                        <Typography variant='body1' paragraph>
                            Animations play a crucial role in maintaining the attention and engagement of young learners. To achieve this, we utilized animations from Lottie Files, 
                            a platform that provides a wide variety of high-quality animations. These animations are integrated throughout our lessons, offering visual cues and feedback 
                            that help simplify complex topics, making them more approachable and fun for 3rd-grade students. The seamless animated elements also serve 
                            to enhance user interaction, making the learning environment more vibrant and enjoyable.
                        </Typography>
                        <Typography variant='body2'>
                            Lottie Files: 
                            <Link href="https://lottiefiles.com/" target="_blank" rel="noopener noreferrer">
                                lottiefiles.com
                            </Link>
                        </Typography>
                    </section>

                    {/* Freepik Attribution */}
                    <section style={{ marginBottom: '20px', padding: '10px', borderRadius: '8px' }}>
                        <Typography variant='h5' gutterBottom >
                            Images and Backgrounds
                        </Typography>
                        <Typography variant='body1' paragraph>
                            Visual appeal is key to creating an engaging and immersive learning environment for young children. To achieve this, we sourced various images and 
                            cartoon-style backgrounds from Freepik. These assets were selected to complement the content of each lesson, making the interface visually stimulating 
                            without distracting from the educational material. By using Freepik's high-quality, creative visuals, we ensure that the overall aesthetic of the platform 
                            aligns with the playful yet educational tone we aimed to establish, thereby enhancing the user experience.
                        </Typography>
                        <Typography variant='body2'>
                            Freepik:
                            <Link href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer">
                                freepik.com
                            </Link>
                        </Typography>
                    </section>
                </Paper>
            </Box>
        </>
    );
};

export default AttributionPage;
