const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')
/// change authenticateToken to adminAuth for admin access only

const Providers = require('../controllers/providerController')

// Route to create a provider  with authentication
router.post('/', authenticateToken, Providers.createProvider);
// Route to update a provider  with authentication
router.patch('/:id', authenticateToken, Providers.updateProvider);
// Route to delete a provider  with authentication
router.delete('/:id', authenticateToken, Providers.deleteProvider);
// Route to view a provider by ID with authentication
router.get('/:id', authenticateToken, Providers.getProviderById);
// Route to view all providers with authentication
router.get('/', authenticateToken, Providers.getAllProviders);
// Route to add new service to the provider with authentication
router.post('/service', authenticateToken, Providers.addProviderService);
// Route to update a service with authentication
router.patch('/service/:id', authenticateToken, Providers.updateProviderService);
// Route to delete a service with authentication
router.delete('/service/:id', authenticateToken, Providers.deleteProviderService);


module.exports = {providerRouter : router}