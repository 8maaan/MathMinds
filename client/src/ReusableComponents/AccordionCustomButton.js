import React from 'react';
import { Button } from '@mui/material';

const AccordionCustomButton = ({ children, onClick, sx, ...props }) => {
  return (
    <Button
      onClick={onClick}
      disableRipple
      {...props}
      sx={{
        position: 'relative',
        display: 'inline-block',
        margin: '15px',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 'bold',
        textAlign: 'center',
        textDecoration: 'none',
        padding: '10px 40px',
        backgroundColor: `${sx?.accordionColor || '#F78900'}`, // Default background color 
        boxShadow: `inset 0 1px 0 #FFE5C4, 0 10px 0 ${sx?.summaryBgColor || '#915100'}`, // summaryBgColor
        borderRadius: `${sx?.borderRadius || '15px'}`,
        overflow: `${sx?.overflow || 'hidden'}`,
        //overflow: 'hidden', // Ensure shine stays within bounds
        //zIndex: '2',
        '&:active': {
          top: '10px',
          //backgroundColor: `${sx?.accordionColor || '#F78900'}`,
          boxShadow: `inset 0 1px 0 #FFE5C4, inset 0 -3px 0 ${sx?.summaryBgColor || '#915100'}`, // summaryBgColor on active state
          //zIndex: '2',
          '&::after': {
            bottom: '-5px', // Move the shadow up by 10px when the button is pressed
          }
        },
        '::after': {
            content: '""',
            height: '100%',
            width: '100%',
            padding: '4px',
            position: 'absolute',
            bottom: '-15px',
            left: '-4px',
            zIndex: '-1', // Ensure the shadow is below the button, naa man sya pero ngano di makita oy ???
            backgroundColor: '#2B1800',
            borderRadius: `${sx?.borderRadius || '15px'}`,
        },
        /*'::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-150%',
            width: '200%',
            height: '100%',
            background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 70%)',
            transform: 'skewX(-30deg)',
            transition: 'all 0.5s ease',
            animation: 'shine 1.5s infinite linear', // Shine animation
        },
        '@keyframes shine': {
          '0%': {
            left: '-150%',
          },
          '100%': {
            left: '150%',
          }
        },*/
        ...sx,  //Merge other styles
      }}
    >
      {children}
    </Button>
  );
};

export default AccordionCustomButton;
