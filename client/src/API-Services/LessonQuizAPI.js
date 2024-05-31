import axios from "axios";

export const insertLessonQuiz = async(newLessonQuiz) => {
    try{
        const response = await axios.post(process.env.REACT_APP_SPRINGBOOT_INSERT_LESSON_QUIZ, newLessonQuiz);
        return { success: true, message: 'You have successfully created a quiz! 🎉',data: response.data };
    }catch(error) {
        return { success: false, message: "Failed to create a quiz. Try again later." };
    }
}   

export const getAllLessonsQuiz = async () => {
    try {
        const response = await axios.get(process.env.REACT_APP_SPRINGBOOT_GET_LESSONQUIZ);
        //console.log(response.data)
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching lessons: ", error);
        return { success: false, message: "Failed to fetch lessons" };
    }
};

export const updateLessonQuiz = async (lessonQuizId, updatedLessonQuiz) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_SPRINGBOOT_EDIT_TOPIC}${lessonQuizId}`, updatedLessonQuiz);
        return { success: true, message: 'Lesson quiz updated successfully!', data: response.data };
    } catch (error) {
        console.error("Error updating lesson quiz: ", error);
        return { success: false, message: "Failed to update lesson quiz. Try again later." };
    }
};