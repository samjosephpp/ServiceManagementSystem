const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')

const stateController = require('../controllers/stateController')

router.get('/', authenticateToken, stateController.getAllStates )
router.get('/active', authenticateToken,  stateController.getAllActiveStates )
router.get('/:id',  authenticateToken, stateController.getStateById )
router.post('/',  authenticateToken,  stateController.createState ) 
router.put('/:id',  authenticateToken, stateController.updateState )
router.delete('/:id',  authenticateToken,  stateController.deleteState )
 

module.exports = {stateRouter : router}