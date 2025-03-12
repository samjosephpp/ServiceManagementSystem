const express = require('express');
const router = express.Router();

const {  create, login   } = require('../controllers/userController');

router.post('/login', login);   

router.post('/register', create);

module.exports = {userRouter : router}