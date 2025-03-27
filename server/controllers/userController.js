const express = require('express');
const { User, Role } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('../models/clientModel');
const { Provider } = require('../models/providerModel');

// In-memory token storage (use a database in production)
let refreshTokens = [];

//// to be revised
const create = async (req, res, next) => {

    let client_id = null, provider_id = null;
    try {
        const { name, email, password, phone,  stateId, locationId, address } = req.body;  //isPremiumMember,
        // console.log(req.body);
        
        let role = req.body.role || 'Client'; // Set default role to 'client' if role is empty
        // console.log("role", role);
        const RoleDb = await Role.findOne({ name: role });
        // console.log(RoleDb)
        if (!RoleDb) {
            return res.status(400).json({
                message: "Invalid role",
                success: false
            });
        }

        const isUserExists = await User.findOne({ email: email, role: RoleDb._id });
        
        if (isUserExists) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }
 
        //Add client if it is not exists in client
        if (role === 'Client') {
            const isClientExists = await Client.findOne({ "email": email });
            if (!isClientExists) {  // if client not exists then create client
                const client = new Client({ name, email, phone, locationId, createdBy : null, role:"Admin" }); // isPremiumMember
                await client.save();
                client_id = client._id;
                // console.log(`New client created with ID: ${client_id}`);
         
            }
            else{
                return res.status(400).json({
                    message: "Client already exists",
                    success: false
                });
            }
        }

        //Add provider if it is not exists in provider
        if (role === 'ServiceProvider') {
            const isProviderExists = await Provider.findOne({ "email": email });
            if (!isProviderExists) {  // if provider not exists then create provider        
                const provider = new Provider({ name, email, phone, locationId, stateId, address , createdBy : null, role:"Admin"}); // isPremiumMember
                await provider.save();
                provider_id = provider._id;
                // console.log(`New provider created with ID: ${provider_id}`);
         
            }
            else{
                return res.status(400).json({
                    message: "Provider already exists",
                    success: false
                });
            }
        }

        // remove this hashing if pre.save enable in userModel.js
        const hashpassword = bcrypt.hashSync(password, 10);

        const user = new User({ name,  password: hashpassword, email, roleId: RoleDb._id,  phone,
                     stateId, locationId,  userType: role ,  
                     clientId: client_id , providerId: provider_id  ,
                     createdBy : null , role:RoleDb.name
                    });
        await user.save();

        if(!user){  // if user not created then delete client and provider
            if(client_id){
                await Client.deleteOne({ _id:
                    client_id });       } 
            if(provider_id){
                await Provider.deleteOne({ _id:
                    provider_id });       }
                    
            return res.status(400).json({
                message: "User not created",
                success: false
            }); 
        }

        //  const token = generateToken(user);
        // //  res.cookie('token', token);

        // Perform user authentication here
        const tokens = await generateAllTokens(user);
        refreshTokens.push(tokens.refreshToken)
        const token = tokens.accessToken;
 
        return res.status(200).send({
            message: "User created successfully",
            success: true,
            token: token,
            refreshToken: tokens.refreshToken
        })


    } catch (error) {
        if(client_id){
            await Client.deleteOne({ _id:
                client_id });       } 
        if(provider_id){
            await Provider.deleteOne({ _id:
                provider_id });       }

        console.log(error);
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
            success: false
        });
    }
}



const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {

        // get the role Id 
        let role = req.body.role || 'Client'; // Set default role to 'client' if role is empty
        const RoleDb = await Role.findOne({ name: role });
    
        const isUserExists = await User.findOne({ email: email, roleId: RoleDb._id });                                
        const hashpassword = bcrypt.hashSync(password, 10);
        // console.log(hashpassword)
        if (!isUserExists) {

            return res.status(400).json({
                message: "user not exits"
            })
        }
        // console.log(isUserExists)

        const passwordMatch = bcrypt.compareSync(password, isUserExists.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: "user login failed", success: false });
        }
        //const token = jwt.sign( { data: email }, process.env.JWT_SECRET)
        // const token = generateToken(email);


        // Perform user authentication here
        const tokens = await generateAllTokens(isUserExists);
        refreshTokens.push(tokens.refreshToken)
        const token = tokens.accessToken;

        // Exclude password from the user data   
        const { password: userPassword, ...userWithoutPassword } = isUserExists._doc;

 
        // res.cookie('token', token); // instead of cookie we can use localstorage
        res.setHeader('Authorization', token)
        return res.json({
            message: "User login successfully",
            data: userWithoutPassword,
            token: token,
            refreshToken: tokens.refreshToken,
            success: true
        })
        // res.json({ token });

    } catch (error) {        
        console.log(error);
        res.status(400).json({
            message: "An error occurred in login    ",
            error: error.message,
            success: false
        });
    }
}


const logout = async (req, res, next) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter((t) => t !== token);
    res.json({ message: 'Logged out successfully' });
}


const generateToken = (userId) => {
    return jwt.sign({ data: userId }, process.env.JWT_SECRET, { expiresIn: "1h" })
}


// Helper function to generate access and refresh tokens
const generateAllTokens = async (user) => {

    // console.log(user)
    const role = await Role.findById(user.roleId);
    const role_name = role.name;
    console.log(role_name);
    const accessToken = jwt.sign({ id: user._id, email: user.email,  role: user.role , role_name: role_name}, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id, email: user.email, role: user.role, role_name:role_name }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

const refreshtoken = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    if (!refreshTokens.includes(token)) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
        const user = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
        const tokens = generateTokens(user);
        // Replace the old refresh token with the new one
        refreshTokens = refreshTokens.filter((t) => t !== token);
        refreshTokens.push(tokens.refreshToken);
        res.json(tokens);
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
}




module.exports = { create, login, refreshtoken, logout }