const express = require('express');
const { model } = require('mongoose');
const Provider = require('../models/providerModel'); // Import the provider model

// Create a new provider
const createProvider = async (req, res, next) => {
    try {
        if (req.user.role != "Admin") { return res.status(403).json({ message: "Access denied" }) }
        const { name, code, stateId, locationId, address, email, phone, isActive, isApproved } = req.body;
        if (!name || !code || !stateId || !locationId || !address || !email || !phone) {
            return res.status(400).json({ message: "Missing required fields." })
        }
        const isProviderExists = await Provider.Provider.find({ email: email, name: name })
        if (isProviderExists) {
            return res.status(400).json({ message: "Provider already exists." })
        }
        const provider = new Provider({
            name, code, stateId, locationId, address, email, phone, isActive, isApproved,
            createdBy: req.user._id,
            UpdatedBy: req.user._id
        });
        await provider.save();
        res.status(201).json({
            success: true,
            data: provider,
            message: "New Provider Successfully created"
        });

    } catch (error) {
        res.status(400).send(error);
    }
}

// Update a provider by ID
const updateProvider = async (req, res, next) => {
    try {
        if (req.user.role != "Admin") { return res.status(403).json({ message: "Access denied" }) }
        const { name, code, stateId, locationId, address, email, phone, isActive, isApproved } = req.body;
        if (!name || !code || !stateId || !locationId || !address || !email || !phone) {
            return res.status(400).json({ message: "Missing required fields." })
        }
        const provider = await Provider.findByIdAndUpdate(req.params.id,
            {
                name, code, stateId, locationId, address, email, phone, isActive, isApproved,
                UpdatedBy: req.user._id, updatedAt: Date.now()
            }
            , { new: true, runValidators: true });
        if (!provider) {

            return res.status(404).json({ message: "Provider not exists." })
        }
        res.status(200).json({
            success: true,
            data: provider,
            message: "Provider Updated Successfully"
        });
    } catch (error) {
        res.status(400).send(error);
    }
}


const deleteProvider = async (req, res, next) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: "Provider not exists." })
        }
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

module.exports = {
    createProvider,
    updateProvider,
    deleteProvider,
    getProviderById,
    getAllProviders
}