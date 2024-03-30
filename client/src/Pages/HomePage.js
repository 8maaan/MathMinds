import React from 'react'
import '../PagesCSS/HomePage.css'
import { UserAuth } from '../Context-and-routes/AuthContext';
import {AppBar, Box, Toolbar, Typography, IconButton, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material'

// FOR TESTING PURPOSES ONLY (ROUTES)
// EDIT LATER
// testing new branch
const pages = ['Home', 'Dashboard', 'Lessons', 'Practice'];
const settings = ['Profile', 'Logout'];


const HomePage = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
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
                                    {pages.map((page) => (
                                        <Button className='nav-buttons button'
                                            key={page}
                                            onClick={handleCloseNavMenu}
                                            sx={{ my: 2, ml: 4, color: '#181A52', fontFamily: 'Poppins, sans-serif', display: 'block' }}
                                        >
                                            {page}
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
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
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
                            <Button /*onClick={handleClickImage1}*/>
                                <img src="https://imgur.com/nsthhLE.png" alt="Dashboard" className='img-button-size'/>
                            </Button>
                            <Button className='image-buttons-margin'>
                                <img src="https://imgur.com/iP9rats.png" alt="Lessons" className='img-button-size' />
                            </Button>
                            <Button>
                                <img src="https://imgur.com/A0SMvsY.png" alt="Practice" className='img-button-size' />
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