import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material'
import MenuIcon from '../Images/MenuIcon.png'
import { useState } from 'react';
import { UserAuth } from '../Context-and-routes/AuthContext';
import { useNavigate } from 'react-router-dom';
import mathMindsLogo from '../Images/mathminds-logo.png';
import mathMindsLogo2 from '../Images/mathminds-logo2.png';
import { useUserRoles } from './useUserRoles';

export default function ReusableAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { user } = UserAuth();
  const { isTeacher, isAdmin } = useUserRoles(user ? user.uid : null);

  const pages = (isTeacher || isAdmin) ? ['Home', 'Dashboard', 'Manage Lessons', 'Practice'] : ['Home', 'Dashboard', 'Lessons', 'Practice'];
  
  // Add "Manage Accounts" to settings only if the user is an Admin
  const settings = isAdmin ? ['Profile', 'Manage Accounts', 'Logout'] : ['Profile', 'Logout'];

  const { logOut } = UserAuth();

  const navigateTo = useNavigate();

  const handleUserLogOut = async () => {
    try {
      const userLogOut = await logOut();
      console.log(userLogOut);
    } catch (e) {
      console.log(e.message);
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    switch(page){
      case 'Home':
        // console.log('Home');
        navigateTo('/home');
        window.scrollTo(0, 0);
        break;

      case 'Dashboard':
        // console.log('Dashboard');
        navigateTo('/lesson-progress');
        window.scrollTo(0, 0);
        break;

      case 'Lessons':
        // console.log('Lessons');
        navigateTo('/lessons');
        window.scrollTo(0, 0);
        break;

      case 'Manage Lessons':
        navigateTo('/lessons-teacher');
        window.scrollTo(0, 0);
        break;

        case 'Practice':
          navigateTo('/practice');
          window.scrollTo(0, 0);
          break;

      default:
        break;
    }
  };

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    switch(setting){
      case 'Profile':
        // console.log('Profile');
        navigateTo('/profile');
        break;

      case 'Manage Accounts':
        navigateTo('/manage-accounts'); // Redirect to the user management page
        window.scrollTo(0, 0);
        break;

      case 'Logout':
        // console.log('Logout');
        handleUserLogOut();
        break;

      default:
        break;
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#ffb100', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {/* LOGO */}
            <img className='app-bar-logo' src={mathMindsLogo2} alt='logo' height='80px'/>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {/* MENU ICON */}
              <img src={MenuIcon} alt='menu-icon' height='30px'/>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => { handleCloseNavMenu(page) }} sx={{ color: '#181A52', fontFamily: 'Poppins, sans-serif' }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img src={mathMindsLogo} alt='logo' height='50px'/>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => { handleCloseNavMenu(page) }}
                sx={{ my: 2, ml: 2, mr: 2, color: '#181A52', fontFamily: 'Poppins, sans-serif', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* AVATAR */}
                <Avatar src="https://imgur.com/ip7Owg9.png" alt='UserDP' />
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
                <MenuItem key={setting} onClick={() => { handleCloseUserMenu(setting) }} sx={{ color: '#181A52', fontFamily: 'Poppins, sans-serif' }}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
