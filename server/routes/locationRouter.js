const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')
const locationController = require('../controllers/locationController')


router.get('/', authenticateToken, locationController.getAllLocations )
router.get('/active', authenticateToken,  locationController.getAllActiveLocations )
router.get('/:id',  authenticateToken, locationController.getLocationById )
router.get('/statelocations', authenticateToken,  locationController.getAlllocationsWithState )
router.post('/',  authenticateToken, locationController.createLocation )
router.put('/:id',  authenticateToken, locationController.updateLocation )
router.delete('/:id',  authenticateToken,  locationController.deleteLocation )
 

module.exports = {locationRouter : router}