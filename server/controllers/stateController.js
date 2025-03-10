const express = require('express');
// const { model } = require('mongoose');
const { State } = require('../models/masterModels');


// to get all states (for admin purpose)
const getAllStates =  async (req, res, next)  => {

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
const getAllActiveStates =  async (req, res, next) =>{

    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Slice the states array to get the paginated data

    try {
        const states = await State.find({isActive: true}).limit(limit).skip(startIndex);
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
const getStateById =   async (req, res, next) =>{ 
    const _id = req.params.id;
    const state = State.find(state => state._id === _id);
    if (!state) {
        return res.status(404).json({ message: `State with id ${_id} not found` });
    }
    res.status(200).json(state);
}


//to Create a new State
const createState =  async (req, res, next) =>{
    const {name,  code, description, isActive } = req.body;
    if( !name ||  !code ){
        return res.status(400).json( { message: "Name and Code is required"});
    }
    if( State.find( state => state.name === name || state.code === code  ) ){
        return res.status(400).json( { message: "Name or Code is exists."});
    }
    try {
        
        const newState = new State ({ name: name, code: code, description: description , isActive: isActive }); 
        await newState.save();
        return res.status(200).json({
            message: "New State created Successfully",
            data: newState,
            success: true
        });

    } catch (error) {
        next(error)
    }
   
}

//to Update a State
const updateState =  async (req, res, next) =>{
    const _id = req.params.id;
    const {name,  code, description, isActive } = req.body;
    if( !name ||  !code ){
        return res.status(400).json( { message: "Name and Code is required"});
    }
    if( State.find( state => state.name === name || state.code === code  ) ){
        return res.status(400).json( { message: "Name or Code is exists."});
    }
    try {
        const state  =  State.findByIdAndUpdate( { id: _id} , { name: name, code: code, description: description, isActive: isActive });
        if(!state) {
            return res.status(404).json( { message: `State with id : ${_id} not found.`});
        }
        await state.save();
        return res.status(201).json({
            message: "State updated Successfully",
            data: state,
            success: true
        });

    } catch (error) {
        next(error)
    }

}

//to delete a State
const deleteState =  async (req, res, next) =>{
    const _id = req.params.id;
    try {
        const delState = State.findByIdAndDelete( _id);
        if(!deleteState) {
            return res.status(404).json( { message: `State with id : ${_id} not found.`});
        }
        await delState.save();
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
    deleteState
}