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
export const getAvailableServices = async (serviceCategoryId, selectedLocation) => {
    try {
        const params = {
            serviceCategoryId: serviceCategoryId,
            locationId: selectedLocation
        }

        const response = await axiosInstance.get(`${API_URL}/service/available-services`, { params });
        // return response.data;
        // const response = await axiosInstance.get('/services/available-services');
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        // console.error(error);
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}

// Create new Service Request
export const createServiceRequest = async (formData) => {
    try {
        // console.log('Inside client  createServiceRequest')
        // console.log(`formdata ${formData}`);

        const params = {
            providerId: formData.providerId._id,
            providerServiceId: formData.providerServiceId,
            stateId: formData.locationId.stateId._id,
            locationId: formData.locationId._id,
            address: formData.address,
            amount: formData.amount,
            remarks: formData.remarks
        }
        // console.log(params);

        const response = await axiosInstance.post(`${API_URL}/service/service-request`, { params });
        return { success: response.status, message: response.message?.data?.message, data: response.data };

    } catch (error) {
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}

// getServiceRequestsByUserOrProvider
export const getServiceRequestsByUserOrProvider = async ({userId, providerId}) => {
    const params = {
        userId : userId,  providerId: providerId
    }
    const response = await axiosInstance.get(`${API_URL}/service/service-requests`, { params });
    return { success: response.status, message: response.data.message, data: response.data };
}

// Get all providers
export const getAllProviders = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/providers`);
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}
 
export const getAllProviderServices = async (providerId) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/providers/service/${providerId}`);
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}   

export const createProvider = async (formData) => {
    try {
        const params = {
            name : formData.name, 
            code : formData.code, 
            locationId: formData.locationId, 
            address: formData.address,
            email: formData.email, phone: formData.phone, isActive: formData.isActive, isApproved: formData.isApproved
        } 
        const response = await axiosInstance.post(`${API_URL}/providers`, params);
        // console.log("createProvider response", response);
        // return { success: response.status, message: response.data.message, data: response.data, error: response.data.error };
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error };
    } catch (error) {
        // console.log("createProvider error", error);
        return { success: false, message: error.response?.data?.message || "Error in createProvider", data: error.data, error: error.data?.error };
    }
}

export const updateProvider = async (formData) => {
    try {
        const params = {
            name : formData.name, 
            // code : formData.code, 
            locationId: formData.locationId, 
            address: formData.address,
            // email: formData.email, 
            phone: formData.phone, isActive: formData.isActive, isApproved: formData.isApproved
        } 
        const response = await axiosInstance.patch(`${API_URL}/providers/${formData._id}`, params);       
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error };
    } catch (error) {
        // console.log("updateProvider error", error);
        return { success: false, message: error.response?.data?.message || "Error in updateProvider", data: error.data, error: error.data?.error };
    }
}

export const removeProvider = async (providerId) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/providers/${providerId}`);       
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error };
    } catch (error) {
        // console.log("deleteProvider error", error);
        return { success: false, message: error.response?.data?.message || "Error in deleteProvider", data: error.data, error: error.data?.error };
    }
}