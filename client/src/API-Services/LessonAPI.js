import axios from "axios";

export const getAllLessonsFromDb = async () => {
    try {
        const response = await axios.get(process.env.REACT_APP_SPRINGBOOT_GET_LESSONS);
        //console.log(response.data)
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching lessons: ", error);
        return { success: false, message: "Failed to fetch lessons" };
    }
};

export const insertLessonToDb = async (newLessonTitle, newLessonDescription, newLessonBadgeImageUrl) => {
    try {
        const response = await axios.post(process.env.REACT_APP_SPRINGBOOT_INSERT_LESSON, {
            lessonTitle: newLessonTitle,
            lessonDescription: newLessonDescription,
            lessonBadgeImageUrl: newLessonBadgeImageUrl
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error inserting lesson: ", error.response ? error.response.data : error.message);
        return { success: false, message: "Failed to create a lesson", error: error.response ? error.response.data : error.message };
    }
};

export const deleteLessonFromDb = async (lessonId) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_SPRINGBOOT_DELETE_LESSON}${lessonId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error deleting lesson: ", error.response ? error.response.data : error.message);
        return { success: false, message: "Failed to delete lesson", error: error.response ? error.response.data : error.message };
    }
};

export const getLessonById = async(lessonId) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_SPRINGBOOT_GET_LESSON_BY_ID}${lessonId}`);
        return { success: true, data: response.data };
    }catch(error) {
        console.error("Error fetching lesson by id: ", error);
        return { success: false, message: "Failed to fetch lesson. Try again later." };
    }
}

export const updateLessonInDb = async (lessonId, lessonTitle, lessonDescription, lessonBadgeImageUrl) => {
    try {
        const apiUrl = process.env.REACT_APP_SPRINGBOOT_EDIT_LESSON;
        const response = await fetch(`${apiUrl}${lessonId}`, {
            method: 'PUT', // or 'POST' if that's what your API expects
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lessonTitle,
                lessonDescription,
                lessonBadgeImageUrl
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data };
        }
    } catch (error) {
        return { success: false, error };
    }
};

export const getLessonWithProgress = async (lessonId, uid) => {
    try{
        const endPoint = process.env.REACT_APP_SPRINGBOOT_GET_LESSON_WITH_PROGRESS
            .replace('{lessonId}', lessonId)
            .replace('{uid}', uid)

        const response = await axios.get(endPoint);
        return { success: true, message: "Progress successfully updated.", data: response.data };
    }catch(error){
        return { success: false, message: "Failed to get lesson with progress.", error: error.response ? error.response.data : error.message };
    }
}