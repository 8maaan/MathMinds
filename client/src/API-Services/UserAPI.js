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
export const getUserProfileInfo = async(uid) =>{
    try{
        const response = await axios.get(`http://localhost:8080/mathminds/user/getUserProfileInfo/${uid}`);
        return{user: response.data, success:true,message:'Successfully fetch User Info.'}
    }catch(error){
        console.error("Error: ", error);
        return {success: false, message: error}
    }
}