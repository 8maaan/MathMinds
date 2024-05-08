import axios from "axios";

export const createUserToDb = async(user) => {
    try{
        await axios.post(process.env.REACT_APP_SPRINGBOOT_CREATE_USER, user);
        return { success: true, message: "Happy solving!"};
    } catch (error) {
        console.error("Error: ", error);
        return {success: false, message: error}
    }
}


//GET USER PROFILE INFO
export const getUserProfileInfo = async (uid) => {
    try {
        const response = await axios.get(process.env.REACT_APP_SPRINGBOOT_GET_USER_PROFILE_INFO,uid );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error", error);
        return { success: false, message: error};
    }
};