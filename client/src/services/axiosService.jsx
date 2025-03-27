import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance     //REACT_APP_SERVER_BASE_URL
const axiosInstance =  axios.create({
    // baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    baseURL: API_URL,
});

// Helper function to refresh the token
const refreshAuthToken = async () => {
    try {
        const response = await axios.post('/refresh-token', {
            token: localStorage.getItem('refreshToken'),
        });
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return accessToken;
    } catch (error) {
        throw new Error('Unable to refresh token');
    }
};

// Request interceptor to add the authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiry
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // Check if error is due to token expiry and if it's not already retried
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAuthToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Handle refresh token error, e.g., redirect to login page
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
