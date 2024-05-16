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
        const response = await axios.get(`${process.env.REACT_APP_SPRINGBOOT_GET_USER_PROFILE_INFO}?uid=${uid}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching user profile info: ", error);
        return { success: false, message: "Failed to fetch user profile info" };
    }
};

//UPDATE USER PROFILE INFO
export const updateUserProfileInfoToDb = async (uid, updatedProfileInfo) => {
    try {
        // Send a PUT request to update the user's profile information
        const response = await axios.put(`${process.env.REACT_APP_SPRINGBOOT_UPDATE_USER_PROFILE}?uid=${uid}`, updatedProfileInfo);
        return { success: true, message: "User profile updated successfully" };
    } catch (error) {
        console.error("Error updating user profile info: ", error);
        return { success: false, message: "Failed to update user profile info" };
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