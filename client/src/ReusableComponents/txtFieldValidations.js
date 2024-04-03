// TO BE COMPLETED SOON TM

export const validateEmail = (email) => {
    const regex = /\b[A-Z0-9._%+-]+@gmail\.com\b/i;
    return regex.test(email);
}

export const isEmpty = (inputValue) => {
    return !inputValue || !inputValue.trim();
}