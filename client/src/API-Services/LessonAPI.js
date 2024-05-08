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