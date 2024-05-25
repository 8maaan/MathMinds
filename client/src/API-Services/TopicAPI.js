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

