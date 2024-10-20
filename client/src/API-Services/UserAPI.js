import api from "./axiosConfig";

export const createUserToDb = async(user) => {
    try{
        await api.post(process.env.REACT_APP_SPRINGBOOT_CREATE_USER, user);
        return { success: true, message: "Happy solving!"};
    } catch (error) {
        console.error("Error: ", error);
        return {success: false, message: error}
    }
}


//GET USER PROFILE INFO
export const getUserProfileInfoFromDb = async (uid) => {
    try {
        const response = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_USER_PROFILE_INFO}?uid=${uid}`);
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
        const response = await api.put(`${process.env.REACT_APP_SPRINGBOOT_UPDATE_USER_PROFILE}?uid=${uid}`, updatedProfileInfo);
        return { success: true, message: "User profile updated successfully", data: response.data };
    } catch (error) {
        console.error("Error updating user profile info: ", error);
        return { success: false, message: "Failed to update user profile info" };
    }
};


//GET ALL USERS
export const getAllUsersFromDb = async () => {
    try {
        const response = await api.get(process.env.REACT_APP_SPRINGBOOT_GET_USERS);
        //console.log(response.data)
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching users: ", error);
        return { success: false, message: "Failed to fetch users" };
    }
};

//GET ALL USERS FOR ADMIN
export const getAllUsersForAdmin = async () => {
    try {
        const response = await api.get(process.env.REACT_APP_SPRINGBOOT_GET_USERS_FOR_ADMIN);
        //console.log(response.data)
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching users: ", error);
        return { success: false, message: "Failed to fetch users" };
    }
};

//GET USER'S LESSON PROGRESS
export const getProgressForAllLessonsFromDb = async (uid) => {
    try {
        // Send a GET request to fetch lesson progress data for a user
        const response = await api.get(process.env.REACT_APP_SPRINGBOOT_GET_ALL_LESSON_PROGRESS.replace("{uid}", uid));
        return { success: true, data: response.data };
    } catch (error) {
        // Handle errors
        console.error("Error fetching lesson progress data for user: ", error);
        return { success: false, message: "Failed to fetch lesson progress data for user" };
    }
};


//GET USER'S BADGES
export const getBadgesForUser = async (uid) => {
    try {
        const response = await api.get(
            process.env.REACT_APP_SPRINGBOOT_GET_USER_BADGES.replace("{uid}", uid)
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching badges data for user: ", error);
        return { success: false, message: "Failed to fetch badges data for user" };
    }
};

// CHECK IF USER HAS EARNED A BADGE
export const checkUserBadge = async (uid, lessonId) => {
    try {
      const response = await api.get(process.env.REACT_APP_SPRINGBOOT_CHECK_USER_BADGE.replace("{uid}", uid).replace("{lessonId}", lessonId));
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error checking user badge:", error);
      return { success: false, message: "Failed to check user badge" };
    }
  };
  
  // AWARD BADGE TO USER
  export const awardBadge = async (uid, lessonId) => {
    try {
      const response = await api.put(process.env.REACT_APP_SPRINGBOOT_AWARD_BADGE.replace("{uid}", uid).replace("{lessonId}", lessonId));
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error awarding badge:", error);
      return { success: false, message: "Failed to award badge" };
    }
  };

  export const changeUserRole = async (uid, newRole) => {
    try {
        const response = await api.put(process.env.REACT_APP_SPRINGBOOT_CHANGE_USER_ROLE.replace("{uid}", uid).replace("{newRole}", newRole));
        return response;
    } catch (error) {
        console.error('Error changing user role:', error);
        throw error;
    }
};