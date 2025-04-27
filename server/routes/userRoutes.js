const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')


const {  create, login , getAllUsers , updateuser, removeUser, createProviderUser,getAllProviderUsers } = require('../controllers/userController');

router.post('/login', login);   

router.post('/register', create);

router.get('/users', authenticateToken, getAllUsers );
router.patch('/user/:id', authenticateToken, updateuser);
router.delete('/user/:id', authenticateToken, removeUser);
router.post('/user/:id/providerUser', authenticateToken, createProviderUser);
router.get('/user/provider/:id', authenticateToken, getAllProviderUsers );


module.exports = {userRouter : router}