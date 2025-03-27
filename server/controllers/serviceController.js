const express = require('express');
// const { model } = require('mongoose');
const mongoose = require('mongoose'); // Add this line

const { ProviderService } = require('../models/providerModel')
const services = require('../models/serviceModels')
const { Payment } = require('../models/serviceModels');


// To get all available services for a given service category in a specific location
const getAvailableServices = async (req, res, next) => {
    try {
        // const { serviceCategoryId, locationId } = req.body; // Get query parameters from request or from body
     
        const serviceCategoryId = req.body.serviceCategoryId || req.query.serviceCategoryId;
        const locationId = req.body.locationId || req.query.locationId;

        // console.log("serviceCategoryId", serviceCategoryId, "locationId", locationId);
        // console.log("req.query", req.query);


        const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
        // console.log("page", page, "limit", limit);
        // find the starting and ending indices
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Build the query object
        const query = {
            isActive: true,
            isApproved: true
        };

        if (serviceCategoryId) {
            // // query.serviceCategoryId = new mongoose.Types.ObjectId(serviceCategoryId);
            // query.serviceCategoryId = mongoose.Types.ObjectId.isValid(serviceCategoryId)
            // ? new mongoose.Types.ObjectId(serviceCategoryId)
            // : serviceCategoryId; // Use as-is if it's already valid
            query.serviceCategoryId = serviceCategoryId;
        }

        if (locationId) {
            // // query.locationId = new mongoose.Types.ObjectId(locationId)
            // query.locationId = mongoose.Types.ObjectId.isValid(locationId)
            // ? new mongoose.Types.ObjectId(locationId)
            // : locationId; // Use as-is if it's already valid
            query.locationId = locationId;
        }
        // console.log("query", query); 
        
        const services = await ProviderService.find(query, 'availabilityDays availabilityHours availabilityTime availabiltyFor rate description') // Select specific fields
            .populate({ path: 'providerId', match: { isActive: true, isApproved: true }, select: 'name email phone' })
            .populate('serviceCategoryId', 'name')  // Populate service category name
            .populate('locationId', 'name') // Populate location name
            .limit(limit).skip(startIndex); // Limit and skip results   

        // Remove services with null provider (due to match filter)
        const filteredServices = services.filter(service => service.providerId);
       
        // console.log("filteredServices", filteredServices);
        
        return res.status(200).json({ data: filteredServices, message: "Available services retrieved successfully" });

        // return services.filter(service => service.providerId);

    } catch (error) {
        console.error("Error fetching available services:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching available services"
        });
    }

}

//To fetch available services for a given service category in a specific location
const getAvailableServices0 = async (serviceCategoryId, locationId) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
        // find the starting and ending indices
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

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
            .populate('serviceCategoryId', 'name')
            .limit(limit).skip(startIndex);

        // Remove services with null provider (due to match filter)
        return services.filter(service => service.providerId);
    } catch (error) {
        console.error("Error fetching available services:", error);
        throw error;
    }
};

//create a new request
const createRequest = async (req, res, next) => {
    try {
        if (req.user.role != "Client") { return res.status(403).json({ message: "Access denied" }) }
        const { providerId, providerServiceId, stateId, locationId, address, amount, remarks } = req.body;
        if (!providerId || !providerServiceId || !stateId || !locationId || !address || !amount) {
            return res.status(400).json({ message: "Missing required fields." })
        }

        const newRequest = new services.ServiceRequest({
            clientId: req.user._id,
            providerId: providerId,
            providerServiceId: providerServiceId,
            stateId: stateId,
            locationId: locationId,
            address: address,
            amount: amount,
            remarks: remarks,
            createdBy: req.user._id,
            UpdatedBy: req.user._id
        });
        await newRequest.save();
        res.status(201).json({
            success: true,
            data: newRequest,
            message: "New Request Successfully Saved"
        });

    } catch (error) {
        next(error);
    }

}
//to view a request
const viewRequestById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const singleRequest = await services.ServiceRequest.findById(_id)
            .populate('providerId', 'name')
            .populate('stateId', 'name')
            .populate('locationId', 'name');

        if (!singleRequest) {
            return res.status(400).json({ message: `Service Request with ${id} not found` });
        }
        res.status(201).json({
            success: true,
            data: singleRequest,
            message: "Service Request Found Successfully"
        });


    } catch (error) {
        next(error)
    }
}

