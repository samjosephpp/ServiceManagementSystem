const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')
const serviceCategories = require('../controllers/serviceCategoryController')
/// change authenticateToken to adminAuth for admin access only


// get all Active Services for any given location. No Authentication required
router.get('/active',   serviceCategories.getAllActiveServiceCategories )

router.get('/', authenticateToken, serviceCategories.getAllServiceCategories )
router.get('/:id',  authenticateToken, serviceCategories.getServiceCategoryById )
router.post('/',  authenticateToken, serviceCategories.createServiceCategory )
router.put('/:id',  authenticateToken, serviceCategories.updateServiceCategory )
router.delete('/:id',  authenticateToken,  serviceCategories.deleteServiceCategory )


module.exports = {serviceCategoryRouter : router}