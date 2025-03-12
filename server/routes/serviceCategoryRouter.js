const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')
const serviceCategories = require('../controllers/serviceCategoryController')


router.get('/', authenticateToken, serviceCategories.getAllServiceCategories )
router.get('/active', authenticateToken,  serviceCategories.getAllActiveServiceCategories )
router.get('/:id',  authenticateToken, serviceCategories.getServiceCategoryById )
router.post('/',  authenticateToken, serviceCategories.createServiceCategory )
router.put('/:id',  authenticateToken, serviceCategories.updateServiceCategory )
router.delete('/:id',  authenticateToken,  serviceCategories.deleteServiceCategory )


module.exports = {serviceCategoryRouter : router}