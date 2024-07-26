import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { ListItemIcon, ListItemButton, ListItemText, List, ListItem, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckIcon from '@mui/icons-material/Check';


const drawerWidth = 250;

function ResponsiveDrawer({ lessonData, handleTopicClick, userTopicProgress }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  
  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItemText primary={
          <Typography sx={{fontWeight:'bold', color:'#181A52'}}>
            {lessonData.lessonTitle}
          </Typography>} 
          sx={{padding:'5%'}}
        />
        <Divider />
        {lessonData.lessonTopics.map((topic, index) => (
          <ListItem key={topic.topicId} disablePadding>
            <ListItemButton 
              key={topic.topicId}
              sx={{ pl: 4 }}
              onClick={() => handleTopicClick(topic, index)}
            >
              <ListItemIcon>
                {userTopicProgress[topic.topicId] === true ? <CheckIcon fontSize='medium' sx={{ color: '#c602e8'}}/> : null}
              </ListItemIcon>
              <ListItemText primary={topic.topicTitle} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: 'auto', marginTop:'100%'}}>
      <CssBaseline />
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{display: { sm: 'none' }}}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Toolbar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth},
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#eee3ff",
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          PaperProps={{
            sx: {
              backgroundColor: "rgba(170, 117, 203, 0.2)",
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}


export default ResponsiveDrawer;
