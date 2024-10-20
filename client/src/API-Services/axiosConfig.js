import axios from 'axios';
import { auth } from '../Firebase/firebaseConfig';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_SPRINGBOOT_BASE_URL // Your base URL
});

// Add a request interceptor
api.interceptors.request.use(
    async (config) => {
        try {
            if (auth.currentUser) {
                const token = await auth.currentUser.getIdToken(true);
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;