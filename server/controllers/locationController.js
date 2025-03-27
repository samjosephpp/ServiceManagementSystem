const express = require('express');
const { Location, State } = require('../models/masterModels');


// to get all Locations (for admin purpose)
const getAllLocations = async (req, res, next) => {

    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Slice the Locations array to get the paginated data

    try {
        const Locations = await Location.find().limit(limit).skip(startIndex);
        res.status(200).json({
            data: Locations,
            page: parseInt(page),
            limit: parseInt(limit),
            totalLocations: Locations.length,
            totalPages: Math.ceil(Locations.length / limit),
            message: "Locations retrieved Successfully"
        });

    } catch (error) {
        next(error);
        // res.status(400).json(error);
    }
}


// to get only active Locations 
const getAllActiveLocations = async (req, res, next) => {

    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Slice the Locations array to get the paginated data

    try {
        const Locations = await Location.find({ isActive: true }).limit(limit).skip(startIndex);
        res.status(200).json({
            data: Locations,
            page: parseInt(page),
            limit: parseInt(limit),
            totalLocations: Locations.length,
            totalPages: Math.ceil(Locations.length / limit),
            message: "Locations retrieved Successfully"
        });

    } catch (error) {
        next(error);
        // res.status(400).json(error);
    }
}

// To get all locations with their corresponding state names
const getAlllocationsWithState = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    try {
        const locations = await Location.find({ isActive: true })
            .limit(limit)
            .skip(startIndex)
            .populate('stateId', 'name'); // Populate stateId with state name

        // Add custom field merging state name and location name
        const locationsWithMergedNames = locations.map(location => ({
            ...location._doc,
            mergedName: `${location.stateId.name} - ${location.name}`
        }));

        // console.log(locationsWithMergedNames);
        res.status(200).json({
            data: locationsWithMergedNames,
            page: parseInt(page),
            limit: parseInt(limit),
            totalLocations: locationsWithMergedNames.length,
            totalPages: Math.ceil(locationsWithMergedNames.length / limit),
            message: "Locations retrieved Successfully"
        });

    } catch (error) {
        next(error);
    }
}



//to get single Location details
const getLocationById = async (req, res, next) => {
    const _id = req.params.id;
    const Location = Location.find(Location => Location._id === _id);
    if (!Location) {
        return res.status(404).json({ message: `Location with id ${_id} not found` });
    }
    res.status(200).json(Location);
}


//to Create a new Location
const createLocation = async (req, res, next) => {
    const { name, code, pincode, isActive, stateId } = req.body;
    if (!name || !stateId || !code) {
        return res.status(400).json({ message: "Name, State and Code is required" });
    }
    if (Location.find(Location => Location.stateId === stateId && (Location.name === name || Location.code === code))) {
        return res.status(400).json({ message: "Name or Code is exists." });
    }
    try {

        const newLocation = new Location({ name: name, code: code, pincode: pincode, isActive: isActive, stateId: stateId });
        await newLocation.save();
        return res.status(200).json({
            message: "New Location created Successfully",
            data: newLocation,
            success: true
        });

    } catch (error) {
        next(error)
    }

}

//to Update a Location
const updateLocation = async (req, res, next) => {
    const _id = req.params.id;
    const { name, code, pincode, isActive, stateId } = req.body;
    if (!name || !stateId || !code) {
        return res.status(400).json({ message: "Name, State and Code is required" });
    }
    if (Location.find(Location => Location.stateId === stateId && (Location.name === name || Location.code === code))) {
        return res.status(400).json({ message: "Name or Code is exists." });
    }
    try {
        const Location = Location.findByIdAndUpdate({ id: _id }, { name: name, code: code, pincode: pincode, isActive: isActive, stateId: stateId });
        if (!Location) {
            return res.status(404).json({ message: `Location with id : ${_id} not found.` });
        }
        await Location.save();
        return res.status(201).json({
            message: "Location updated Successfully",
            data: Location,
            success: true
        });

    } catch (error) {
        next(error)
    }

}

//to delete a Location
const deleteLocation = async (req, res, next) => {
    const _id = req.params.id;
    try {
        const delLocation = Location.findByIdAndDelete(_id);
        if (!deleteLocation) {
            return res.status(404).json({ message: `Location with id : ${_id} not found.` });
        }
        await delLocation.save();
        return res.status(201).json({
            message: "Location deleted Successfully",
            data: delLocation,
            success: true
        });

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllLocations,
    getAllActiveLocations,
    getLocationById,
    getAlllocationsWithState,
    createLocation,
    updateLocation,
    deleteLocation
}