//to update a request
const updateRequest = async (req, res, next) => {
    const _id = req.params.id;
    const { providerId, providerServiceId, stateId, locationId, address, amount, remarks, status, isPaid } = req.body;

    if (!providerId || !providerServiceId || !stateId || !locationId || !address || !amount) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const updatedRequest = await services.ServiceRequest.findByIdAndUpdate(
            _id,
            {
                providerId,
                providerServiceId,
                stateId,
                locationId,
                address,
                amount,
                remarks,
                status,
                isPaid,
                UpdatedBy: req.user._id,
                updatedAt: Date.now()
            },
            { new: true } // Return the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: `Service Request with id ${_id} not found` });
        }

        res.status(200).json({
            success: true,
            data: updatedRequest,
            message: "Service Request Updated Successfully"
        });
    } catch (error) {
        next(error);
    }
}

//for request payment
const servicePayment = async (req, res, next) => {
    const { requestId, amount } = req.body;

    if (!requestId || !amount) {
        return res.status(400).json({ message: "Request ID and amount are required" });
    }
    try {
        // Create a new payment
        const newPayment = new Payment({
            requestId,
            amount,
            paymentStatus: 'Completed', // Default status
            paymentDate: Date.now(),
            createdBy: req.user._id,
            UpdatedBy: req.user._id
        });

        await newPayment.save();

        res.status(201).json({
            success: true,
            data: newPayment,
            message: "Payment created successfully"
        });
    } catch (error) {
        next(error);
    }
}

//for request feedback
const serviceFeedback = async (req, res, next) => {
    const { serviceId, rating, comment } = req.body;

    if (!serviceId || !rating) {
        return res.status(400).json({ message: "Service ID and rating are required" });
    }

    try {

        //validate service status
        const serviceRequest = await services.ServiceRequest.findById({ id: serviceId });
        if (!serviceRequest) {
            return res.status(400).json({ message: "Service Request not found" });
        }
        // if(serviceRequest.status !== 'Declined' || serviceRequest.status !==  'Completed') {
        //     return res.status(400).json({ message: "Service Request in process" });
        // }

        if (serviceRequest.status !== 'Declined' && serviceRequest.status !== 'Completed') {
            return res.status(400).json({ message: "Service Request in process" });
        }

        // Create a new feedback
        const newFeedback = new services.Feedback({
            userId: req.user._id,
            serviceId,
            rating,
            comment,
            createdBy: req.user._id,
            UpdatedBy: req.user._id
        });

        await newFeedback.save();

        res.status(201).json({
            success: true,
            data: newFeedback,
            message: "Feedback created successfully"
        });
    } catch (error) {
        next(error);
    }
}


//to update request status
const updateRequestStatus = async (req, res, next) => {
    const _id = req.params.id;
    const { status, log } = req.body;
    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }
    try {
        const updatedRequest = await services.ServiceRequest.findByIdAndUpdate(
            _id,
            {
                status,
                UpdatedBy: req.user._id,
                updatedAt: Date.now()
            },
            { new: true } // Return the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: `Service Request with id ${_id} not found` });
        }

        const newServicelog = new services.ServiceLog({
            requestId: _id,
            log: log,
            status: status
        })
        await newServicelog.save();

        res.status(200).json({
            success: true,
            data: updatedRequest,
            message: "Service Request Status Updated Successfully"
        });
    } catch (error) {
        next(error);
    }

}

// Get All serviceRequest
const getAllRequest = async (req, res, next) => {
    try {
        const serviceRequests = await services.ServiceRequest.find()
            .populate('clientId', 'name email')
            .populate('providerId', 'name email')
            .populate('providerServiceId', 'name')
            .populate('stateId', 'name')
            .populate('locationId', 'name');

        res.status(200).json({
            success: true,
            data: serviceRequests,
            message: "All service requests retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
}

// To get all service requests for a given user or provider
const getServiceRequestsByUserOrProvider = async (req, res, next) => {
    const { userId, providerId } = req.query;

    if (!userId && !providerId) {
        return res.status(400).json({ message: "User ID or Provider ID is required" });
    }

    try {
        const query = {};
        if (userId) {
            query.clientId = userId;
        }
        if (providerId) {
            query.providerId = providerId;
        }

        const serviceRequests = await ServiceRequest.find(query)
            .populate('clientId', 'name email')
            .populate('providerId', 'name email')
            .populate('providerServiceId', 'name')
            .populate('stateId', 'name')
            .populate('locationId', 'name');

        res.status(200).json({ data: serviceRequests, message: "Service requests retrieved successfully" });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    getAvailableServices,
    createRequest,
    viewRequestById,
    updateRequest,
    servicePayment,
    serviceFeedback,
    updateRequestStatus,
    getAllRequest,
    getServiceRequestsByUserOrProvider
}