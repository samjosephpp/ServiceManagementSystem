const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')

const stateController = require('../controllers/stateController')

router.get('/', authenticateToken, stateController.getAllStates )
router.get('/active', authenticateToken,  stateController.getAllActiveStates )
router.get('/:id',  authenticateToken, stateController.getStateById )
router.post('/',  authenticateToken,  stateController.createState ) 
router.patch('/:id',  authenticateToken, stateController.updateState )
router.delete('/:id',  authenticateToken,  stateController.deleteState )
router.patch('/status/:id',  authenticateToken, stateController.updateStateStatus )
 

module.exports = {stateRouter : router}