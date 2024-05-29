import React from 'react'
import '../PagesCSS/Loading.css'

const LoadingAnimations = () => {
    const randomLoaderNum = Math.floor((Math.random() * 3) + 1); // Adjust based on the number of loader/loading animations in Loading.css
    const mathFactsRandomIndex = Math.floor((Math.random() * 4) + 1) - 1;

    // SAMPLE ONLY, ADD STUFF L8ER
    const mathFacts = [
        "Every odd number has an ‘e’.",
        "1000 is the only number from 0 to 1000 that has “a” in it",
        "Palindrome Numbers: A palindrome number reads the same forward and backward, like 121 or 1331. They are fun to find!",
        "Zero is Special: Zero is the only number that can't be represented by Roman numerals. The concept of zero was invented by ancient mathematicians from India."
    ]

    const randomLoader = `loader${randomLoaderNum}`;
    const mathFact = mathFacts[mathFactsRandomIndex];

    return (
        <div className='loading-body'>
            <div className='loader-container'>
                <div className={randomLoader}/>
            </div>
            <div className='loading-fun-facts'>
                {mathFact}
            </div>
        </div>
    )
}

export default LoadingAnimations
