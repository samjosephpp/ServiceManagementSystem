const express = require('express');
const { ServiceCategory } = require('../models/masterModels');


// to get all ServiceCategories (for admin purpose)
const getAllServiceCategories =  async (req, res, next)  => {

    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Slice the ServiceCategories array to get the paginated data

    try {
        const serviceCategories = await ServiceCategory.find().limit(limit).skip(startIndex);
        res.status(200).json({
            data: serviceCategories,
            page: parseInt(page),
            limit: parseInt(limit),
            totalServiceCategories: serviceCategories.length,
            totalPages: Math.ceil(serviceCategories.length / limit),
            message: "ServiceCategories retrieved Successfully"
        });
        
    } catch (error) {
        next(error);
        // res.status(400).json(error);
    }
}


// to get only active ServiceCategories 
const getAllActiveServiceCategories =  async (req, res, next) =>{

    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10
    // find the starting and ending indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Slice the ServiceCategories array to get the paginated data

    try {
        const serviceCategories = await ServiceCategory.find({isActive: true}).limit(limit).skip(startIndex);
        res.status(200).json({
            data: serviceCategories,
            page: parseInt(page),
            limit: parseInt(limit),
            totalServiceCategories: serviceCategories.length,
            totalPages: Math.ceil(serviceCategories.length / limit),
            message: "ServiceCategories retrieved Successfully"
        });
        
    } catch (error) {
        next(error);
        // res.status(400).json(error);
    }
}


//to get single ServiceCategory details
const getServiceCategoryById =   async (req, res, next) =>{ 
    const _id = req.params.id;
    const serviceCategory = ServiceCategory.find(serviceCategory => serviceCategory._id === _id);
    if (!serviceCategory) {
        return res.status(404).json({ message: `ServiceCategory with id ${_id} not found` });
    }
    res.status(200).json(serviceCategory);
}


//to Create a new ServiceCategory
const createServiceCategory =  async (req, res, next) =>{
    const {name,  code, description, isActive } = req.body;
    if( !name ||  !code ){
        return res.status(400).json( { message: "Name and Code is required"});
    }
    if( ServiceCategory.find( serviceCategory => serviceCategory.name === name || serviceCategory.code === code  ) ){
        return res.status(400).json( { message: "Name or Code is exists."});
    }
    try {
        
        const newServiceCategory = new ServiceCategory ({ name: name, code: code, description: description , isActive: isActive }); 
        await newServiceCategory.save();
        return res.status(200).json({
            message: "New ServiceCategory created Successfully",
            data: newServiceCategory,
            success: true
        });

    } catch (error) {
        next(error)
    }
   
}

//to Update a ServiceCategory
const updateServiceCategory =  async (req, res, next) =>{
    const _id = req.params.id;
    const {name,  code, description, isActive } = req.body;
    if( !name ||  !code ){
        return res.status(400).json( { message: "Name and Code is required"});
    }
    if( ServiceCategory.find( serviceCategory => serviceCategory.name === name || serviceCategory.code === code  ) ){
        return res.status(400).json( { message: "Name or Code is exists."});
    }
    try {
        const serviceCategory  =  ServiceCategory.findByIdAndUpdate( { id: _id} , { name: name, code: code, description: description, isActive: isActive });
        if(!serviceCategory) {
            return res.status(404).json( { message: `ServiceCategory with id : ${_id} not found.`});
        }
        await serviceCategory.save();
        return res.status(201).json({
            message: "ServiceCategory updated Successfully",
            data: serviceCategory,
            success: true
        });

    } catch (error) {
        next(error)
    }

}

//to delete a ServiceCategory
const deleteServiceCategory =  async (req, res, next) =>{
    const _id = req.params.id;
    try {
        const delServiceCategory = ServiceCategory.findByIdAndDelete( _id);
        if(!deleteServiceCategory) {
            return res.status(404).json( { message: `ServiceCategory with id : ${_id} not found.`});
        }
        await delServiceCategory.save();
        return res.status(201).json({
            message: "ServiceCategory deleted Successfully",
            data: delServiceCategory,
            success: true
        });
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllServiceCategories,
    getAllActiveServiceCategories,
    getServiceCategoryById,
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory
}