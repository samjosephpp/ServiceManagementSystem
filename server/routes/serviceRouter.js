const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')
// const {getAvailableServices, getServiceRequestsByUserOrProvider } = require('../controllers/serviceController')
// const serviceCategories = require('../controllers/serviceCategoryController')

const serviceController =  require('../controllers/serviceController')

// Route to get available services //authenticateToken not required
//http://localhost:3000/api/services/available-services?serviceCategoryId=abc123&locationId=xyz789
router.get('/available-services0',  async (req, res, next) => {
    const { serviceCategoryId, locationId } = req.query;

    if (!serviceCategoryId || !locationId) {
        return res.status(400).json({ message: "Service Category ID and Location ID are required" });
    }

    try {
        const services = await serviceController.getAvailableServices(serviceCategoryId, locationId);
        res.status(200).json({ data: services, message: "Available services retrieved successfully" });
    } catch (error) {
        next(error);
    }
});


// Route to get service requests by user or provider with authentication
//http://localhost:3000/api/services/service-requests?userId=12345&providerId=67890
router.get('/service-requests', authenticateToken, serviceController.getServiceRequestsByUserOrProvider);

// Route to create a service request with authentication
router.post('/service-request', authenticateToken, serviceController.createRequest);
// Route to view a service request by ID with authentication
router.get('/service-request/:id', authenticateToken, serviceController.viewRequestById);
// Route to update a service request by ID with authentication
router.put('/service-request/:id', authenticateToken, serviceController.updateRequest);
// Route to create a payment for a service request with authentication
router.post('/service-payment', authenticateToken, serviceController.servicePayment);
// Route to create feedback for a service request with authentication
router.post('/service-feedback', authenticateToken, serviceController.serviceFeedback);
// Route to get all service requests feedback with authentication
router.get('/all-service-feedbacks', authenticateToken, serviceController.getAllFeedbacks);
// Route to update the status of a service request with authentication
router.patch('/service-request/:id/status', authenticateToken, serviceController.updateRequestStatus);
// Route to update the status and payment status of a service request with authentication
router.patch('/service-request/:id/status-payment', authenticateToken, serviceController.updateRequestStatusAndPayment);
// Route to get all service requests with authentication
router.get('/all-service-requests', authenticateToken, serviceController.getAllRequest);
// Route to get available services for a given service category in a specific location
router.get('/available-services', serviceController.getAvailableServices);


module.exports = {serviceRouter : router}