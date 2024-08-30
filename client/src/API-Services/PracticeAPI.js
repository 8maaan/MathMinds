import axios from "axios";

export const getAllPractices = async () => {
  try {
    const response = await axios.get(process.env.REACT_APP_SPRINGBOOT_GET_PRACTICES);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching practices: ", error);
    return { success: false, message: "Failed to fetch practices" };
  }
};

export const getPracticeById = async (practiceId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SPRINGBOOT_GET_PRACTICE_BY_ID}/${practiceId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching practice by id: ", error);
    return { success: false, message: "Failed to fetch practice. Try again later." };
  }
};

export const insertPracticeToDb = async (newPracticeData) => {
  try {
    const response = await axios.post(process.env.REACT_APP_SPRINGBOOT_INSERT_PRACTICE, newPracticeData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error inserting practice: ", error.response ? error.response.data : error.message);
    return { success: false, message: "Failed to create a practice", error: error.response ? error.response.data : error.message };
  }
};

export const deletePracticeFromDb = async (practiceId) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_SPRINGBOOT_DELETE_PRACTICE}/${practiceId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting practice: ", error.response ? error.response.data : error.message);
    return { success: false, message: "Failed to delete practice", error: error.response ? error.response.data : error.message };
  }
};

export const updatePracticeInDb = async (practiceId, updatedPracticeData) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_SPRINGBOOT_EDIT_PRACTICE}/${practiceId}`, updatedPracticeData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating practice: ", error.response ? error.response.data : error.message);
    return { success: false, message: "Failed to update practice", error: error.response ? error.response.data : error.message };
  }
};

export const getPracticeByTopicId = async (topicId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SPRINGBOOT_GET_PRACTICE_QA_BY_TOPICID}${topicId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching practice by topic id: ", error);
    return { success: false, message: "Failed to fetch practice by topic id. Try again later." };
  }
};

export const getRandomizedPracticeByTopicId = async (topicId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SPRINGBOOT_GET_RANDOMIZED_PRACTICE_QA_BY_TOPICID}${topicId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching practice by topic id: ", error);
    return { success: false, message: "Failed to fetch practice by topic id. Try again later." };
  }
}

export const getPracticeQuestionsByPracticeId = async (practiceId) => {
  try {
      const baseUrl = "http://localhost:8080/mathminds/practice/";
      const response = await axios.get(`${baseUrl}${practiceId}/questions`);
      return { success: true, data: response.data };
  } catch (error) {
      console.error("Error fetching practice questions:", error);
      return { success: false, error: error.response };
  }
};



export const getQuestionsByPracticeAndTopicId = async (topicId, practiceId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SPRINGBOOT_BASE_URL}/practice/${practiceId}/questions`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching questions by practice and topic id: ", error);
    return { success: false, message: "Failed to fetch questions. Try again later." };
  }
};

