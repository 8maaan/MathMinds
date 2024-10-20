import React from 'react';
import { Button } from '@mui/material';


const AccordionCustomButton = ({ children, onClick, sx, ...props }) => {
  return (
    <Button
      onClick={onClick}
      {...props}
      sx={{
        position: 'relative',
        display: 'inline-block',
        margin: '20px',
        padding: '10px 20px',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 'bold',
        textAlign: 'center',
        textDecoration: 'none',
        backgroundColor: `${sx?.accordionColor || '#F78900'}`, // Default background color 
        boxShadow: `inset 0 1px 0 #FFE5C4, 0 10px 0 ${sx?.summaryBgColor || '#915100'}`, // summaryBgColor
        borderRadius: '50px',
        '&:active': {
          top: '10px',
          backgroundColor: `${sx?.accordionColor || '#F78900'}`,
          boxShadow: `inset 0 1px 0 ${sx?.summaryBgColor || '#915100'}, inset 0 -5px 0 ${sx?.summaryBgColor || '#915100'}`, // summaryBgColor on active state
        },
        '&::after': {
          content: '""', 
          height: '100%',
          width: '100%',
          padding: '4px',
          position: 'absolute',
          bottom: '-15px',
          left: '-4px',
          zIndex: '-1',
          backgroundColor: '#2B1800',
          borderRadius: '50px',
        },
        animation: 'flash 1.5s infinite ease', // Add color flash animation
        '@keyframes flash': { // Keyframes for flashing effect
          '0%, 100%': {
            backgroundColor: `${sx?.accordionColor}`, // Start color
          },
          '50%': {
            backgroundColor: '#FFE5C4', // Lighter color in between
          }
        },
        ...sx, // 
      }}
    >
      {children}
    </Button>
  );
};

export default AccordionCustomButton;
