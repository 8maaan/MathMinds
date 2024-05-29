import React, { useEffect, useState } from 'react'
import '../PagesCSS/Loading.css'

const LoadingAnimations = () => {
    const [randomLoader, setRandomLoader] = useState(null);
    const [mathFactsIndex, setMathFactsIndex] = useState(0);

    // SAMPLE ONLY, ADD STUFF L8ER
    const mathFacts = [
        "Every odd number has an ‘e’.",
        "1000 is the only number from 0 to 1000 that has “a” in it",
        "Palindrome Numbers: A palindrome number reads the same forward and backward, like 121 or 1331. They are fun to find!",
        "Zero is Special: Zero is the only number that can't be represented by Roman numerals. The concept of zero was invented by ancient mathematicians from India."
    ]

    useEffect(() =>{

        // Adjust depending on how many animation options in Loading.css
        const randomLoaderNum = Math.floor((Math.random() * 3) + 1);
        const mathFactsRandomIndex = Math.floor((Math.random() * mathFacts.length) + 1);
        
        setRandomLoader(`loader${randomLoaderNum}`);
        setMathFactsIndex(mathFactsRandomIndex - 1);
    },[mathFacts.length])

    return (
        <div className='loading-body'>
            <div className='loader-container'>
                <div className={randomLoader}/>
            </div>
            {/* Temporary only, change l8er */}
            <div className='loading-fun-facts'>
                {mathFacts[mathFactsIndex]}
            </div>
        </div>
    )
}

export default LoadingAnimations