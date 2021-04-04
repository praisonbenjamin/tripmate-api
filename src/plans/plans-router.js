const express = require('express');
const path = require('path');
const xss = require('xss');
const { requireAuth } = require('../middleware/api-auth');
const PlansService = require('./plans-service');

const plansRouter = express.Router();
const jsonParser = express.json();

const serializePlan = plan => ({
  id: plan.id,
  location: xss(plan.location),
  from_date: plan.from_date,
  to_date: plan.to_date,
  notes: xss(plan.notes),
  trip_id: plan.trip_id
});

plansRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    PlansService.getAllPlans(db)
      .then(plans => res.status(200).json(plans.map(serializePlan)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { location, from_date, to_date, notes, trip_id } = req.body;
    const newPlan = { location, from_date, to_date, notes, trip_id };
    const db = req.app.get('db');

    if(!location) {
      return res.status(400).json( {error: {message: 'Location is required'}} );
    }
    if(!from_date) {
      return res.status(400).json( {error: {message: 'From date is required'}} );
    }
    if(!to_date) {
      return res.status(400).json( {error: {message: 'To date is required'}} );
    }
    if(!notes) {
      return res.status(400).json( {error: {message: 'Trip notes is required'}} );
    }

    PlansService.insertPlan(db, newPlan)
      .then(plan => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl,`/${plan.Id}`))
          .json(serializePlan(plan));
      })
      .catch(next);
  });

plansRouter
  .route('/trips/:trip_id')
  .get((req, res, next) => {
    PlansService.getTripPlans(
      req.app.get('db'),
      res.trip.id
    )
      .then(plans => {
        return res.json(plans.map(serializePlan));
      })
      .catch(next);
  });

plansRouter
  .route('/:planId')
  .all((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.planId;

    PlansService.getPlanById(db, id)
      .then(plan => {
        if(!plan) {
          return res.status(404).json( {error: {message: 'Trip plan doesn\'t exist'}} );
        }
        res.plan = plan;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.status(200).json(res.plan);
  })
  .delete((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.planId;

    PlansService.deletePlan(db, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { location, from_date, to_date, notes, trip_id } = req.body;
    const planToUpdate = { location, from_date, to_date, notes, trip_id };

    const numberOfValues = Object.values(planToUpdate).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json( {error: {message: 'Request body must contain \'location\', \'from_date\', \'to_date\', \'notes\', or \'trip\''}});
    }

    const db = req.app.get('db');
    const id = req.params.planId;

    PlansService.updatePlan(db, id, planToUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

plansRouter
  .route('/trips')
  .get((req, res, next) => {
    PlansService.getTripPlans(
      req.app.get('db'),
      req.params.tripId
    )
      .then(plans => res.status(200).json(plans.map(serializePlan)))
      .catch(next);
  });


module.exports = plansRouter;