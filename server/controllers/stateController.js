const express = require('express');
// const { model } = require('mongoose');
const mongoose = require('mongoose'); // Add this line
const { State, Location } = require('../models/masterModels');
// const masterModels = require('../models/masterModels');


// to get all states (for admin purpose)
const getAllStates = async (req, res, next) => {

    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Slice the states array to get the paginated data

    try {
        const states = await State.find().limit(limit).skip(startIndex);
        res.status(200).json({
            data: states,
            page: parseInt(page),
            limit: parseInt(limit),
            totalStates: states.length,
            totalPages: Math.ceil(states.length / limit),
            message: "States retrieved Successfully"
        });

    } catch (error) {
        next(error);
        // res.status(400).json(error);
    }
}


// to get only active states 
const getAllActiveStates = async (req, res, next) => {

    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Slice the states array to get the paginated data

    try {
        const states = await State.find({ isActive: true }).limit(limit).skip(startIndex);
        res.status(200).json({
            data: states,
            page: parseInt(page),
            limit: parseInt(limit),
            totalStates: states.length,
            totalPages: Math.ceil(states.length / limit),
            message: "States retrieved Successfully"
        });

    } catch (error) {
        next(error);
        // res.status(400).json(error);
    }
}


//to get single State details
const getStateById = async (req, res, next) => {
    const _id = req.params.id;
    const state = State.find(state => state._id === _id);
    if (!state) {
        return res.status(404).json({ message: `State with id ${_id} not found` });
    }
    res.status(200).json(state);
}


//to Create a new State
const createState = async (req, res, next) => {
    const { name, description, isActive } = req.body;
    let code = req.body.code || "";
    // console.log(req.body); 
    try {

        if (!name || !description) {
            return res.status(422).json({ message: "Name and description is required", success: false });
        }

        const existingState = await State.findOne({ $or: [{ name: name }, { code: code }] });
        if (existingState) {
            return res.status(406).json({ message: "Name or Code already exists.", success: false });
        }
   

        const newState = new State({
            name,
            code,
            description,
            isActive,
            createdBy: req.user.id,
            updatedBy: req.user.id
        }); 
        
        // console.log("newState: ", newState); 
        // mongoose.set('debug', true);
        // console.log(newState.validateSync());
        // console.log("newState: ", newState.validateSync());

        await newState.save();
 
        if (!newState) {
            return res.status(406).json({ message: "newState error", success: false });
        }
 
        return res.status(200).json({
            message: "New State created Successfully",
            data: newState,
            success: true
        });

    } catch (error) {
        console.log(error);
        next(error)
    }

}

//to Update a State
const updateState = async (req, res, next) => {
    const _id = req.params.id;
    const { name, code, description, isActive } = req.body;
    if (!name || !code || !description) {
        return res.status(400).json({ message: "Name, description and Code is required" });
    }
     
    const existingState = await State.findOne({
        $and: [
          { name: { $regex: `^${name.trim()}$`, $options: 'i' } },
          { _id: { $ne: _id } }
        ]
      });
    if (existingState) {
        return res.status(406).json({ message: "Name or Code already exists.", success: false });
    } 
    
    try {
        const updatedState = await State.findByIdAndUpdate( _id , { name: name.trim(), code: code, description: description.trim(), isActive: isActive });
        if (!updatedState) {
            return res.status(404).json({ message: `State with id : ${_id} not found.` });
        }
        
        return res.status(201).json({
            message: "State updated Successfully",
            data: updatedState,
            success: true
        });

    } catch (error) {
        next(error)
    }

}
//to update a State status
const updateStateStatus = async (req, res, next) => {    
    const _id = req.params.id;  
    const { isActive } = req.body;
    
    
    if (isActive === undefined || isActive === null  ) {
        return res.status(400).json({ message: "isActive is required" });
    }
    const existingState = await State.findById(_id);    
    if (!existingState) {
        return res.status(404).json({ message: `State with id : ${_id} not found.` });  
    }   
    // console.log("isActive: ", req.body); 
    // console.log("existingState: ", existingState);
    try {
        const updatedState = await State.findByIdAndUpdate(_id , { isActive: isActive }, { new: true });
        if (!updatedState) {
            return res.status(404).json({ message: `State with id : ${_id} not found.` });
        }
        return res.status(201).json({
            message: "State updated Successfully",
            data: updatedState,
            success: true
        });

    } catch (error) {
        console.log(error);
        next(error)
    }   

}

//to delete a State
const deleteState = async (req, res, next) => {
    const _id = req.params.id;
    try {

        //check the state is already assigned to any location   
        // const location = await Location.find(location => location.stateId === _id);
        const location = await Location.findOne({ stateId: _id });
        if (location) {
            return res.status(400).json({ message: "State is already assigned to a location." });
        }
        const delState = await State.findByIdAndDelete(_id);
        if (!deleteState) {
            return res.status(404).json({ message: `State with id : ${_id} not found.` });
        }
        // await delState.save();
        return res.status(201).json({
            message: "State deleted Successfully",
            data: delState,
            success: true
        });

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllStates,
    getAllActiveStates,
    getStateById,
    createState,
    updateState,
    deleteState,
    updateStateStatus
}