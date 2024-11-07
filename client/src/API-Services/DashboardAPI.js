import api from "./axiosConfig";

export const getBasicCountAnalytics = async (uid) =>{
    try{
        const response = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_BASIC_COUNT_ANALYTICS}${uid}`);
        //console.log(response.data)
        return { success: true, data: response.data };

    }catch(e){
        console.error("Error fetching data: ", e);
        return { success: false, message: "Failed to fetch dashboard data" };
    }
}

export const getOverviewDashboardContent = async (uid) =>{
    try{
        const response = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_OVERVIEW_CONTENT_ANALYTICS}${uid}`);
        //console.log(response.data)
        return { success: true, data: response.data };

    }catch(e){
        console.error("Error fetching overview dashboard data: ", e);
        return { success: false, message: "Failed to fetch overview dashboard data" };
    }
}

export const getLessonDashboardContent = async (uid) =>{
    try{
        const response = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_LESSON_CONTENT_ANALYTICS}${uid}`);
        //console.log(response.data)
        return { success: true, data: response.data };

    }catch(e){
        console.error("Error fetching lessons dashboard data: ", e);
        return { success: false, message: "Failed to fetch lesson dashboard data" };
    }
}

export const getTopicDashboardContent = async (uid) =>{
    try{
        const response = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_TOPIC_CONTENT_ANALYTICS}${uid}`);
        //console.log(response.data)
        return { success: true, data: response.data };

    }catch(e){
        console.error("Error fetching topic dashboard data: ", e);
        return { success: false, message: "Failed to fetch topic dashboard data" };
    }
}

export const getStudentDashboardOverview = async (uid) => {
    try{
        const response = await api.get(`${process.env.REACT_APP_SPRINGBOOT_GET_STUDENTDASHBOARD_OVERVIEW}${uid}`);
        //console.log(response.data)
        return { success: true, data: response.data };

    }catch(e){
        console.error("Error fetching student dashboard overview data: ", e);
        return { success: false, message: "Failed to fetch student dashboard overview data" };
    }
}