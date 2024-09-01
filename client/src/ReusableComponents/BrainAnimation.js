import React from 'react'
import Brain1 from '../Images/BrainImages/brain1.png'
import Brain2 from '../Images/BrainImages/brain2.png'
import Brain3 from '../Images/BrainImages/brain3.png'
import Brain4 from '../Images/BrainImages/brain4.png'
import '../PagesCSS/BrainAnimation.css';
const BrainAnimation = () => {
    return (
        <div className="container-brain">
  <div className="brain">
  <img src={Brain1} className='brain1'/>
          <img src={Brain2} className='brain2'/>
          <img src={Brain3} className='brain3'/>
          <img src={Brain4} className='brain4'/>
  </div>
</div>
    )
}

export default BrainAnimation
