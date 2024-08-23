import React, { useEffect, useState } from 'react';
import '../PagesCSS/CountdownTimer.css';

const ReusableCountdownTimer = ({ initialTimer }) => {
  const [timer, setTimer] = useState(initialTimer);

  useEffect(() => {
    setTimer(initialTimer); // Initialize timer with the initial value
  }, [initialTimer]);
  
  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timer]);

  return (
    <div 
      className="countdown-wrapper" 
      style={{
        animation: `countdown ${11}s linear`,
        counterReset: `my-count ${timer}`
      }}
    >
      <span className="countdown-text">Get ready in...</span>
    </div>
  );
};

export default ReusableCountdownTimer;