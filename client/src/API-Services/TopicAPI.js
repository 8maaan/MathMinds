import axios from "axios";

export const insertTopic = async(newTopic) => {
    try{
        const response = await axios.post(process.env.REACT_APP_SPRINGBOOT_CREATE_TOPIC, newTopic);
        return { success: true, message: 'You have successfully created a topic! 🎉',data: response.data };
    }catch(error) {
        return { success: false, message: "Failed to insert a topic. Try again later." };
    }
}   

export const getTopicById = async(topicId) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_SPRINGBOOT_GET_TOPIC_BY_ID}${topicId}`);
        return { success: true, data: response.data };
    }catch(error) {
        console.error("Error fetching topic by id: ", error);
        return { success: false, message: "Failed to fetch topic. Try again later." };
    }
}

export const updateTopic = async (topicId, updatedTopic) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_SPRINGBOOT_EDIT_TOPIC}${topicId}`, updatedTopic);
        return { success: true, message: 'Topic updated successfully!', data: response.data };
    } catch (error) {
        console.error("Error updating topic: ", error);
        return { success: false, message: "Failed to update topic. Try again later." };
    }
};

export const deleteTopicFromDb = async (topicId) => {
    try {
        console.log(topicId)
        const response = await axios.delete(`${process.env.REACT_APP_SPRINGBOOT_DELETE_TOPIC}${topicId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error deleting topic: ", error.response ? error.response.data : error.message);
        return { success: false, message: "Failed to delete topic", error: error.response ? error.response.data : error.message };
    }
};

export const getAllTopicsFromDb = async () => {
    try {
        const response = await axios.get(process.env.REACT_APP_SPRINGBOOT_GET_TOPICS);
        //console.log(response.data)
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching topics: ", error);
        return { success: false, message: "Failed to fetch topics" };
    }
};