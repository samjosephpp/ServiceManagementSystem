import axios from 'axios';
import { data } from 'react-router-dom';

import axiosInstance from './axiosService';
 
const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (credentials) => {
    try {       
         
        const response = await axiosInstance.post(`${API_URL}/users/login`, credentials, { withCredentials: true });
        return { success: response.data.success || false, message: response.data.message, token: response.data.token, refreshToken: response.data.refreshToken, role: response.data.role, data: response.data.data };

    } catch (error) {
        console.error(error);
        throw error.response?.data?.message || 'Error logging in';
    }
}

export const registerUser = async (userData) => {
    try {
        // const response = await axios.post(`${API_URL}/users/register`, userData);
         // return response.data;
        const response = await axiosInstance.post(`${API_URL}/users/register`, userData, { withCredentials: true })
        return {
            success: true, message: response.data.message, token: response.token, refreshToken: response.refreshToken,
            data: response.data
        };
       
    } catch (error) {
        console.error(error);
        // console.log(error.response?.data?.message);
        // throw error.response?.data?.message || 'Error registering user';
        return { success: false, message: error.response?.data?.message || "Error registering user" };
    }
}