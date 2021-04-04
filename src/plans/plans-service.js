const config = require('../config');
const PlansService = {
  getAllPlans(db) {
    return db
      .select('*')
      .from('plans');
  },
    
  getPlanById(db, id) {
    return db
      .select('*')
      .from('plans')
      .where({id})
      .first();
  },
    
  insertPlan(db, newPlan) {
    return db
      .insert(newPlan)
      .into('plans')
      .returning('*')
      .then(rows => rows[0]);
  },
    
  deletePlan(db, id) {
    return db
      .from('plans')
      .where({id})
      .delete();
  },
    
  updatePlan(db, id, newPlanFields) {
    return db
      .from('plans')
      .update(newPlanFields)
      .where({id});
  },

  getTripPlans(db, trip_id) {
    return db
      .select('*')
      .from('plans')
      .where({trip_id});
  }
};
    
module.exports = PlansService;