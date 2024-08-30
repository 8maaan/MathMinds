import React from 'react';
import '../PagesCSS/LoginPageBg.css';
import Main from '../Images/LoginPageImages/main.png';
import Bubble1 from '../Images/LoginPageImages/bubble_1.png';
import Bubble2 from '../Images/LoginPageImages/bubble_2.png';
import Bubble3 from '../Images/LoginPageImages/bubble_3.png';
import StarLeft from '../Images/LoginPageImages/star_l.png';
import StarRight from '../Images/LoginPageImages/star_r.png';
import PlusSign from '../Images/LoginPageImages/plus.png';
import MinusSign from '../Images/LoginPageImages/minus.png';
import MultiplySign from '../Images/LoginPageImages/multiply.png';
import EqualSign from '../Images/LoginPageImages/equal.png';

const LoginPageBg = () => {
    return (
        <div className='container-login-bg'>
            <img src={Main} alt='Main'/>
            <img src={StarLeft}  className='star-left' alt='Left Star'/>
            <img src={StarRight} className='star-right' alt='Right Star'/>
            <img src={Bubble1} className='bubble1' alt='First Bubble'/>
            <img src={Bubble2} className='bubble2' alt='Second Bubble'/>
            <img src={Bubble3} className='bubble3' alt='Third Bubble'/>
            <img src={MinusSign} className='minus' alt='Minus Sign'/>
            <img src={MultiplySign} className='multiply' alt='Multiply Sign'/>
            <img src={PlusSign} className='plus' alt='Plus Sign'/>
            <img src={EqualSign} className='equal' alt='Equal Sign'/>
        </div>
    );
}

export default LoginPageBg;
