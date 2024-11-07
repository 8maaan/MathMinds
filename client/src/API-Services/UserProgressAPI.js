import api from "./axiosConfig";

export const updateProgress = async(uid, topicId, completed) => {
    try {
        const url = process.env.REACT_APP_SPRINGBOOT_UPDATE_PROGRESS
            .replace('{uid}', uid)
            .replace('{topicId}', topicId)
            .replace('{completed}', completed);
        const response = await api.post(url);
        return { success: true, message: "Progress successfully updated.", data: response.data };
    } catch (error) {
        console.error("Error: ", error);
        return { success: false, message: error.message || "An error occurred" };
    }
};

export const trackTopicView = async(uid, topicId) => {
    try{
        const url = process.env.REACT_APP_SPRINGBOOT_TRACK_TOPIC_VIEW.replace('{uid}', uid).replace('{topicId}', topicId);
        const response = await api.post(url);
        return { success: true, message: `Incremented view for ${topicId}`, data: response.data };

    } catch (error) {
        return { success: false, message: error.message || "An error occurred" };
    }
}

export const trackPracticeView = async(uid, practiceId) => {
    try{
        const url = process.env.REACT_APP_SPRINGBOOT_TRACK_PRACTICE_VIEW.replace('{uid}', uid).replace('{practiceId}', practiceId);
        const response = await api.post(url);
        return { success: true, message: `Incremented view for ${practiceId}`, data: response.data };

    } catch (error) {
        return { success: false, message: error.message || "An error occurred" };
    }
}