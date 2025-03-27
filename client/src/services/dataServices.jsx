import React from "react";
import axiosInstance from "./axiosService";


const API_URL = import.meta.env.VITE_API_URL;

// Get all locations with state
export const getAllLocationsWithState = async () => {
    try {
        // const response = await axiosInstance.get(`/location/getAlllocationsWithState`);
        const response = await axiosInstance.get(`${API_URL}/location/statelocations`);
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        // console.error(error);
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}
// Get all categories
export const getAllActiveServiceCategories = async () => {
    try {
        // const response = await axiosInstance.get(`/serviceCategory/active`);
        const response = await axiosInstance.get(`${API_URL}/serviceCategory/active`);
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        // console.error(error);
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}

/// Get all available services
export const getAvailableServices = async ( serviceCategoryId, selectedLocation) => {
    try {
        const params = {
            serviceCategoryId: serviceCategoryId,
            locationId: selectedLocation
        }
      
        const response = await axiosInstance.get(`${API_URL}/service/available-services`, {params});
        // return response.data;
        // const response = await axiosInstance.get('/services/available-services');
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        // console.error(error);
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}
