const express = require('express');
const { model } = require('mongoose');

//To fetch available services for a given service category in a specific location
const getAvailableServices = async (serviceCategoryId, locationId) => {
    try {
        const services = await ProviderService.find({
            serviceCategoryId,
            locationId,
            availability: true,
            isActive: true,
            isApproved: true
        })
        .populate({
            path: 'providerId',
            match: { isActive: true, isApproved: true }, // Ensures provider is active and approved
            select: 'name email phone'
        })
        .populate('serviceCategoryId', 'name');

        // Remove services with null provider (due to match filter)
        return services.filter(service => service.providerId);
    } catch (error) {
        console.error("Error fetching available services:", error);
        throw error;
    }
};



module.exports = {
    getAvailableServices
}