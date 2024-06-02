import axios from "axios";

export const updateProgress = async(uid, topicId, completed) => {
    try {
        const url = process.env.REACT_APP_SPRINGBOOT_UPDATE_PROGRESS
            .replace('{uid}', uid)
            .replace('{topicId}', topicId)
            .replace('{completed}', completed);
        const response = await axios.post(url);
        return { success: true, message: "Progress successfully updated.", data: response.data };
    } catch (error) {
        console.error("Error: ", error);
        return { success: false, message: error.message || "An error occurred" };
    }
};