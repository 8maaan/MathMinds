import React from 'react'
import '../PagesCSS/HomePage.css'
import { UserAuth } from '../Context-and-routes/AuthContext';
import {AppBar, Box, Toolbar, Typography, IconButton, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material'
import { useNavigate } from 'react-router-dom'

// FOR TESTING PURPOSES ONLY (ROUTES)
// EDIT LATER
// testing new branch

const pages = ['Home', 'Dashboard', 'Lessons', 'Practice'];
const settings = ['Profile', 'Logout'];


const HomePage = () => {
    const navigateTo = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    
    const handleOpenUserMenu = (event) => {
            setAnchorElUser(event.currentTarget);
        };
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    
    const handleClickNavMenu = (menu) => {
        if (menu === 'Home') {
            navigateTo('/home');
        } else if (menu === 'Dashboard') {
            navigateTo('*');
        } else if (menu === 'Lessons') {
            navigateTo('*');
        } else if (menu === 'Practice') {
            navigateTo('*');
        }
    };

    const handleClickSetting = (setting) => {
        if (setting === 'Profile') {
            navigateTo('*');
        } else if (setting === 'Logout') {
            navigateTo('/profile');
        }
    };

    const { user } = UserAuth();
    return (
        <div>
            {user ? 
                <>
                    <div class="Homepage">
                        <AppBar className='nav-bar' sx={{backgroundColor: '#ffb100'}}>
                            <Container maxWidth='100%'>
                                <Toolbar disableGutters>
                                <img className='app-bar-logo' src='https://imgur.com/1dsVqNE.png' alt='logo' height='80px'/>

                                <Box sx={{ flexGrow: 1 }} />

                                <Box className='nav-buttons' sx={{ display: 'flex', alignItems: 'center' }}>
                                    {pages.map((menu) => (
                                        <Button className='nav-buttons button'
                                            key={menu}
                                            onClick={() => handleClickNavMenu(menu)}
                                            sx={{ my: 2, ml: 4, color: '#181A52', fontFamily: 'Poppins, sans-serif', display: 'block' }}
                                        >
                                            {menu}
                                        </Button>
                                    ))}
                                </Box>

                                <Box sx={{ flexGrow: 0, ml: 4 }}>
                                    <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={user} src="https://imgur.com/ip7Owg9.png" />
                                    </IconButton>
                                    </Tooltip>
                                    <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={() => handleClickSetting(setting)}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                    </Menu>
                                </Box>
                                </Toolbar>
                            </Container>
                        </AppBar>

                        <Box>
                            <Typography class='home-header'>
                                Hey there, math explorer!
                            </Typography>
                            <Typography class='home-paragraph'>
                                Ready to dive into the world of numbers and have some math fun together?
                            </Typography>
                        </Box>

                        <Box className='image-buttons'>
                            <Button className='button'>
                                <img src="https://imgur.com/nsthhLE.png" alt="Dashboard" className='img-button-size' onClick={()=> navigateTo('*')}/>
                            </Button>
                            <Button className='image-buttons-margin'>
                                <img src="https://imgur.com/iP9rats.png" alt="Lessons" className='img-button-size' onClick={()=> navigateTo('*')}/>
                            </Button>
                            <Button className='button'>
                                <img src="https://imgur.com/A0SMvsY.png" alt="Practice" className='img-button-size' onClick={()=> navigateTo('*')}/>
                            </Button>
                        </Box>
                    </div>
                </>
            :   
                <>
                    <h2>Not signed in</h2>
                    <h3>Check if you can access /profile, if not, good.</h3>
                </>
            }
        </div>
    )
}

export default HomePage