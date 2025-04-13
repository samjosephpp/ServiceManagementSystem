const express = require('express');
const { model } = require('mongoose');
const { Provider, ProviderService } = require('../models/providerModel'); // Import the provider model
const { ServiceRequest } = require('../models/serviceModels');
const { Location } = require('../models/masterModels');

// Create a new provider
const createProvider = async (req, res, next) => {
    try {
        if (req.user.role_name != "Admin") { return res.status(403).json({ message: "Access denied" }) }
        // console.log("req.user", req.user);
        const { name, code, locationId, address, email, phone, isActive, isApproved } = req.body;
        let stateId = req.body.stateId || null;

        if (!stateId || stateId === null) {
            // console.log("stateId", stateId);
            try {
                const location = await Location.findOne({ _id: locationId });
                if (location) {
                    stateId = location.stateId;
                }
                // console.log("locationId", location);  
            } catch (error) {
                console.log(error)
            }
        }

        // console.log(req.body);

        if (!name || !stateId || !locationId || !address || !email || !phone) {
            return res.status(422).json({ message: "Missing required fields.", success: false })
        }

        const isProviderExists = await Provider.findOne({ email: email });
        if (isProviderExists) {
            return res.status(406).json({ message: "Provider already exists.", success: false })
        }
        let provider = new Provider({
            name, code, stateId, locationId, address, email, phone, isActive, isApproved,
            createdBy: req.user.id,
            UpdatedBy: req.user.id
        });
        await provider.save();

        await provider.populate('stateId', 'name')
        await provider.populate('locationId', 'name');

        // let result = await provider.save();
        //  await result.populate('stateId', 'name')
        //  await result.populate('locationId', 'name'); 
        // console.log("result", result);
        // console.log("provider", provider);

        res.status(201).json({
            success: true,
            data: provider,
            message: "New Provider Successfully created"
        });

    } catch (error) {

        console.log("Error in createProvider ", error);
        next(error);
    }
}

