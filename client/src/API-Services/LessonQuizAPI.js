import axios from "axios";

export const insertLessonQuiz = async(newLessonQuiz) => {
    try{
        const response = await axios.post(process.env.REACT_APP_SPRINGBOOT_INSERT_LESSON_QUIZ, newLessonQuiz);
        return { success: true, message: 'You have successfully created a quiz! 🎉',data: response.data };
    }catch(error) {
        return { success: false, message: "Failed to create a quiz. Try again later." };
    }
}   