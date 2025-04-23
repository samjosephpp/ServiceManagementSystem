const express = require('express');
const { Location, State } = require('../models/masterModels');
const { ServiceRequest } = require('../models/serviceModels');
const { Provider, ProviderService } = require('../models/providerModel'); // Import the provider model



// to get all Locations (for admin purpose)
const getAllLocations = async (req, res, next) => {

    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Slice the Locations array to get the paginated data

    try {
        const Locations = await Location.find().limit(limit).skip(startIndex).populate('stateId', 'name');;

        // // Add custom field merging state name and location name
        // const locationsWithMergedNames = Locations.map(location => ({
        //     ...location._doc,
        //     mergedName: `${location.stateId.name} - ${location.name}`
        // }));
        // console.log(locationsWithMergedNames);
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
    // console.log(req.body);
    if (!name || !pincode || !stateId) {       //|| !code
        return res.status(422).json({ message: "Name, State and Pincode is required", success: false });
    }
    try {

        const existingLocation = await Location.findOne({ name: name, stateId: stateId });
        if (existingLocation) {
            return res.status(406).json({ message: "Name or Code already exists.", success: false });
        }

        const newLocation = new Location({
            name: name, pincode: pincode, isActive: isActive, stateId: stateId,
            createdBy: req.user.id,
            UpdatedBy: req.user.id
        }); //code: code,
        await newLocation.save();

        await newLocation.populate('stateId', 'name')

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
    // console.log(req.body);
    if (!name || !stateId || !code) {
        return res.status(400).json({ message: "Name, State and Code is required" });
    }

    try { 
         // const existingLocation = await Location.findOne({ $and: [{ name: name, stateId: stateId }, { _id: { $ne: _id } }] });
        const existingLocation = await Location.findOne({
            $and: [
              { name: { $regex: `^${name.trim()}$`, $options: 'i' } },
              { stateId: stateId },
              { _id: { $ne: _id } }
            ]
          });
       
        if (existingLocation) {
            return res.status(406).json({ message: "Location Name or Code already exists.", success: false });
        }

        const updatedLocation = await Location.findByIdAndUpdate(_id  , { name: name, code: code, pincode: pincode, isActive: isActive, stateId: stateId });
        if (!updatedLocation) {
            return res.status(404).json({ message: `Location with id : ${_id} not found.` });
        }

        console.log("updateLocation: ", updatedLocation.validateSync());

        // await updateLocation.save();

        await updatedLocation.populate('stateId', 'name');

        return res.status(201).json({
            message: "Location updated Successfully",
            data: updatedLocation,
            success: true
        });

    } catch (error) {
        next(error)
    }

}

// to update location status (active/inactive)
const updateLocationStatus = async (req, res, next) => {
    const _id = req.params.id;
    const { isActive } = req.body;

    if (isActive === undefined || isActive === null) {
        return res.status(400).json({ message: "isActive status is required" });
    }
    const existingLocation = await Location.findById(_id);
    if (!existingLocation) {
        return res.status(406).json({ message: "Location is not exists.", success: false });
    }
    try {
        const location = await Location.findByIdAndUpdate({ _id: _id }, { isActive: isActive });
        if (!location) {
            return res.status(404).json({ message: `Location with id : ${_id} not found.` });
        }
        // await Location.save();
        return res.status(201).json({
            message: "Location updated Successfully",
            data: location,
            success: true
        });

    } catch (error) {
        console.log("Error in updateLocationStatus: ", error);
        next(error)
    }
}


//to delete a Location
const deleteLocation = async (req, res, next) => {
    const _id = req.params.id;
    try {
        //check any records for this location in other collections
        const serviceRequest = await ServiceRequest.findOne({ locationId: _id });
        if (serviceRequest) {
            return res.status(406).json({ message: "Location is already assigned to Service Request.", success: false });
        }
        const providers = await Provider.findOne({ locationId: _id });
        if (providers) {
            return res.status(406).json({ message: "Location is already assigned to Provider.", success: false });
        }
        const providerService = await ProviderService.findOne({ locationId: _id });
        if (providerService) {
            return res.status(406).json({ message: "Location is already assigned to Provider Service.", success: false });
        }

        const delLocation = await Location.findByIdAndDelete(_id);
        if (!deleteLocation) {
            return res.status(404).json({ message: `Location with id : ${_id} not found.` });
        }
        // await delLocation.save();
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
    deleteLocation,
    updateLocationStatus
}