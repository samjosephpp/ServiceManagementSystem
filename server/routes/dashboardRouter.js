const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')

const dashboardController = require('../controllers/dashboardController');

// router.get('/', authenticateToken, dashboardController.getDashboardData );
router.get('/admin', authenticateToken, dashboardController.getAdminDashboardData );    
router.get('/provider/:id', authenticateToken, dashboardController.getProviderDashboardData );
 

module.exports = {dashboardRouter : router}