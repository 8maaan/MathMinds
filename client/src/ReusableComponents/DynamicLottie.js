import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

// Create a context for all files in the LottieAnimations directory similar to the modals used in TopicContentStoryboard.js
const animationContext = require.context('../LottieFiles/LottieAnimations', true, /\.json$/);

const DynamicLottie = ({ animationPath }) => {
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnimation = async () => {
      // Check if animationPath is empty or null (to ignore empty array values)
      if (!animationPath) {
        // Skip loading and return early
        setError(null);
        return;
      }

      try {
        // Fetch the animation data using the context
        const module = animationContext(`.${animationPath}`);
        setAnimationData(module);
      } catch (error) {
        console.error('Failed to load animation:', error, 'could not find', animationPath);
        setError('Failed to load animation');
      }
    };

    loadAnimation();
  }, [animationPath]);

  console.log(animationData);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!animationData) {
    // If animationPath was empty or the animation is still loading, show nothing or a placeholder
    return animationPath ? <div>Loading animation...</div> : null;
  }

  return (
    <Lottie 
      animationData={animationData} 
      style={{ height: '150px', width: 'inherit' }} 
    />
  );
};

export default DynamicLottie;
