import api from "./axiosConfig";

export const insertLessonQuiz = async (newLessonQuiz) => {
    try {
        const response = await api.post(process.env.REACT_APP_SPRINGBOOT_INSERT_LESSON_QUIZ, newLessonQuiz);
        return { success: true, message: 'You have successfully created a quiz! 🎉', data: response.data };
    } catch (error) {
        return { success: false, message: "Failed to create a quiz. Try again later." };
    }
};

export const getAllLessonsQuiz = async () => {
    try {
        const response = await api.get(process.env.REACT_APP_SPRINGBOOT_GET_LESSONQUIZ);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching lessons: ", error);
        return { success: false, message: "Failed to fetch lessons" };
    }
};

export const updateLessonQuiz = async (lessonQuizId, updatedLessonQuiz) => {
    try {
        const response = await api.put(`${process.env.REACT_APP_SPRINGBOOT_EDIT_LESSON_QUIZ}${lessonQuizId}`, updatedLessonQuiz);
        return { success: true, message: 'Lesson quiz updated successfully!', data: response.data };
    } catch (error) {
        console.error("Error updating lesson quiz: ", error);
        return { success: false, message: "Failed to update lesson quiz. Try again later." };
    }
};

export const getLessonQuizById = async (lessonQuizId) => {
    try {
        const response = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_LESSONQUIZ_BY_ID}${lessonQuizId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching lesson quiz by id: ", error);
        return { success: false, message: "Failed to fetch lesson quiz. Try again later." };
    }
};

export const isQuizAdministered = async (lessonQuizId) => {
    try{
        const response = await api.get(process.env.REACT_APP_SPRINGBOOT_CHECK_QUIZ_ADMINISTERED.replace("{lessonQuizId}", lessonQuizId));
        return { success: true, data: response.data };
    }catch (error) {
        console.error("Error checking quiz:", error);
        return { success: false, message: "Failed to check quiz" };
    }
}

export const getRandomizedLessonQuizByLessonQuizId = async (lessonQuizId) => {
    try {
      const response = await api.get(process.env.REACT_APP_SPRINGBOOT_GET_RANDOMIZED_LESSONQUIZ_QA_BY_LESSONQUIZID.replace("{lessonQuizId}", lessonQuizId));
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching practice by topic id: ", error);
      return { success: false, message: "Failed to fetch practice by topic id. Try again later." };
    }
  }

export const deleteLessonQuiz = async (lessonQuizId) => {
    try {
        const response = await api.delete(process.env.REACT_APP_SPRINGBOOT_DELETE_LESSONQUIZ.replace("{lessonQuizId}", lessonQuizId));
        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error deleting lesson quiz: ", error);
        return { success: false, message: "Failed to delete lesson quiz. Try again later." };
      }
}