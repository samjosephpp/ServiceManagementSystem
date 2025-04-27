import React from "react";
import axiosInstance from "./axiosService";


const API_URL = import.meta.env.VITE_API_URL;

// Admin dashboard data
//1. Get user count
//2. Get provider count
//3. Get request count
//4. Get request count by status
//5. Get request count by type
//6. Get request count by month
//7. Get request count by year
//8. Get request count by provider
export const getAdminDashboardData = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/dashboard/admin`);
        // return response.data;
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        // throw error;
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}

 
// End admin dashboard data

// Provider dashboard data
//1. Get request count by status
//2. Get request count by type
//3. Get request count by month
//4. Get request count by year
//5. Get request count by provider
//6. Get request count by provider and status
//7. Get request count by provider and type 
//8. Get request count by provider and month

export const getProviderDashboardData = async (providerId) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/dashboard/provider/${providerId}`);
        // return response.data;
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        console.error("Error fetching provider dashboard data:", error);
        // throw error;
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}

// End provider dashboard data