const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {  connectDB } = require('./config/db');
const  errorHandler = require('./errors/errorHandling');

const { userRouter } = require('./routes/userRoutes');
const {stateRouter} = require('./routes/stateRouter');
const { locationRouter } = require('./routes/locationRouter');
const { serviceRouter } = require('./routes/serviceRouter');
const {serviceCategoryRouter} = require('./routes/serviceCategoryRouter');
const {providerRouter} = require('./routes/providerRouter');
const { dashboardRouter } = require('./routes/dashboardRouter');

const app = express();
app.use(express.json());
app.use(cors({
    origin:['https://servicesystem.vercel.app',
            'http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'] ,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    optionsSuccessStatus: 200 // Fixes CORS issues in some legacy browsers
}));


const port = process.env.PORT || 5005;

connectDB();

// Loggin middleware request
app.use( (req,res,next) => {
    console.log(`Executed: ${req.method} ${req.url} Log Time: ${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()} `);
    next();
});

// apply the  routes here

//-------- User Routes
app.use('/api/users' , userRouter )
app.use('/api/state' , stateRouter  )
app.use('/api/location' , locationRouter )
app.use('/api/service' , serviceRouter )
app.use('/api/serviceCategory', serviceCategoryRouter )
app.use('/api/providers', providerRouter )
app.use('/api/dashboard',dashboardRouter)


// Handle error here
app.use(errorHandler);
app.all('*', (req, res, next) => {  
    res.status(404).json({
        message: 'Page not found'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});