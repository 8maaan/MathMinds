// TO BE COMPLETED SOON TM

export const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const isPasswordValid = (password) => {
    // const hasNumber = /\d/.test(password); 
    const isLengthValid = password.length >= 8;

    return isLengthValid
}

export const isPasswordMatch = (password, retypePassword) =>{
    return password === retypePassword;
}

export const isEmpty = (inputValue) => {
    return !inputValue || !inputValue.trim();
}