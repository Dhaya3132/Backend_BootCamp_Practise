const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Configuration
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Custom Middlewares
app.use((req, res, next) => {
    console.log('Iam from middleware 1');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// Route Middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
