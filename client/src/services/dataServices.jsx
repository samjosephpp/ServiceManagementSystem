import React from "react";
import axiosInstance from "./axiosService";


const API_URL = import.meta.env.VITE_API_URL;

export const getAllStates = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/state`);
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        // console.error(error);
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}

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

// Get all locations for Admin purpose
export const getAllLocations = async () => {
    try {   
        const response = await axiosInstance.get(`${API_URL}/location`);
        return { success: response.status, message: response.data.message, data: response.data };
  
    } catch (error) {
        // console.error(error);
        return { success: false, message: error.message?.data?.message || "Error" };
    }
}

// Get all active categories
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
export const getAllServiceCategories = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/serviceCategory`);
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
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
export const getServiceRequestsByUserOrProvider = async ({ userId, providerId }) => {
    const params = {
        userId: userId, providerId: providerId
    }
    const response = await axiosInstance.get(`${API_URL}/service/service-requests`, { params });
    return { success: response.status, message: response.data.message, data: response.data };
}

// get All service Request for any given provider, date, location, status
export const getAllServiceRequests = async ({ providerId, locationId, serviceCategoryId, requestDate }) => {
    // providerId: selectedProvider, locationId: selectedLocation, serviceCategoryId: selectedServiceCategory, requestDate: selectedRequestDate 
    const params = {
        providerId: providerId, locationId: locationId, serviceCategoryId: serviceCategoryId, requestDate: requestDate
    }
    const response = await axiosInstance.get(`${API_URL}/service/all-service-requests`, { params });
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
        // return { success: response.status, message: response.data.message, data: response.data };
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error };
    } catch (error) {
        // return { success: false, message: error.message?.data?.message || "Error" };
        return { success: false, message: error.response?.data?.message || "Error in deleteProvider", data: error.data, error: error.data?.error };

    }
}

export const createProvider = async (formData) => {
    try {
        const params = {
            name: formData.name,
            code: formData.code,
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
            name: formData.name,
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

export const createProviderService = async (formData) => {
    try {
        const params = {
            providerId: formData.providerId,
            serviceCategoryId: formData.serviceCategoryId,
            availabilityDays: formData.availabilityDays,
            availabilityHours: formData.availabilityHours,
            availabilityTime: formData.availabilityTime,
            availabiltyFor: formData.availabiltyFor,
            locationId: formData.locationId,
            isActive: formData.isActive,
            isApproved: formData.isApproved,
            rate: formData.rate
        }
        const response = await axiosInstance.post(`${API_URL}/providers/service`, params);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error };

    } catch (error) {
        console.log("createProviderService error", error);
        return { success: false, message: error.response?.data?.message || "Error in createProviderService", data: error.data, error: error.data?.error };
    }
}

export const updateProviderService = async (formData) => {
    try {
        const params = {
            _id: formData._id,
            providerId: formData.providerId,
            serviceCategoryId: formData.serviceCategoryId,
            availabilityDays: formData.availabilityDays,
            availabilityHours: formData.availabilityHours,
            availabilityTime: formData.availabilityTime,
            availabiltyFor: formData.availabiltyFor,
            locationId: formData.locationId,
            isActive: formData.isActive,
            isApproved: formData.isApproved,
            rate: formData.rate
        }
        const response = await axiosInstance.patch(`${API_URL}/providers/service/${formData._id}`, params);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error };

    } catch (error) {
        console.log("updateProviderService error", error);
        return { success: false, message: error.response?.data?.message || "Error in updateProviderService", data: error.data, error: error.data?.error };
    }
}


export const removeProviderService = async (serviceId) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/providers/service/${serviceId}`);
        // return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error };
        // console.log("removeProviderService response", response);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in removeProviderService", data: error.data, error: error.data?.error };
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/users/users`);
        return { success: response.status, message: response.data.message, data: response.data };
    } catch (error) {
        return { success: false, message: error.message?.data?.message || "Error", data: error.data, error: error.data?.error }
    }
}

export const updateUser = async (userId, formData) => {
    try {
        const params = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            isActive: formData.isActive,
            isApproved: formData.isApproved
        }
        const response = await axiosInstance.patch(`${API_URL}/users/user/${userId}`, params);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in updatedUser", data: error.data, error: error.data?.error }
    }
}
export const removeUser = async (userId) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/users/user/${userId}`);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in removeUser", data: error.data, error: error.data?.error }
    }
}

export const addNewState = async (formData) => {
    try {
        const params = {
            name:  formData.name.trim(),
            code: formData.code || null,
            description: formData.description,
            isActive: formData.isActive
        }
        const response = await axiosInstance.post(`${API_URL}/state`, params);
        // console.log("addState response", response); 
        return { success: response.status, message: response.data?.message ?? response.message, data: response.data, error: response.data.error }
    } catch (error) {
        console.log(error);
        // return { success: false, message: error.response?.data?.message || "Error in addState", data: error.data, error: error.data?.error }
        return { success: false, message: error.response?.data?.message || error.message?.data?.message || error.message || "Error", data: error.data, error: error.data?.error }
    }
}

export const updateState = async (stateId, formData) => {
    try {
        const params = {
            name: formData.name.trim(),
            code: formData.code,
            description: formData.description,
            isActive: formData.isActive
        }
        const response = await axiosInstance.patch(`${API_URL}/state/${stateId}`, params);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in updateState", data: error.data, error: error.data?.error }
    }
}

export const updateStateStatus = async (stateId, formData) => {
    try {
        const params = {
            isActive: formData.isActive
        }
        const response = await axiosInstance.patch(`${API_URL}/state/status/${stateId}`, params);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in updateStateStatus", data: error.data, error: error.data?.error }
    }
}

export const removeState = async (stateId) => { 
    try {
        const response = await axiosInstance.delete(`${API_URL}/state/${stateId}`);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    } catch (error) {
        return { success: false, message: error.message || "Error in removeState", data: error.data, error: error.data?.error }
    }
}

export const addNewLocation = async (formData) => {
    try {
        const params = {
            name: formData.name.trim(),
            code: formData.code,
            stateId: formData.stateId,
            pincode: formData.pincode.trim(),
            isActive: formData.isActive
        }
        const response = await axiosInstance.post(`${API_URL}/location`, params);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in addNewLocation", data: error.data, error: error.data?.error }
    }
}

export const updateLocation = async (locationId, formData) => {
    try {
        const params = {    
            name: formData.name.trim(),    
            code: formData.code,
            pincode: formData.pincode.trim(),
            isActive: formData.isActive,
            stateId: formData.stateId
        }
        const response = await axiosInstance.patch(`${API_URL}/location/${locationId}`, params);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in updateLocation", data: error.data, error: error.data?.error }
    }
}
export const updateLocationStatus = async (locationId, formData) => {
    try {
        const params = {
            isActive: formData.isActive
        }
        const response = await axiosInstance.patch(`${API_URL}/location/status/${locationId}`, params);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in updateLocationStatus", data: error.data, error: error.data?.error }
    }
}

export const removeLocation = async (locationId) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/location/${locationId}`);
        return { success: response.status, message: response.data?.message, data: response.data, error: response.data.error }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error in removeLocation", data: error.data, error: error.data?.error }
    }
}   