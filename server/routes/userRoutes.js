const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authUser')


const {  create, login , getAllUsers , updateuser, removeUser } = require('../controllers/userController');

router.post('/login', login);   

router.post('/register', create);

router.get('/users', authenticateToken, getAllUsers );
router.patch('/user/:id', authenticateToken, updateuser);
router.delete('/user/:id', authenticateToken, removeUser);

module.exports = {userRouter : router}