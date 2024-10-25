import React from "react";
import { Button } from '@mui/material';

const CustomButton = ({ onClick, children, type, sx, size = "default" }) => {
    return (
        <Button
            type={type}
            disableRipple
            onClick={onClick}
            sx={{
                position: 'relative',
                display: sx?.display || 'inline-block',
                alignItems: sx?.alignItems || 'center',
                justifyContent: sx?.justifyContent || 'center',
                fontSize: sx?.fontSize || '14px',
                marginRight: sx?.marginRight,
                marginLeft: sx?.marginLeft,
                marginBottom: sx?.marginBottom,
                marginTop: sx?.marginTop || '20px',
                padding: sx?.padding || '10px 40px',
                width: sx?.width || '100%',
                color: sx?.color || 'white',
                fontWeight: sx?.fontWeight || 'bold',
                textAlign: 'center',
                textDecoration: 'none',
                backgroundColor: sx?.backgroundColor || '#Ffb100',
                textShadow: '0px 1px 0px #000',
                boxShadow: 'inset 0 1px 0 #FFE5C4, 0 10px 0 #915100',
                borderRadius: sx?.borderRadius || '50px',
                '&:hover': {
                    backgroundColor: sx?.hoverBackgroundColor || '#F78900', // Allow dynamic hover color
                },
                '&:active': {
                    top: '10px',
                    backgroundColor: '#F78900',
                    boxShadow: 'inset 0 1px 0 #FFE5C4, inset 0 -3px 0 #915100',
                    '&::after': {
                        bottom: '-5px',
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
                    zIndex: '-1',
                    backgroundColor: '#2B1800',
                    borderRadius: sx?.borderRadius || '50px',
                },
                ...sx // Spread the additional styles passed in the sx prop
            }}
        >
            {children}
        </Button>
    );
};

export default CustomButton;
