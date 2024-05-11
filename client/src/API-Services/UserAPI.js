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
export const getUserProfileInfoFromDb = async (uid) => {
    try {
        const response = await axios.get(process.env.REACT_APP_SPRINGBOOT_GET_USER_PROFILE_INFO.replace("${uid}", uid));
        console.log("User profile info API response:", response.data); // Log the response data
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching user profile info: ", error);
        return { success: false, message: "Failed to fetch user profile info" };
    }
};

//GET ALL USERS
export const getAllUsersFromDb = async () => {
    try {
        const response = await axios.get(process.env.REACT_APP_SPRINGBOOT_GET_USERS);
        //console.log(response.data)
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching users: ", error);
        return { success: false, message: "Failed to fetch users" };
    }
};