const express = require('express');
const path = require('path');
const { requireAuth } = require('../middleware/api-auth');
const xss = require('xss');
const TripsService = require('./trips-service');

const tripsRouter = express.Router();
const jsonParser = express.json();

const serializeTrip = trip => ({
  id: trip.id,
  trip_title: xss(trip.trip_title),
  user_id: trip.user_id
});

tripsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const db = req.app.get('db');
    TripsService.getAllTrips(db, req.user.id)
      .then(trips => res.status(200).json(trips.map(serializeTrip)))
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { trip_title } = req.body;
    const user_id = req.user.id;
  
    if (!user_id) {
      return res
        .status(400).json({
          error: { message: 'Missing userid' }
        });
    }
    if (!trip_title) {
      return res
        .status(400).json({
          error: { message: 'Missing Trip title' }
        });
    }

    let newTrip = { user_id, trip_title };

    TripsService.insertTrip(
      req.app.get('db'),
      newTrip
    )
      .then((trip) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${trip.id}`))
          .json(serializeTrip(trip));
      })
      .catch(next);
  });
  
  

tripsRouter
  .route('/:tripId')
  .all((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.tripId;
    TripsService.getTripById(db, id)
      .then(trip => {
        if(!trip) {
          return res.status(404).json({error: {message: 'Trip does not exist'}});
        }
        res.trip = trip;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.status(200).json(res.trip);
  })
  .delete((req, res, next) =>{
    const db = req.app.get('db');
    const id = req.params.tripId;

    TripsService.deleteTrip(db, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = tripsRouter;