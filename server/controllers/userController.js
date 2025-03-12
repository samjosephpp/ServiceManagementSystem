const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//// to be revised
const create = async (req, res, next) => {

    try {
        const { name, email, password, isPremiumMember, mobile, role } = req.body;
        const isUserExists = await User.findOne({email: email , role: role});
        if(isUserExists) {
            return res.status(400).json({
                message: "User already exists",
                success: false 
            }); 
        }
         // remove this hashing if pre.save enable in userModel.js
         const hashpassword = bcrypt.hashSync(password, 10);

         const user = new User({ name, email, password: hashpassword, isPremiumMember, mobile, role });
         await user.save();

         const token = generateToken(email);
        //  res.cookie('token', token);
 
 
         return res.status(200).send({
             message: "User created successfully",
             success: true,
             token: token
         })


    } catch (error) {
        res.status(400).json(error)
    }
}



const login = async (req, res, next) => {
    const { email, password, role } = req.body;
    try {
        const isUserExists = await User.findOne({ email: email, role: role });
        if (!isUserExists) {
            return res.status(400).json({
                message: "user already exits"
            })
        }
        const passwordMatch = bcrypt.compareSync(password, isUserExists.password);
        
        if (!passwordMatch) {
            return res.status(400).json({ message: "user login failed" });
        }
        //const token = jwt.sign( { data: email }, process.env.JWT_SECRET)
        const token = generateToken(email);

        res.cookie('token', token); // instead of cookie we can use localstorage
        res.setHeader('Authorization', token)
        return res.json({
            message: "User login successfully",
            token: token
        })
        // res.json({ token });

    } catch (error) {
        res.status(400).json(error)
    }
}

const generateToken = (userId) => {
    return jwt.sign( { data: userId }, process.env.JWT_SECRET, {expiresIn:"1h"})
    
}


module.exports = { create, login }