// Update a provider by ID
const updateProvider = async (req, res, next) => {
    try {
        if (req.user.role_name != "Admin") { return res.status(403).json({ message: "Access denied" }) }
        const { name, code, locationId, address, phone, isActive, isApproved } = req.body;

        let stateId = req.body.stateId || null;
        if (!stateId || stateId === null) {
            try {
                const location = await Location.findOne({ _id: locationId });
                if (location) {
                    stateId = location.stateId;
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (!name || !stateId || !locationId || !address || !phone) {
            return res.status(422).json({ message: "Missing required fields." })
        }

        const provider = await Provider.findByIdAndUpdate(req.params.id,
            {
                name, stateId, locationId, address, phone, isActive, isApproved,
                UpdatedBy: req.user._id, updatedAt: Date.now()
            }
            , { new: true, runValidators: true });
        if (!provider) {
            return res.status(404).json({ message: "Provider not exists.", success: false })
        }

        await provider.populate('stateId', 'name')
        await provider.populate('locationId', 'name');

        res.status(200).json({
            success: true,
            data: provider,
            message: "Provider Updated Successfully"
        });
    } catch (error) {
        // res.status(400).send(error);
        next(error);
    }
}


const deleteProvider = async (req, res, next) => {
    try {

        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: "Provider does not exist." });
        }
        // console.log("provider", provider);
        // const provider = await Provider.findByIdAndDelete(req.params.id);
        // if (!provider) {
        //     return res.status(404).json({ message: "Provider not exists." })
        // }

        // check any service Request exists for this provider
        const serviceRequests = await ServiceRequest.find({ providerId: provider._id });
        if (serviceRequests.length > 0) {
            return res.status(406).json({ message: "Provider has service requests. Can't delete." })
        }

        //check any services exists for this provider
        const providerServices = await ProviderService.find({ providerId: provider._id });
        if (providerServices.length > 0) {
            return res.status(406).json({ message: "Provider has services. Can't delete." })
        }


        // Delete the provider
        await Provider.findByIdAndDelete(req.params.id);

        // console.log("Deleted provider", provider);


        res.status(200).json({
            success: true,
            data: provider,
            message: "Provider delete Successfully"
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

// Get a provider by ID
const getProviderById = async (req, res, next) => {
    try {
        const provider = await Provider.findById(req.params.id)
            .populate('stateId', 'name')
            .populate('locationId', 'name');
        if (!provider) {
            return res.status(404).json({ message: "Provider not exists." })
        }
        res.status(200).json({
            success: true,
            data: provider,
            message: "Provider Found Successfully"
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

// Get all providers
const getAllProviders = async (req, res, next) => {
    try {
        const providers = await Provider.find({})
            .populate('stateId', 'name')
            .populate('locationId', 'name');

        res.status(200).json({
            success: true,
            data: providers,
            message: "Providers Found Successfully"
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

// To add services for a provider
const addProviderService = async (req, res, next) => {
    try {
        const { providerId, serviceCategoryId, availabilityDays, availabilityHours, availabilityTime, availabiltyFor, rate, locationId, isActive, isApproved } = req.body;

        // console.log(req.body);

        if (!providerId || !serviceCategoryId || !rate) {
            return res.status(422).json({ message: "Missing required fields.", success: false })
        }
        const provider = await Provider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: "Provider not exists.", success: false })
        }
        // Check if the service already exists for the provider
        const existingService = await ProviderService.findOne({ providerId, serviceCategoryId });
        if (existingService) {
            return res.status(406).json({ message: "Service already exists for this provider.", success: false });
        }

        const providerService = new ProviderService({
            providerId, serviceCategoryId, availabilityDays, availabilityHours, availabilityTime, availabiltyFor, rate,
            locationId, isActive, isApproved,
            createdBy: req.user.id,
            updatedBy: req.user.id
        });

        await providerService.save();

        await providerService.populate('providerId', 'name');
        await providerService.populate('serviceCategoryId', 'name');
        await providerService.populate({
            path: 'locationId',
            select: 'name stateId',
            populate: {
                path: 'stateId',
                select: 'name'
            }
        });


        // provider.services.push(service);
        // await provider.save();

        res.status(200).json({
            success: true,
            data: providerService,
            message: "Service Added Successfully"
        });
    } catch (error) {
        console.log("Error in addProviderService ", error);
        next(error)
        // res.status(500).send(error);
    }

}

// To update services for a provider
const updateProviderService = async (req, res, next) => {
    const id = req.params.id;
    try {
        const { providerId, serviceCategoryId, availabilityDays, availabilityHours, availabilityTime, availabiltyFor, rate, locationId, isActive, isApproved } = req.body;
        if (!providerId || !serviceCategoryId || !rate) {
            return res.status(422).json({ message: "Missing required fields.", success: false })
        }
        const provider = await Provider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: "Provider not exists.", success: false })
        }
        // Check if the service already exists for the provider
        const existingService = await ProviderService.findOne({ _id: id, providerId, serviceCategoryId });
        if (!existingService) {
            return res.status(404).json({ message: "Service does not exists for this provider.", success: false });
        }

        const providerService = await ProviderService.findOneAndUpdate({ _id: id, providerId, serviceCategoryId },
            {
                providerId, serviceCategoryId, availabilityDays, availabilityHours, availabilityTime, availabiltyFor, rate, locationId, isActive, isApproved,
                updatedBy: req.user.id, updatedAt: Date.now()
            }
            , { new: true, runValidators: true });

        await providerService.populate('providerId', 'name');
        await providerService.populate('serviceCategoryId', 'name');
        await providerService.populate({
            path: 'locationId',
            select: 'name stateId',
            populate: {
                path: 'stateId',
                select: 'name'
            }
        });

        console.log("providerService", providerService);
        res.status(200).json({
            success: true,
            data: providerService,
            message: "Service Updated Successfully"
        });
    } catch (error) {
        next(error)
        // res.status(500).send(error);
    }
}

// To delete services for a provider
const deleteProviderService = async (req, res, next) => {
    try {
        const providerService = await ProviderService.findByIdAndDelete(req.params.id);
        if (!providerService) {
            return res.status(404).json({ message: "Service not exists." })
        }
        res.status(200).json({
            success: true,
            data: providerService,
            message: "Service delete Successfully"
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

// To get all services for a provider
const getAllProviderServices = async (req, res, next) => {
    try {
        const providerServices = await ProviderService.find({ providerId: req.params.id })
            // .populate('locationId', 'name') // .populate('stateId', 'name')
            .populate({
                path: 'locationId',
                select: 'name stateId',
                populate: {
                    path: 'stateId',
                    select: 'name'
                }
            })
            .populate('serviceCategoryId', 'name')
            .populate('providerId', 'name');
        if (!providerServices) {
            return res.status(404).json({ message: "No services found.", success: false })
        }

        res.status(200).json({
            success: true,
            data: providerServices,
            message: "Services Found Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

/// To get a provider service by ID
const getProviderServiceById = async (req, res, next) => {
    try {
        const providerService = await ProviderService.findById(req.params.id)
            // .populate('stateId', 'name')
            // .populate('locationId', 'name')
            .populate({
                path: 'locationId',
                select: 'name stateId',
                populate: {
                    path: 'stateId',
                    select: 'name'
                }
            })
            .populate('serviceCategoryId', 'name')
            .populate('providerId', 'name');
        if (!providerService) {
            return res.status(404).json({ message: "Service not exists." })
        }
        res.status(200).json({
            success: true,
            data: providerService,
            message: "Service Found Successfully"
        });
    } catch (error) {
        res.status(500).send(error);
    }
}




module.exports = {
    createProvider,
    updateProvider,
    deleteProvider,
    getProviderById,
    getAllProviders,
    addProviderService,
    updateProviderService,
    deleteProviderService,
    getAllProviderServices,
    getProviderServiceById
}