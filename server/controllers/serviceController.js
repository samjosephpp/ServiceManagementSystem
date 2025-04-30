const express = require('express');
// const { model } = require('mongoose');
const mongoose = require('mongoose'); // Add this line

const { ProviderService } = require('../models/providerModel')
const services = require('../models/serviceModels')
// const { Payment , Feedback } = require('../models/serviceModels');
const { ServiceCategory } = require('../models/masterModels');


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
            // .populate('locationId', 'name') // Populate location name
            .populate({
                path: 'locationId',
                select: 'name stateId', // Populate location name and stateId
                populate: {
                    path: 'stateId', // Populate stateId to get state name
                    select: 'name'
                }
            })
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
        // console.log(req.body);
        // console.log(req.user);

        if (req.user.role_name != "Client") { return res.status(403).json({ message: "Access denied" }) }
        const { providerId, providerServiceId, stateId, locationId, address, amount, remarks } = req.body.params;
        if (!providerId || !providerServiceId || !stateId || !locationId || !address || !amount) {
            return res.status(400).json({ message: "Missing required fields." })
        }
        const newRequest = new services.ServiceRequest({
            clientId: req.user.id,
            providerId: providerId,
            providerServiceId: providerServiceId,
            stateId: stateId,
            locationId: locationId,
            address: address,
            amount: amount,
            remarks: remarks,
            createdBy: req.user.id,
            UpdatedBy: req.user.id
        });
        await newRequest.save();
        res.status(201).json({
            success: true,
            data: newRequest,
            message: "New Request Successfully Saved"
        });

    } catch (error) {
        console.log(error);

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
                UpdatedBy: req.user.id,
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

// to update request status and payment status
const updateRequestStatusAndPayment = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const { status, isPaid } = req.body;
        const updatedRequest = await services.ServiceRequest.findByIdAndUpdate(
            _id,
            {
                status,
                isPaid,
                UpdatedBy: req.user.id,
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
    const { requestId, paymentMethod, cardHolder, cardNumber, cardExpiry, cardccv, referenceNumber, amount, paymentStatus, paymentDate } = req.body;

    if (!requestId || !amount) {
        return res.status(400).json({ message: "Request ID and amount are required" });
    }
    try {
        // Create a new payment
        const newPayment = new services.Payment({
            requestId,
            paymentMethod,
            cardHolder,
            cardNumber,
            cardExpiry,
            cardccv,
            // cardType,
            referenceNumber,
            amount,
            paymentStatus: 'Completed', // Default status
            paymentDate: Date.now(),
            createdBy: req.user.id,
            UpdatedBy: req.user.id
        });

        await newPayment.save();

        if (!newPayment) {
            return res.status(400).json({ message: "Payment not created" });
        }

        // update the service request with paid status
        await services.ServiceRequest.findByIdAndUpdate(requestId, { isPaid: true });
        // Update the service request with the payment ID
        await services.ServiceRequest.findByIdAndUpdate(requestId, { paymentId: newPayment._id });
        // // update the payment status in the service request
        // await services.ServiceRequest.findByIdAndUpdate(requestId, { status: 'Completed' });
        // // await services.ServiceRequest.findByIdAndUpdate(requestId, { isPaid: true });

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
    const { requestId, rating, comment, userId } = req.body;

    const serviceId = requestId;
    // console.log("req.user" , req.user);

    if (!serviceId || !rating) {
        return res.status(422).json({ message: "Service ID and rating are required" });
    }

    try {

        //validate service status
        const serviceRequest = await services.ServiceRequest.findById({ _id: serviceId });
        if (!serviceRequest) {
            return res.status(404).json({ message: "Service Request not found" });
        }
        // if(serviceRequest.status !== 'Declined' || serviceRequest.status !==  'Completed') {
        //     return res.status(400).json({ message: "Service Request in process" });
        // }

        if (serviceRequest.status !== 'Declined' && serviceRequest.status !== 'Completed') {
            return res.status(406).json({ message: "Service Request in process" });
        }

        // Check if the user has already provided feedback for this service request
        const existingFeedback = await services.Feedback.findOne({ userId, requestId });
        if (existingFeedback) {
            return res.status(406).json({ message: "You have already provided feedback for this service request" });
        }

        // Create a new feedback
        const newFeedback = new services.Feedback({
            userId: req.user.id,
            requestId,
            rating,
            comment,
            createdBy: req.user.id,
            UpdatedBy: req.user.id
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


// get all service feedbacks
const getAllFeedbacks = async (req, res, next) => {
    try {
        let { userId = null, requestId = null, providerId = null, serviceCategoryId = null, rating = null } = req.query || {};
        const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
 
        // Clean empty strings from query parameters
        [userId, requestId, providerId, serviceCategoryId, rating] =
            [userId, requestId, providerId, serviceCategoryId, rating].map(val => val === "" ? null : val);

            // console.log("userId", userId);
            // console.log("requestId", requestId);
            // console.log("providerId", providerId);
            // console.log("serviceCategoryId", serviceCategoryId);
            // console.log("rating", rating);

        const query = {};
        if (userId) query.userId = userId;
        if (requestId) query.requestId = requestId;
        if (rating) query.rating = Number(rating);  // Convert rating to number
        // if (providerId) query.providerId = providerId;
        // if (serviceCategoryId) query.serviceCategoryId = serviceCategoryId;

        // first data loading
        let feedbacks = await services.Feedback.find(query)
            .populate({
                path: 'requestId',
                select: 'providerId providerServiceId',
                populate: [
                    {
                        path: 'providerId',
                        model: 'Provider',
                        select: 'name email phone'
                    },
                    {
                        path: 'providerServiceId',
                        model: 'ProviderService',
                        select: 'serviceCategoryId availabilityDays availabilityHours availabilityTime availabilityFor rate',
                        populate: {
                            path: 'serviceCategoryId',
                            model: 'ServiceCategory',
                            select: 'name description'
                        }
                    }
                ]
            })
            .populate({
                path: 'userId',
                select: 'name email phone'
            })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(Number(limit));


            // console.log("feedbacks", feedbacks);
            
        // Need to do post filter since the providerId and serviceCategoryId are not directly related to the requestId
        // Post-filter by providerId and serviceCategoryId if provided
        feedbacks = feedbacks.filter(fb => {
            const req = fb.requestId;
            const providerMatch = providerId ? req?.providerId?._id?.toString() === providerId : true;
            const categoryMatch = serviceCategoryId
                ? req?.providerServiceId?.serviceCategoryId?._id?.toString() === serviceCategoryId
                : true;
            return providerMatch && categoryMatch;
        });

        res.status(200).json({
            success: true,
            data: feedbacks,
            totalCount : feedbacks.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(feedbacks.length / limit),
            message: "All service feedbacks retrieved successfully"
          });

    } catch (error) {
        next(error);
    }
}

const getAllFeedbacks_0 = async (req, res, next) => {
    try {
        let { userId = null, requestId = null, providerId = null, serviceCategoryId = null, rating = null } = req.query || {};
        const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        userId = userId === "" ? null : userId;
        requestId = requestId === "" ? null : requestId;
        providerId = providerId === "" ? null : providerId;
        serviceCategoryId = serviceCategoryId === "" ? null : serviceCategoryId;
        rating = rating === "" ? null : rating;

        const query = {};
        if (userId) {
            query.userId = userId;
        }
        if (requestId) {
            query.requestId = requestId;
        }
        if (providerId) {
            query.providerId = providerId;
        }
        if (serviceCategoryId) {
            query.serviceCategoryId = serviceCategoryId;
        }
        if (rating) {
            query.rating = rating;
        }

        let feedbacks = await services.Feedback.find(query)
            .populate({
                path: 'requestId',
                select: 'providerId',
                populate: {
                    path: 'providerId',
                    model: 'Provider',
                    select: 'name email phone'
                }
            })
            .populate({
                path: 'userId',
                select: 'name email phone'
            })
            .populate({
                path: 'requestId',
                select: 'providerServiceId',
                populate: {
                    path: 'providerServiceId',
                    model: 'ProviderService',
                    select: 'serviceCategoryId availabilityDays , availabilityHours  availabilityTime  availabiltyFor  rate',
                    populate: {
                        path: 'serviceCategoryId', // Populate serviceCategoryId within ProviderService
                        model: 'ServiceCategory', // Explicitly specify the ServiceCategory model
                        select: 'name description' // Select specific fields from ServiceCategory                
                    }
                }
            })
            .sort({ createdAt: -1 })
            .limit(limit).skip(startIndex);

        res.status(200).json({
            success: true,
            data: feedbacks,
            message: "All service feedbacks retrieved successfully"
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
                UpdatedBy: req.user.id,
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
        let { providerId = null, locationId = null, serviceCategoryId = null, requestDate = null } = req.query || {};
        const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const status = req.query.status || null;
        providerId = providerId === "" ? null : providerId;
        locationId = locationId === "" ? null : locationId;
        serviceCategoryId = serviceCategoryId === "" ? null : serviceCategoryId;
        requestDate = requestDate === "" ? null : requestDate;

        // console.log("req.query", req.query);

        const query = {}; // clientId: { $ne: null }

        if (providerId) {
            query.providerId = providerId;
        }

        if (requestDate) {
            const startDate = new Date(requestDate);
            const endDate = new Date(requestDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        // if (status) {
        //     query.status = status;
        // }
        if (locationId) {
            query.locationId = locationId;
        }

        // console.log("query", query);

        let serviceRequests = await services.ServiceRequest.find(query)
            .populate('providerServiceId', ' availabilityDays , availabilityHours  availabilityTime  availabiltyFor  rate')
            // .populate('clientId', 'name email')             
            .populate('providerId', 'name email')
            .populate('stateId', 'name')
            .populate('locationId', 'name')
            .populate({
                path: 'requestId', // Linking field in Payment schema   
                model: 'Payment', // Explicitly specify the Payment model
                select: 'amount cardType cardHolder paymentStatus paymentDate' // Select specific fields               
            })
            .populate({
                path: 'providerServiceId', // Linking field in Payment schema   
                model: 'ProviderService', // Explicitly specify the Payment model               
                select: 'serviceCategoryId availabilityDays , availabilityHours  availabilityTime  availabiltyFor  rate', // Select specific fields
                populate: {
                    path: 'serviceCategoryId', // Populate serviceCategoryId within ProviderService
                    model: 'ServiceCategory', // Explicitly specify the ServiceCategory model
                    select: 'name description' // Select specific fields from ServiceCategory                
                }
            })
            .populate({
                path: 'requestId', // Linking field in Payment schema   
                model: 'Payment', // Explicitly specify the Payment model
                select: 'amount cardType cardHolder paymentStatus paymentDate' // Select specific fields
            })
            // .populate({
            //     path: 'createdBy', 
            //     model: 'User',  
            //     select: 'name email phone',
            //     populate: {
            //         path: 'clientId',  
            //         model: 'Client', 
            //         select: 'name email phone'  
            //     }
            //  })
            .populate({
                path: 'createdBy',
                select: 'clientId',
                populate: {
                    path: 'clientId',
                    model: 'Client',
                    select: 'name email phone'
                }
            })

            .sort({ createdAt: -1 })
            .limit(limit).skip(startIndex);

        // filter for service category
        if (serviceRequests.length > 0 && serviceCategoryId) {
            // console.log("serviceCategoryId", serviceCategoryId);           
            // console.log("inside if");
            const filteredserviceRequests = serviceRequests.filter(service => service.providerServiceId.serviceCategoryId._id == serviceCategoryId);
            // console.log("filteredserviceRequests", filteredserviceRequests);
            serviceRequests = filteredserviceRequests;

        }

        serviceRequests = serviceRequests.map((req) => {
            const plain = req.toObject();
            return {
                ...plain,
                clientInfo: plain.createdBy?.clientId || null, // Rename nested populated field
            };
        });

        res.status(200).json({
            success: true,
            data: serviceRequests,
            message: "All service requests retrieved successfully"
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// To get all service requests for a given user or provider
const getServiceRequestsByUserOrProvider = async (req, res, next) => {

    const { userId, providerId } = req.query;
    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (!userId && !providerId) {
        return res.status(400).json({ success: false, message: "User ID or Provider ID is required" });
    }

    try {
        const query = {};
        if (userId) {
            query.clientId = userId;
        }
        if (providerId) {
            query.providerId = providerId;
        }


        // const serviceRequests = await services.ServiceRequest.find(query)
        //     .populate('clientId', 'name email')
        //     .populate('providerId', 'name email')
        //     .populate('providerServiceId', 'name')
        //     .populate('stateId', 'name')
        //     .populate('locationId', 'name')
        //     .populate({
        //         path: 'requestId', // Linking field in Payment schema
        //         model: 'Payment', // Explicitly specify the Payment model
        //         select: 'amount cardType cardHolder paymentStatus paymentDate' // Select specific fields
        //     })
        //     .sort({ createdAt: -1 })
        //     .limit(limit).skip(startIndex);

        // if (userId) {
        //     query.clientId = mongoose.Types.ObjectId(userId);
        // }
        // if (providerId) {
        //     query.providerId = mongoose.Types.ObjectId(providerId);
        // }
        // console.log(query)
        const serviceRequests0 = await services.ServiceRequest.find(query)
            .populate('providerServiceId', ' availabilityDays , availabilityHours  availabilityTime  availabiltyFor  rate')
            .populate('clientId', 'name email')
            .populate('providerId', 'name email')
            .populate('stateId', 'name')
            .populate('locationId', 'name')
            .populate({
                path: 'requestId', // Linking field in Payment schema   
                model: 'Payment', // Explicitly specify the Payment model
                select: 'amount cardType cardHolder paymentStatus paymentDate' // Select specific fields
            })
            .sort({ createdAt: -1 })
            .limit(limit).skip(startIndex);

        //get service catetory details in the   providerServiceId in serviceRequest


        const serviceRequests = await services.ServiceRequest.find(query)
            .populate('providerServiceId', ' availabilityDays , availabilityHours  availabilityTime  availabiltyFor  rate')
            .populate('clientId', 'name email')
            .populate('providerId', 'name email')
            .populate('stateId', 'name')
            .populate('locationId', 'name')
            .populate({
                path: 'requestId', // Linking field in Payment schema   
                model: 'Payment', // Explicitly specify the Payment model
                select: 'amount cardType cardHolder paymentStatus paymentDate' // Select specific fields               
            })
            .populate({
                path: 'providerServiceId', // Linking field in Payment schema   
                model: 'ProviderService', // Explicitly specify the Payment model               
                select: 'serviceCategoryId availabilityDays , availabilityHours  availabilityTime  availabiltyFor  rate', // Select specific fields
                populate: {
                    path: 'serviceCategoryId', // Populate serviceCategoryId within ProviderService
                    model: 'ServiceCategory', // Explicitly specify the ServiceCategory model
                    select: 'name description' // Select specific fields from ServiceCategory
                }
            })
            .populate({
                path: 'requestId', // Linking field in Payment schema   
                model: 'Payment', // Explicitly specify the Payment model
                select: 'amount cardType cardHolder paymentStatus paymentDate' // Select specific fields
            })
            .sort({ createdAt: -1 })
            .limit(limit).skip(startIndex);

        // console.log("serviceRequestsWithCategory", serviceRequestsWithCategory);


        // const serviceRequests = await services.ServiceRequest.aggregate([
        //     { $match: query }, // Match userId or providerId
        //     {
        //         $lookup: {
        //             from: 'payments', // Collection name for Payment
        //             localField: '_id', // Field in ServiceRequest
        //             foreignField: 'requestId', // Field in Payment
        //             as: 'paymentDetails' // Alias for the joined data
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'clients', // Collection name for Client
        //             localField: 'clientId',
        //             foreignField: '_id',
        //             as: 'clientDetails'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'providers', // Collection name for Provider
        //             localField: 'providerId',
        //             foreignField: '_id',
        //             as: 'providerDetails'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'providerservices', // Collection name for ProviderService
        //             localField: 'providerServiceId',
        //             foreignField: '_id',
        //             as: 'providerServiceDetails'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'states', // Collection name for State
        //             localField: 'stateId',
        //             foreignField: '_id',
        //             as: 'stateDetails'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'locations', // Collection name for Location
        //             localField: 'locationId',
        //             foreignField: '_id',
        //             as: 'locationDetails'
        //         }
        //     },
        //     { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
        //     { $skip: startIndex }, // Skip for pagination
        //     { $limit: parseInt(limit) } // Limit for pagination
        // ]);

        // if (!serviceRequests || serviceRequests.length === 0) {
        //     return res.status(200).json({ success: true, data: [], message: "No service requests found" });
        // }

        res.status(200).json({ success: true, data: serviceRequests, message: "Service requests retrieved successfully" });
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
    updateRequestStatusAndPayment,
    getAllRequest,
    getServiceRequestsByUserOrProvider,
    getAllFeedbacks
}