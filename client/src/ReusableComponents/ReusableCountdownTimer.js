import React, { useEffect, useState } from 'react';
import '../PagesCSS/CountdownTimer.css';

const ReusableCountdownTimer = ({ initialTimer, onTimerFinish }) => {
  const [timer, setTimer] = useState(initialTimer);

  useEffect(() => {
    setTimer(initialTimer); // Initialize timer with the initial value
  }, [initialTimer]);
  
  useEffect(() => {
    let timerId;
    if (timer > 0) {
      timerId = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      onTimerFinish();
    }
    return () => clearTimeout(timerId);
  }, [timer, onTimerFinish]);

  return (
    <div 
      className="countdown-wrapper" 
      style={{
        animation: `countdown ${12}s linear`,
        counterReset: `my-count ${timer}`
      }}
    >
      <span className="countdown-text">Get ready in...</span>
    </div>
  );
};

export default ReusableCountdownTimer;