const express = require('express');
const tourRouter = require('./../controllers/tourController');

const router = express.Router();

router.param('id', tourRouter?.checkIdExist);

router
    .route('/')
    .get(tourRouter?.getAllTour)
    .post(tourRouter?.createTour)

router
    .route('/:id')
    .get(tourRouter?.getTour)
    .patch(tourRouter?.updateTour)
    .delete(tourRouter?.deleteTour)

module.exports = router;