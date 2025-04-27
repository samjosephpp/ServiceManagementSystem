const express = require('express');
const mongoose = require('mongoose');

const { User, Role } = require('../models/userModel');
const { Client } = require('../models/clientModel');
const { Provider } = require('../models/providerModel');
const { Location } = require('../models/masterModels');
const { ServiceRequest } = require('../models/serviceModels');

/// Get provider dashboard data
const getProviderDashboardData = async (req, res, next) => {
    try {
        console.log("Fetching provider dashboard data...");
        const _id = req.params.id;
        // console.log("Provider ID:", _id);

        const provider = await Provider.findById(_id);
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }
        const providerId = provider._id;

        // console.log("Provider ID:", provider);    
        // const sr = await ServiceRequest.find({ providerId: providerId });
        // console.log("Service Requests:", sr.length);

        // total request count
        const totalRequestCount = await ServiceRequest.countDocuments({ providerId: providerId });
        // console.log("Total request count:", totalRequestCount);

        // total request count of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRequestCount = await ServiceRequest.countDocuments({ providerId: providerId, createdAt: { $gte: today } });
        // console.log("Today request count:", todayRequestCount);


        //1. Get request count by status
        const requestCountByStatus_data = await ServiceRequest.aggregate([
            { $match: { providerId: providerId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const requestCountByStatus =  requestCountByStatus_data.map(item => ({
            status: item._id,
            count: item.count
          }));
          
        // console.log("Request count by status:", requestCountByStatus);

        //2. Get request count by type
        const requestCountByType = await ServiceRequest.aggregate([
            { $match: { providerId: providerId } },
            { $group: { _id: "$providerServiceId", count: { $sum: 1 } } },
            { $lookup: { from: "providerservices", localField: "_id", foreignField: "_id", as: "providerService" } },
            { $unwind: "$providerService" },
            { $lookup: { from: "servicecategories", localField: "providerService.serviceCategoryId", foreignField: "_id", as: "serviceCategory" } },
            { $unwind: "$serviceCategory" },
            { $group: { _id: "$serviceCategory.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const requestByType = requestCountByType.map(item => ({
            name: item._id,
            count: item.count
        }));

        // console.log("Request count by type:", requestByType);

        //3. Get request count by month (for current year)
        const currentYear = new Date().getFullYear();
        const requestByMonthAggregation = await ServiceRequest.aggregate([
            { $match: { providerId: providerId, createdAt: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) } } },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const requestByMonth = requestByMonthAggregation.map(item => ({
            month: monthNames[item._id - 1],
            count: item.count
        }));
        // const requestByMonth = requestByMonthAggregation.map(item => ({
        //     month: item._id,
        //     count: item.count
        // }));

        //4. Get request count by year
        const requestByYearAggregation = await ServiceRequest.aggregate([
            { $match: { providerId: providerId } },
            { $group: { _id: { $year: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);
        // const requestByYear = {};
        // requestByYearAggregation.forEach(item => {
        //     requestByYear[item._id] = item.count;             
        // }        );
        const requestByYear = requestByYearAggregation.map(item => ({
            year: item._id,
            count: item.count
        }));


        //5. Get request count by provider

        //6. Get request count by provider and status
        const requestByProviderAndStatus = await ServiceRequest.aggregate([
            { $match: { providerId } },
            { $group: { _id: { providerId: "$providerId", status: "$status" }, count: { $sum: 1 } } }
        ]);

        //7. Get request count by provider and type
        const requestByProviderAndType = await ServiceRequest.aggregate([
            { $match: { providerId } },
            { $group: { _id: { providerId: "$providerId", providerServiceId: "$providerServiceId" }, count: { $sum: 1 } } },
            { $lookup: { from: "providerservices", localField: "_id.providerServiceId", foreignField: "_id", as: "providerService" } },
            { $unwind: "$providerService" },
            { $lookup: { from: "servicecategories", localField: "providerService.serviceCategoryId", foreignField: "_id", as: "serviceCategory" } },
            { $unwind: "$serviceCategory" },
            { $group: { _id: "$serviceCategory.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        //8. Get request count by provider and month
        const requestByProviderAndMonth = await ServiceRequest.aggregate([
            { $match: { providerId } },
            { $project: { providerId: 1, month: { $month: "$createdAt" }, year: { $year: "$createdAt" }, count: 1 } },
            { $group: { _id: { providerId: "$providerId", month: "$month" }, count: { $sum: 1 } } },
            { $sort: { "_id.month": 1 } }
        ]);
        const requestByProviderAndMonthResult = requestByProviderAndMonth.map(item => ({
            month: monthNames[item._id.month - 1],
            count: item.count
        }));

        res.status(200).json({
            totalRequestCount,
            todayRequestCount,
            requestByStatus: requestCountByStatus,
            requestByType,
            requestByMonth,
            requestByYear,
            // requestByProvider,
            requestByProviderAndStatus,
            requestByProviderAndType,
            requestByProviderAndMonth: requestByProviderAndMonthResult
        });

    } catch (error) {
        console.error("Error fetching provider dashboard data:", error);
        // res.status(500).json({ message: "Internal server error" });
        next(error);

    }
}


/// Get admin dashboard data
const getAdminDashboardData = async (req, res, next) => {
    try {
        console.log("Fetching admin dashboard data...");
        //1. Get user count
        const userCount = await User.countDocuments(); //{ role: { $ne: Role.ADMIN } }
        //2. Get provider count
        const providerCount = await Provider.countDocuments();
        // Get client count
        const clientCount = await Client.countDocuments();
        //3. Get request count
        const requestCount = await ServiceRequest.countDocuments();

        //4. Get request count by status
        const requestCountByStatus = await ServiceRequest.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        //5. Get request count by type
        const requestCountByType = await ServiceRequest.aggregate([
            {
                $lookup: {
                    from: "providerservices",  // your ProviderService collection name
                    localField: "providerServiceId",
                    foreignField: "_id",
                    as: "providerService"
                }
            },
            { $unwind: "$providerService" },
            {
                $lookup: {
                    from: "servicecategories",  // your ServiceCategory collection name
                    localField: "providerService.serviceCategoryId",
                    foreignField: "_id",
                    as: "serviceCategory"
                }
            },
            { $unwind: "$serviceCategory" },
            {
                $group: {
                    _id: "$serviceCategory.name",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        const requestByType = requestCountByType.map(item => ({
            name: item._id,
            count: item.count
        }));


        // //4. Get request count by status
        // const requestsByStatusAggregation = await ServiceRequest.aggregate([
        //     { $group: { _id: "$status", count: { $sum: 1 } } }
        // ]);

        // const requestByStatus = {};
        // requestsByStatusAggregation.forEach(item => {
        //     requestByStatus[item._id] = item.count;
        // });

        //5. Get request count by type
        // const requestsByTypeAggregation = await ServiceRequest.aggregate([
        //     { $group: { _id: "$providerServiceId", count: { $sum: 1 } } }
        // ]);
        // const requestByType = {};
        // requestsByTypeAggregation.forEach(item => {
        //     requestByType[item._id] = item.count;
        // });

        // 6. Request count by month (for current year)
        const currentYear = new Date().getFullYear();
        const requestByMonthAggregation = await ServiceRequest.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const requestByMonth = requestByMonthAggregation.map(item => ({
            month: monthNames[item._id - 1],
            count: item.count
        }));

        // 7. Request count by year
        const requestByYearAggregation = await ServiceRequest.aggregate([
            { $group: { _id: { $year: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);
        const requestByYear = {};
        requestByYearAggregation.forEach(item => {
            requestByYear[item._id] = item.count;
        });

        // 8. Request count by provider
        const requestByProviderAggregation = await ServiceRequest.aggregate([
            {
                $group: {
                    _id: "$providerId",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "providers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "provider"
                }
            },
            { $unwind: "$provider" },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const requestByProvider = requestByProviderAggregation.map(item => ({
            id: item._id,
            name: item.provider.name,
            count: item.count
        }));

        // Send response
        res.status(200).json({
            users: userCount,
            providers: providerCount,
            requests: requestCount,
            requestByStatus: requestCountByStatus,
            // requestByStatus,
            requestByType,
            requestByMonth,
            requestByYear,
            requestByProvider,

        });

        // // 6. Request count by month (for current year)
        // const requestByMonth = await ServiceRequest.aggregate([
        //     { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
        //     { $project: { _id: 0, month: "$_id", count: 1 } },
        //     { $sort: { month: 1 } }
        // ]);
        // // Get request count by year
        // const requestByYear = await ServiceRequest.aggregate([
        //     { $group: { _id: { $dateToString: { format: "%Y", date: "$createdAt" } }, count: { $sum: 1 } } },
        //     { $project: { _id: 0, year: "$_id", count: 1 } },
        //     { $sort: { year: 1 } }
        // ]);
        // // Get request count by provider
        // const requestByProvider = await ServiceRequest.aggregate([
        //     { $group: { _id: "$providerId", count: { $sum: 1 } } },
        //     { $lookup: { from: "providers", localField: "_id", foreignField: "_id", as: "provider" } },
        //     { $unwind: "$provider" },
        //     { $project: { _id: 0, providerName: "$provider.name", count: 1 } }
        // ]);
        // // Get request count by client
        // const requestByClient = await ServiceRequest.aggregate([
        //     { $group: { _id: "$clientId", count: { $sum: 1 } } },
        //     { $lookup: { from: "clients", localField: "_id", foreignField: "_id", as: "client" } },
        //     { $unwind: "$client" },
        //     { $project: { _id: 0, clientName: "$client.name", count: 1 } }
        // ]);


    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        // res.status(500).json({ message: "Internal server error" });
        next(error);
    }
}

module.exports = {
    getAdminDashboardData,
    getProviderDashboardData
};