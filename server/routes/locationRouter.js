const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')
const locationController = require('../controllers/locationController')



// get all locations with state . No Authentication required.
router.get('/statelocations',   locationController.getAlllocationsWithState ) 

router.get('/', authenticateToken, locationController.getAllLocations )
router.get('/active', authenticateToken,  locationController.getAllActiveLocations )
router.get('/:id',  authenticateToken, locationController.getLocationById )


router.post('/',  authenticateToken,  locationController.createLocation ) 
router.put('/:id',  authenticateToken, locationController.updateLocation )
router.delete('/:id',  authenticateToken,  locationController.deleteLocation )
 

module.exports = {locationRouter : router}